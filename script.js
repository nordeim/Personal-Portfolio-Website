// script.js - Portfolio functionality with accessibility and performance optimizations
// Updated fixes:
// - Normalize fetched projects JSON (handle { "projects": [...] } root).
// - Await projects.init() in main init flow.
// - Add .js-loaded class to document element to reveal .hidden-until-loaded sections.
// - Small guards for missing tags and empty projects display.

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        FORM_ENDPOINT: 'https://formspree.io/f/YOUR_FORM_ID',
        PROJECTS_DATA: 'content/projects.json',
        THEME_KEY: 'portfolio-theme',
        FOCUSABLE_ELEMENTS: 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    };
    
    // State management
    const state = {
        currentTheme: 'auto',
        projects: [],
        modalOpen: false,
        lastFocusedElement: null
    };
    
    // Utility functions
    const utils = {
        // Safe DOM selection
        qs: (selector, context = document) => context.querySelector(selector),
        qsa: (selector, context = document) => context.querySelectorAll(selector),
        
        // Create element with attributes
        create: (tag, attrs = {}, ...children) => {
            const element = document.createElement(tag);
            Object.entries(attrs).forEach(([key, value]) => {
                if (key === 'className') element.className = value;
                else if (key === 'dataset') Object.assign(element.dataset, value);
                else element.setAttribute(key, value);
            });
            children.forEach(child => {
                if (typeof child === 'string') element.appendChild(document.createTextNode(child));
                else if (child instanceof Node) element.appendChild(child);
            });
            return element;
        },
        
        // Debounce function for performance
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Trap focus within element
        trapFocus: (element) => {
            const focusableElements = element.querySelectorAll(CONFIG.FOCUSABLE_ELEMENTS);
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            const handler = (e) => {
                if (e.key !== 'Tab') return;
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement && lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement && firstElement.focus();
                        e.preventDefault();
                    }
                }
            };
            
            element.addEventListener('keydown', handler);
            
            firstElement && firstElement.focus();
            
            // Return a cleanup function in case caller wants to remove the listener later
            return () => element.removeEventListener('keydown', handler);
        },
        
        // Announce to screen readers
        announce: (message) => {
            const announcement = utils.create('div', {
                className: 'sr-only',
                role: 'status',
                'aria-live': 'polite'
            });
            document.body.appendChild(announcement);
            announcement.textContent = message;
            setTimeout(() => announcement.remove(), 1000);
        }
    };
    
    // Theme management
    const theme = {
        init() {
            const saved = localStorage.getItem(CONFIG.THEME_KEY);
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            state.currentTheme = saved || 'auto';
            this.apply(state.currentTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : state.currentTheme);
            this.setupToggle();
            this.listenForSystemChanges();
        },
        
        apply(themeName) {
            const root = document.documentElement;
            const toggle = utils.qs('#theme-toggle');
            
            if (themeName === 'dark') {
                root.setAttribute('data-theme', 'dark');
                if (toggle) toggle.setAttribute('aria-pressed', 'true');
                if (toggle && toggle.querySelector('.theme-icon')) toggle.querySelector('.theme-icon').textContent = '☀️';
            } else {
                root.setAttribute('data-theme', 'light');
                if (toggle) toggle.setAttribute('aria-pressed', 'false');
                if (toggle && toggle.querySelector('.theme-icon')) toggle.querySelector('.theme-icon').textContent = '🌙';
            }
        },
        
        setupToggle() {
            const toggle = utils.qs('#theme-toggle');
            if (!toggle) return;
            
            toggle.addEventListener('click', () => {
                const current = state.currentTheme === 'auto' 
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : state.currentTheme;
                
                const newTheme = current === 'dark' ? 'light' : 'dark';
                state.currentTheme = newTheme;
                
                this.apply(newTheme);
                localStorage.setItem(CONFIG.THEME_KEY, newTheme);
                utils.announce(`Switched to ${newTheme} mode`);
            });
        },
        
        listenForSystemChanges() {
            if (!window.matchMedia) return;
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            // Use both addEventListener and fallback to addListener for broader support
            if (typeof mediaQuery.addEventListener === 'function') {
                mediaQuery.addEventListener('change', (e) => {
                    if (state.currentTheme === 'auto') {
                        this.apply(e.matches ? 'dark' : 'light');
                    }
                });
            } else if (typeof mediaQuery.addListener === 'function') {
                mediaQuery.addListener((e) => {
                    if (state.currentTheme === 'auto') {
                        this.apply(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }
    };
    
    // Navigation
    const navigation = {
        init() {
            this.setupSmoothScrolling();
            this.setupMobileNav();
            this.setupActiveLinkTracking();
        },
        
        setupSmoothScrolling() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (!link) return;
                
                // Allow links that are plain hashes (#) to behave normally if needed
                const href = link.getAttribute('href');
                if (!href || href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        },
        
        setupMobileNav() {
            // Mobile nav toggle would go here if needed
            // For now, keeping simple navigation
        },
        
        setupActiveLinkTracking() {
            if (!('IntersectionObserver' in window)) return;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        const activeLink = utils.qs(`a[href="#${id}"]`);
                        if (activeLink) {
                            utils.qsa('.nav-links a').forEach(link => link.classList.remove('active'));
                            activeLink.classList.add('active');
                        }
                    }
                });
            }, { threshold: 0.5 });
            
            utils.qsa('section[id]').forEach(section => observer.observe(section));
        }
    };
    
    // Projects
    const projects = {
        async init() {
            await this.loadProjects();
            this.render();
            this.setupModalHandlers();
        },
        
        async loadProjects() {
            try {
                const response = await fetch(CONFIG.PROJECTS_DATA, {cache: "no-cache"});
                if (!response.ok) throw new Error('Failed to load projects');
                const data = await response.json();
                
                // Normalize to an array whether the JSON is an array or an object with { projects: [...] }
                if (Array.isArray(data)) {
                    state.projects = data;
                } else if (Array.isArray(data.projects)) {
                    state.projects = data.projects;
                } else {
                    state.projects = [];
                }
            } catch (error) {
                console.error('Error loading projects:', error);
                // Fallback to hardcoded projects
                state.projects = this.getFallbackProjects();
            }
        },
        
        getFallbackProjects() {
            return [
                {
                    id: 1,
                    title: "E-Commerce Platform",
                    description: "Modern e-commerce solution with real-time inventory management and payment processing.",
                    image: "assets/images/project-1.jpg",
                    tags: ["React", "Node.js", "MongoDB"],
                    repoUrl: "https://github.com/username/ecommerce",
                    liveUrl: "https://ecommerce-demo.com"
                },
                {
                    id: 2,
                    title: "Task Management App",
                    description: "Collaborative task management tool with real-time updates and team analytics.",
                    image: "assets/images/project-2.jpg",
                    tags: ["Vue.js", "Firebase", "Tailwind"],
                    repoUrl: "https://github.com/username/task-manager",
                    liveUrl: "https://task-manager-demo.com"
                },
                {
                    id: 3,
                    title: "Weather Dashboard",
                    description: "Interactive weather dashboard with location-based forecasts and historical data visualization.",
                    image: "assets/images/project-3.jpg",
                    tags: ["D3.js", "API", "Chart.js"],
                    repoUrl: "https://github.com/username/weather-dashboard",
                    liveUrl: "https://weather-demo.com"
                }
            ];
        },
        
        render() {
            const grid = utils.qs('#projects-grid');
            if (!grid) return;
            
            grid.innerHTML = '';
            
            if (!state.projects || state.projects.length === 0) {
                const empty = utils.create('div', { className: 'loading' }, 'No projects to display.');
                grid.appendChild(empty);
                return;
            }
            
            state.projects.forEach(project => {
                const card = this.createProjectCard(project);
                grid.appendChild(card);
            });
        },
        
        createProjectCard(project) {
            const tags = Array.isArray(project.tags) ? project.tags : [];
            const card = utils.create('article', {
                className: 'project-card',
                tabindex: 0,
                role: 'button',
                'aria-label': `View details for ${project.title}`,
                'data-project-id': project.id
            });
            
            // Build innerHTML safely (small template)
            const imgSrc = project.image || '';
            const title = project.title || 'Untitled Project';
            const desc = project.description || '';
            const tagsHtml = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            
            card.innerHTML = `
                <img src="${imgSrc}" alt="${title}" class="project-image" loading="lazy">
                <div class="project-content">
                    <h3 class="project-title">${title}</h3>
                    <p class="project-description">${desc}</p>
                    <div class="project-tags">
                        ${tagsHtml}
                    </div>
                </div>
            `;
            
            // Click handler
            card.addEventListener('click', () => this.openModal(project));
            
            // Keyboard handler
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openModal(project);
                }
            });
            
            return card;
        },
        
        setupModalHandlers() {
            const modal = utils.qs('#project-modal');
            if (!modal) return;
            const closeBtn = utils.qs('.modal-close');
            
            // Close modal
            closeBtn && closeBtn.addEventListener('click', () => this.closeModal());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
            
            // Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.modalOpen) {
                    this.closeModal();
                }
            });
        },
        
        openModal(project) {
            const modal = utils.qs('#project-modal');
            const title = utils.qs('#modal-title');
            const content = utils.qs('#modal-content');
            if (!modal || !title || !content) return;
            
            // Save current focus
            state.lastFocusedElement = document.activeElement;
            
            // Populate modal
            const img = project.image ? `<img src="${project.image}" alt="${project.title}">` : '';
            const desc = project.description || '';
            const tagsHtml = (Array.isArray(project.tags) ? project.tags : []).map(tag => `<span class="tag">${tag}</span>`).join('');
            const repoUrl = project.repoUrl || '#';
            const liveUrl = project.liveUrl || '#';
            
            title.textContent = project.title || 'Project';
            content.innerHTML = `
                ${img}
                <p style="margin-bottom: var(--spacing-lg);">${desc}</p>
                <div style="margin-bottom: var(--spacing-lg);">
                    <h4 style="margin-bottom: var(--spacing-sm);">Technologies Used</h4>
                    <div class="project-tags">
                        ${tagsHtml}
                    </div>
                </div>
                <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap;">
                    <a href="${repoUrl}" class="cta" target="_blank" rel="noopener noreferrer">View Code</a>
                    <a href="${liveUrl}" class="cta" target="_blank" rel="noopener noreferrer">Live Demo</a>
                </div>
            `;
            
            // Show modal
            modal.classList.add('active');
            state.modalOpen = true;
            
            // Trap focus; store cleanup so we could remove if desired
            this._releaseFocus = utils.trapFocus(modal);
            utils.announce(`Opened details for ${project.title}`);
        },
        
        closeModal() {
            const modal = utils.qs('#project-modal');
            if (!modal) return;
            modal.classList.remove('active');
            state.modalOpen = false;
            
            // Restore focus
            if (state.lastFocusedElement) {
                state.lastFocusedElement.focus();
            }
            
            // Remove focus trap listener if set
            if (typeof this._releaseFocus === 'function') {
                this._releaseFocus();
                this._releaseFocus = null;
            }
            
            utils.announce('Closed project details');
        }
    };
    
    // Contact Form
    const contactForm = {
        init() {
            this.setupValidation();
            this.setupSubmission();
        },
        
        setupValidation() {
            const form = utils.qs('#contact-form');
            if (!form) return;
            
            const inputs = utils.qsa('input[required], textarea[required]');
            
            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
            
            // Form submission
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        },
        
        validateField(field) {
            const value = field.value.trim();
            const error = utils.qs(`#${field.id}-error`);
            let message = '';
            
            if (!value) {
                message = 'This field is required';
            } else if (field.type === 'email' && !this.isValidEmail(value)) {
                message = 'Please enter a valid email address';
            }
            
            if (message) {
                this.showError(field, message);
                return false;
            }
            
            return true;
        },
        
        showError(field, message) {
            const error = utils.qs(`#${field.id}-error`);
            if (error) {
                error.textContent = message;
                field.setAttribute('aria-invalid', 'true');
            }
        },
        
        clearError(field) {
            const error = utils.qs(`#${field.id}-error`);
            if (error) {
                error.textContent = '';
                field.setAttribute('aria-invalid', 'false');
            }
        },
        
        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        
        async handleSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = utils.qs('button[type="submit"]', form);
            const status = utils.qs('#form-status');
            
            // Validate all fields
            const requiredFields = utils.qsa('input[required], textarea[required]', form);
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                utils.announce('Please fix the errors in the form');
                return;
            }
            
            // Disable submit button
            if (submitBtn) {
                submitBtn.disabled = true;
                // Keep existing markup for inner spans; set aria-busy instead of replacing text
                submitBtn.setAttribute('aria-busy', 'true');
            }
            
            // Prepare form data
            const formData = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    this.showSuccess(status);
                    form.reset();
                    utils.announce('Message sent successfully');
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                this.showError(status, 'Failed to send message. Please try again.');
                utils.announce('Failed to send message');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                }
            }
        },
        
        showSuccess(status) {
            if (!status) return;
            status.innerHTML = '<p style="color: var(--success); margin-top: var(--spacing-md);">✓ Message sent successfully! I\'ll get back to you soon.</p>';
            setTimeout(() => status.innerHTML = '', 5000);
        },
        
        showError(status, message) {
            if (!status) return;
            status.innerHTML = `<p style="color: var(--error); margin-top: var(--spacing-md);">✗ ${message}</p>`;
            setTimeout(() => status.innerHTML = '', 5000);
        }
    };
    
    // Performance monitoring
    const performance = {
        init() {
            try {
                this.measureLCP();
                this.measureFID();
                this.measureCLS();
            } catch (err) {
                // Not critical; don't block rest of app
                console.warn('Performance monitoring not fully supported in this environment', err);
            }
        },
        
        measureLCP() {
            if (!('PerformanceObserver' in window)) return;
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    console.log(`LCP: ${lastEntry.startTime}ms`);
                    if (lastEntry.startTime > 2500) {
                        console.warn('LCP exceeds target of 2.5s');
                    }
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        },
        
        measureFID() {
            if (!('PerformanceObserver' in window)) return;
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
                });
            }).observe({ entryTypes: ['first-input'] });
        },
        
        measureCLS() {
            if (!('PerformanceObserver' in window)) return;
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log(`CLS: ${clsValue}`);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    };
    
    // Initialize everything when DOM is ready
    async function init() {
        // Check for DOM readiness
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Initialize modules
        theme.init();
        navigation.init();
        await projects.init(); // await to ensure projects load and render before revealing content
        contactForm.init();
        performance.init();
        
        // Reveal JS-loaded content
        document.documentElement.classList.add('js-loaded');
        
        // Announce page load to screen readers
        utils.announce('Portfolio page loaded');
        
        console.log('Portfolio initialized successfully');
    }
    
    // Start the application
    init();
    
})();
