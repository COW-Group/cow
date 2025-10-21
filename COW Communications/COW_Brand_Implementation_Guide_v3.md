# COW Group Brand Implementation Guide v3.0

## Quick Start

This guide shows you how to actually implement the COW brand in practice - whether you're designing a website, creating a presentation, or building a product feature.

**Goal:** Get from brand guidelines to real work quickly and correctly.

---

## Where to Start

### For Different Roles:

**Designers →** Start with COW_Design_Guide_v3.md + COW_Color_System_v2.md  
**Developers →** Start with COW_Design_Guide_v3.md (Technical Implementation section)  
**Writers →** Start with COW_Voice_Tone_Guide_v3.md  
**Marketers →** Start with COW_Brand_One_Pager_v3.md + COW_Content_Strategy_Guide_v3.md  
**Everyone →** Read COW_Brand_One_Pager_v3.md first (10 min)

---

## Setup Checklist

### Design Tools Setup

**Figma:**
- [ ] Access COW Brand Library
- [ ] Install color swatches (light + dark mode)
- [ ] Install component library
- [ ] Set up typography styles
- [ ] Enable dark mode preview

**Sketch:**
- [ ] Import COW_Brand.sketch file
- [ ] Install color palette
- [ ] Load symbol library
- [ ] Set up text styles

**Adobe:**
- [ ] Load COW_Colors_v2.ase swatches
- [ ] Install brand fonts
- [ ] Import logo files (all formats)
- [ ] Set up paragraph styles

---

### Development Setup

**CSS Variables:**
```css
/* Add to your main CSS file */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Copy all variables from COW_Color_System_v2.md */
:root {
  --blue-deep: #1e40af;
  --blue-accent: #2563eb;
  /* ... etc */
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --blue-primary: var(--blue-light);
    /* ... etc */
  }
}
```

**React/Next.js:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cow-blue-deep': '#1e40af',
        'cow-blue-accent': '#2563eb',
        'cow-emerald': '#059669',
        // ...all brand colors
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  darkMode: 'class', // or 'media'
}
```

---

## Common Scenarios

### Scenario 1: Creating a Marketing Page

**Step-by-Step:**

1. **Choose Your Mode**
   - Will this page have dark mode? (Recommended: Yes)
   - Start designing in light mode first

2. **Set Up Layout**
   ```
   Hero Section (full viewport)
   ↓
   Content Sections (alternate backgrounds)
   ↓
   CTA Section
   ↓
   Footer
   ```

3. **Apply Color System**
   - Background: White (#ffffff) or Deep (#020617 in dark mode)
   - Primary elements: Blue (#1e40af light / #3b82f6 dark)
   - CTAs: Emerald (#059669 light / #10b981 dark)
   - Text: High contrast

4. **Add Content**
   - Headlines: 36-48px, Bold
   - Body: 16-18px, Regular
   - Follow voice & tone guidelines

5. **Test Both Modes**
   - Toggle dark mode
   - Check contrast
   - Verify all text readable
   - Ensure CTAs stand out

6. **Review Checklist**
   - [ ] Works in both modes
   - [ ] Meets accessibility standards
   - [ ] Follows ink density principle
   - [ ] Brand voice consistent
   - [ ] Mobile responsive

---

### Scenario 2: Creating a Presentation

**Template Structure:**

**Title Slide:**
```
Light Mode:
- Background: White
- Title: Deep Blue (#1e40af)
- Subtitle: Medium Gray (#334155)
- Logo: Top right

Dark Mode:
- Background: Deep (#020617)
- Title: Light Blue (#60a5fa)
- Subtitle: Light Gray (#e2e8f0)
- Logo: Top right (light version)
```

**Content Slides:**
```
Light Mode:
- Background: White or Soft Blue Wash (#f0f9ff)
- Headers: Deep Blue (#1e40af)
- Body: Black Ink (#0f172a)
- Bullets: Emerald (#059669)

Dark Mode:
- Background: Deep (#0f172a) or Medium (#1e293b)
- Headers: Light Blue (#60a5fa)
- Body: White Text (#f8fafc)
- Bullets: Bright Emerald (#10b981)
```

**Tips:**
- Use 1-2 colors per slide maximum
- Heavy use of white space
- One key idea per slide
- High contrast for readability
- Test on projector if presenting

---

### Scenario 3: Creating Social Media Graphics

**Instagram Post (1080x1080):**

```
Layout:
┌────────────────┐
│   Top 20%:     │ ← Brand color (blue or emerald)
│   Eye-catching │
│                │
│   Middle 60%:  │ ← Main content
│   Core message │
│   or visual    │
│                │
│   Bottom 20%:  │ ← Logo + URL
└────────────────┘
```

**Color Combinations:**

**Professional:**
- Background: Deep Blue (#1e40af)
- Text: White
- Accent: Emerald (#059669)

**Growth/Education:**
- Background: Emerald (#059669)
- Text: White
- Accent: Light Blue (#60a5fa)

**Premium:**
- Background: Deep (#0f172a)
- Text: Light Blue (#60a5fa)
- Accent: Gold (#fbbf24)

**Tips:**
- Design for feed + stories
- Test legibility at thumbnail size
- Include branding but don't overpower message
- Use on-brand photography or illustrations

---

### Scenario 4: Designing an Email

**Email Template Structure:**

```html
<!-- Header -->
<table width="100%" bgcolor="#1e40af">
  <tr>
    <td padding="20px">
      <img src="logo-light.png" alt="COW Group" />
    </td>
  </tr>
</table>

<!-- Body -->
<table width="600px" bgcolor="#ffffff">
  <tr>
    <td padding="40px">
      <!-- Content here -->
    </td>
  </tr>
</table>

<!-- Footer -->
<table width="100%" bgcolor="#f8fafc">
  <tr>
    <td padding="20px" align="center">
      <!-- Footer content -->
    </td>
  </tr>
</table>
```

**Color Guidelines:**
- Header: Deep Blue background
- Body: White background with dark text
- Footer: Light Slate background
- Links: Accent Blue (#2563eb)
- Buttons: Emerald (#059669)

**Typography:**
- Headlines: 24-28px, font-weight: 700
- Body: 16px, font-weight: 400
- line-height: 1.6

**Note:** Email clients don't support dark mode consistently. Design for light mode primarily.

---

### Scenario 5: Building a Product Feature

**UI Design Process:**

1. **Wireframe First**
   - Layout and hierarchy
   - User flow
   - Content structure

2. **Apply Design System**
   - Use components from library
   - Apply brand colors
   - Follow spacing system

3. **Add Content**
   - Write UI copy (brief, clear)
   - Follow voice guidelines
   - Include helpful hints

4. **Design States**
   - Default
   - Hover
   - Active
   - Disabled
   - Error
   - Success

5. **Test Both Modes**
   - Light mode
   - Dark mode
   - All states in both modes

6. **Accessibility Check**
   - Keyboard navigation
   - Screen reader friendly
   - Color contrast
   - Focus indicators

**Example: Button Component**

```jsx
// Light Mode
<button className="
  bg-emerald-600        /* #059669 */
  hover:bg-emerald-700
  text-white
  font-semibold
  px-6 py-3
  rounded-lg
  transition-colors
">
  Get Started
</button>

// Dark Mode (automatic with dark: classes)
<button className="
  bg-emerald-600 dark:bg-emerald-500
  hover:bg-emerald-700 dark:hover:bg-emerald-400
  text-white
  font-semibold
  px-6 py-3
  rounded-lg
  transition-colors
">
  Get Started
</button>
```

---

## Design Patterns

### Hero Sections

**Light Mode Hero:**
```css
.hero-light {
  background: linear-gradient(
    135deg,
    #f0f9ff 0%,
    #ffffff 50%,
    #eff6ff 100%
  );
  padding: 120px 20px;
  text-align: center;
}

.hero-light h1 {
  color: #1e40af;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
}

.hero-light p {
  color: #334155;
  font-size: 20px;
  max-width: 600px;
  margin: 0 auto;
}
```

**Dark Mode Hero:**
```css
.hero-dark {
  background: linear-gradient(
    to bottom,
    #020617 0%,
    #0f172a 50%,
    #020617 100%
  );
  padding: 120px 20px;
  text-align: center;
}

.hero-dark h1 {
  color: #60a5fa;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
}

.hero-dark p {
  color: #e2e8f0;
  font-size: 20px;
  max-width: 600px;
  margin: 0 auto;
}
```

---

### Card Components

**Light Mode Card:**
```css
.card-light {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.card-light:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37,99,235,0.1);
}
```

**Dark Mode Card:**
```css
.card-dark {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  transition: all 0.3s;
}

.card-dark:hover {
  border-color: #60a5fa;
  box-shadow: 0 4px 12px rgba(96,165,250,0.2);
}
```

---

### Data Visualizations

**Chart Colors:**

**Light Mode:**
```javascript
const chartColors = {
  primary: '#2563eb',     // Accent Blue
  secondary: '#059669',   // Emerald
  tertiary: '#d97706',    // Gold
  background: '#ffffff',
  grid: '#e2e8f0',
  text: '#0f172a'
};
```

**Dark Mode:**
```javascript
const chartColors = {
  primary: '#60a5fa',     // Light Blue
  secondary: '#10b981',   // Bright Emerald
  tertiary: '#fbbf24',    // Bright Gold
  background: '#0f172a',
  grid: '#334155',
  text: '#f8fafc'
};
```

**Example Chart Configuration:**
```javascript
// Chart.js example
const chartConfig = {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Performance',
      data: [12, 19, 3, 5, 2],
      borderColor: chartColors.primary,
      backgroundColor: chartColors.primary + '20', // 20% opacity
      borderWidth: 2,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: chartColors.text
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: chartColors.grid
        },
        ticks: {
          color: chartColors.text
        }
      },
      y: {
        grid: {
          color: chartColors.grid
        },
        ticks: {
          color: chartColors.text
        }
      }
    }
  }
};
```

---

## Animation Guidelines

### Micro-interactions

**Hover States:**
```css
.button {
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37,99,235,0.2);
}
```

**Loading States:**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Page Transitions:**
```css
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease;
}
```

**Principles:**
- Keep animations subtle (200-300ms)
- Use easing functions (ease, ease-in-out)
- Respect prefers-reduced-motion
- Enhance, don't distract

---

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */

/* Default: Mobile (< 640px) */

/* Small tablets */
@media (min-width: 640px) {
  /* sm breakpoint */
}

/* Tablets */
@media (min-width: 768px) {
  /* md breakpoint */
}

/* Laptops */
@media (min-width: 1024px) {
  /* lg breakpoint */
}

/* Desktops */
@media (min-width: 1280px) {
  /* xl breakpoint */
}

/* Large desktops */
@media (min-width: 1536px) {
  /* 2xl breakpoint */
}
```

### Typography Scale

```css
/* Responsive typography */
h1 {
  font-size: 32px; /* Mobile */
}

@media (min-width: 768px) {
  h1 {
    font-size: 48px; /* Tablet+ */
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 56px; /* Desktop */
  }
}
```

---

## Testing Checklist

### Before Launching

**Visual:**
- [ ] Tested in light mode
- [ ] Tested in dark mode
- [ ] Tested on mobile
- [ ] Tested on tablet
- [ ] Tested on desktop
- [ ] All images load
- [ ] All fonts load
- [ ] Brand colors correct

**Functional:**
- [ ] All links work
- [ ] Forms validate
- [ ] CTAs clear and working
- [ ] Error states handled
- [ ] Loading states shown

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible
- [ ] Alt text on images

**Performance:**
- [ ] Page loads < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Mobile performance good

**Content:**
- [ ] Spelling/grammar checked
- [ ] Brand voice consistent
- [ ] All claims supported
- [ ] CTAs clear
- [ ] No lorem ipsum

---

## Common Mistakes

### Mistake 1: Wrong Blue

❌ **Wrong:** Using random blues
```css
color: #0000FF; /* Pure blue */
color: #1E90FF; /* Dodger blue */
```

✅ **Right:** Using brand blues
```css
color: #1e40af; /* COW Deep Blue */
color: #2563eb; /* COW Accent Blue */
```

---

### Mistake 2: Forgetting Dark Mode

❌ **Wrong:** Only designing for light mode
```jsx
<div className="bg-white text-black">
  Content
</div>
```

✅ **Right:** Supporting both modes
```jsx
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  Content
</div>
```

---

### Mistake 3: Low Contrast Text

❌ **Wrong:** Light blue on white
```css
color: #60a5fa; /* Too light for white background */
background: #ffffff;
```

✅ **Right:** Dark blue on white
```css
color: #1e40af; /* High contrast */
background: #ffffff;
```

---

### Mistake 4: Inconsistent Spacing

❌ **Wrong:** Random spacing values
```css
margin-top: 13px;
padding: 17px 22px;
gap: 31px;
```

✅ **Right:** Using 8px base unit
```css
margin-top: 16px; /* 2 units */
padding: 16px 24px; /* 2 and 3 units */
gap: 32px; /* 4 units */
```

---

### Mistake 5: Overusing Colors

❌ **Wrong:** Every element a different color
```
Blue header
Emerald subheader
Gold body text
Purple links
Red buttons
```

✅ **Right:** Strategic color use
```
Deep Blue header
Gray body text
Emerald CTA
Accent Blue links
```

---

## Quick Reference

### Most Common Components

**Button (Primary):**
```html
<button class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg">
  Get Started
</button>
```

**Button (Secondary):**
```html
<button class="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 font-semibold px-6 py-3 rounded-lg">
  Learn More
</button>
```

**Card:**
```html
<div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8">
  <!-- Content -->
</div>
```

**Section:**
```html
<section class="py-20 bg-white dark:bg-slate-900">
  <div class="container mx-auto px-4">
    <!-- Content -->
  </div>
</section>
```

---

## Getting Help

**Questions about:**

**Design:** #design Slack channel or design@cow.group  
**Development:** #engineering Slack channel or dev@cow.group  
**Content:** #content Slack channel or content@cow.group  
**Brand:** #brand Slack channel or brand@cow.group  

**Office Hours:**
- Design: Tuesdays 2pm
- Development: Wednesdays 10am
- Brand: Thursdays 3pm

**Resources:**
- Brand Portal: [URL]
- Component Library: [URL]
- Design Files: [URL]
- Documentation: [URL]

---

*This implementation guide helps you go from brand guidelines to real work. When in doubt, check the specific guide for your domain, and don't hesitate to ask for help.*

**Last Updated:** October 2025  
**Version:** 3.0  
**For Questions:** brand@cow.group
