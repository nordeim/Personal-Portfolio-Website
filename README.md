# Portfolio Website

An accessible, performant, and responsive portfolio website built with vanilla HTML, CSS, and JavaScript. Deployed on GitHub Pages with Formspree integration for contact forms.

## 🚀 Features

- **Accessibility First**: WCAG 2.1 Level AA compliant
- **Performance Optimized**: Lighthouse score >90, LCP ≤ 2.5s
- **Dark Mode**: System preference detection with manual override
- **Responsive Design**: Mobile-first approach, 320px to 1920px+
- **SEO Ready**: Structured data, meta tags, semantic HTML
- **Contact Form**: Formspree integration with spam protection
- **Project Showcase**: Interactive modal details with keyboard navigation
- **Progressive Enhancement**: Works without JavaScript

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Hosting**: GitHub Pages
- **Forms**: Formspree
- **Analytics**: Plausible (privacy-focused)
- **Testing**: Lighthouse, axe-core, Playwright
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
portfolio/
├── site/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Main stylesheet
│   ├── script.js           # Main JavaScript
│   └── assets/
│       ├── images/         # Optimized images (AVIF, WebP, JPEG)
│       └── fonts/          # Custom fonts (if any)
├── content/
│   └── projects.json       # Project data
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD pipeline
├── lighthouserc.js         # Lighthouse configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Git
- A Formspree account (for contact form)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Update configuration:
   - Replace `YOUR_FORM_ID` in `site/index.html` with your Formspree form ID
   - Update project data in `content/projects.json`
   - Replace placeholder images in `site/assets/images/`

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:8080 in your browser

## 🧪 Testing

### Accessibility Testing
```bash
npm run test:a11y
```

### Performance Testing
```bash
npm run test:performance
```

### Linting
```bash
npm run lint
```

### Code Formatting
```bash
npm run format
```

## 📊 Performance Budget

- **JavaScript**: ≤ 100KB gzipped
- **CSS**: ≤ 50KB gzipped  
- **Images**: ≤ 300KB above-the-fold
- **LCP**: ≤ 2.5s (target)
- **FID**: ≤ 100ms
- **CLS**: ≤ 0.1

## 🎯 Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Color contrast compliance
- Reduced motion support
- Skip navigation link

## 🌙 Dark Mode Implementation

The site supports both system preference and manual toggle:

1. Detects `prefers-color-scheme` media query
2. Stores user preference in localStorage
3. Applies theme using CSS custom properties
4. Persists across page reloads

## 📧 Contact Form Setup

1. Create a free account at [Formspree](https://formspree.io)
2. Create a new form and copy the form ID
3. Replace `YOUR_FORM_ID` in `site/index.html`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## 🚀 Deployment

### Automatic Deployment (Recommended)

1. Push to `main` branch
2. GitHub Actions will automatically:
   - Run tests and checks
   - Optimize assets
   - Deploy to GitHub Pages

### Manual Deployment

```bash
# Build and test
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🔧 Customization

### Colors and Typography

Update CSS custom properties in `site/styles.css`:

```css
:root {
  --accent: #0066ff;           /* Primary color */
  --bg: #ffffff;               /* Background */
  --text: #0b0b0b;             /* Text color */
  --font-system: system-ui;    /* Font stack */
}
```

### Project Data

Edit `content/projects.json` to add/update projects:

```json
{
  "id": "proj-1",
  "title": "Project Name",
  "description": "Project description",
  "image": "assets/images/project.jpg",
  "tags": ["React", "Node.js"],
  "repoUrl": "https://github.com/username/repo",
  "liveUrl": "https://demo.com"
}
```

### SEO and Meta Tags

Update in `site/index.html`:

```html
<meta property="og:title" content="Your Name - Portfolio">
<meta property="og:description" content="Your description">
<meta property="og:image" content="assets/images/og-image.jpg">
```

## 📈 Analytics Integration

### Plausible Analytics (Recommended)

1. Sign up at [Plausible](https://plausible.io)
2. Add your domain
3. Insert tracking script in `site/index.html`

### Google Analytics

1. Create GA4 property
2. Add measurement ID to configuration
3. Update tracking code in `script.js`

## 🔒 Security Considerations

- Content Security Policy headers
- No inline JavaScript
- Formspree for secure form handling
- HTTPS enforcement
- Dependency vulnerability scanning

## 🐛 Troubleshooting

### Common Issues

**Form not submitting:**
- Verify Formspree form ID is correct
- Check that form is active in Formspree dashboard
- Test with curl: `curl -X POST -F 'name=Test' https://formspree.io/f/YOUR_FORM_ID`

**Dark mode not working:**
- Check browser localStorage support
- Verify CSS custom properties support
- Test with different browsers

**Performance issues:**
- Optimize images using provided scripts
- Check for render-blocking resources
- Use Lighthouse to identify bottlenecks

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Formspree](https://formspree.io) for form handling
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) for performance auditing
- [axe-core](https://github.com/dequelabs/axe-core) for accessibility testing

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review the troubleshooting section

---

**Happy coding!** 🚀
