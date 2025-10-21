# COW Design Guide

## Introduction

This guide defines COW Group's complete visual design system, including color, typography, spacing, components, and illustrations. It covers both dark and light modes with a unified design philosophy.

**Last Updated:** October 21, 2025  
**Version:** 3.0 (Dark/Light Mode Implementation)

---

## Design Philosophy

### Luminance Layers Principle

**"Clear visual hierarchy through intentional luminance and warm foundation."**

Our design system creates clarity through:
1. **Layered Depth**: Information architecture expressed through luminance levels
2. **Warm Grounding**: Cool professional tones balanced with earth warmth
3. **Generous Space**: 60-70% negative space for breathing room
4. **Signal Clarity**: Accent colors guide attention intentionally
5. **Dual Expression**: Same principles, optimized for dark and light modes

**Core Concept**:
- **Dark Mode**: Light emerges from depth (cosmos to earth)
- **Light Mode**: Structure from clarity (sky to foundation)
- **Both**: Professional sophistication with approachable warmth

---

## Color System

### Dark Mode Palette

#### Background Layers
```
Deep Space    #020617  ██████  Base layer, page backgrounds
Night Sky     #0f172a  ██████  Primary surface, content areas
Dawn Approach #1e293b  ██████  Elevated elements, cards, modals
Soft Glow     #334155  ██████  Hover states, interactive feedback
```

**Usage Guidelines**:
- **Deep Space**: Full-page backgrounds, behind all content
- **Night Sky**: Main content containers, section backgrounds
- **Dawn Approach**: Elevated UI (cards, dropdowns, tooltips)
- **Soft Glow**: Hover/active states, temporary highlights

#### Accent & Signal Colors
```
Electric Blue #2563eb  ██████  Primary actions, CTAs, links
Emerald       #059669  ██████  Success, growth, confirmations
Cerulean      #00A5CF  ██████  Brand identity, key features
Gold          #D4AF37  ██████  Premium, value, special moments
```

**Usage Guidelines**:
- **Electric Blue**: Primary buttons, main CTAs, interactive links
- **Emerald**: Success messages, growth metrics, positive confirmations
- **Cerulean**: Logo, brand headers, brand-defining features
- **Gold**: Premium features, achievements, special recognition

#### Earth Tones (Warm Grounding - 10-15%)
```
Warm Stone    #9B8B7E  ██████  Borders, dividers, subtle structure
Soft Clay     #C9B8A8  ██████  Warm containers, human touch
Terra Cotta   #C77A58  ██████  Warm accents, vitality
```

**Usage Guidelines**:
- Use sparingly (10-15% of total composition)
- Provide warmth against cool backgrounds
- Border/divider elements for structure
- Subtle background sections when warmth needed

#### Text Colors
```
Primary       #f8fafc  ██████  Headings, high-emphasis content
Secondary     #cbd5e1  ██████  Body text, standard content
Tertiary      #94a3b8  ██████  Supporting text, captions
Disabled      #64748b  ██████  Inactive elements
```

---

### Light Mode Palette

#### Background Layers
```
Pure White    #ffffff  ██████  Base layer, page backgrounds
Pearl         #f8fafc  ██████  Subtle sections, soft distinction
Rice Paper    #f5f3f0  ██████  Warm alternative, approachable
Soft Cloud    #f1f5f9  ██████  Elevated elements, cards
```

**Usage Guidelines**:
- **Pure White**: Main backgrounds, maximum clarity
- **Pearl**: Subtle section differentiation, soft distinction
- **Rice Paper**: Warm sections, community/blog content
- **Soft Cloud**: Elevated UI, cards, modals

#### Accent & Signal Colors
```
Electric Blue #2563eb  ██████  Primary actions, CTAs, links
Emerald       #059669  ██████  Success, growth, confirmations
Deep Cerulean #007BA7  ██████  Brand identity, headers
Deep Gold     #B8860B  ██████  Premium features, value
```

**Usage Guidelines**:
- **Electric Blue**: (Same as dark mode)
- **Emerald**: (Same as dark mode)
- **Deep Cerulean**: Deeper variant for better contrast on light
- **Deep Gold**: Deeper variant for better visibility

#### Earth Tones (Warm Grounding - 20-30%)
```
Warm Stone    #9B8B7E  ██████  Structure, footers, borders
Soft Clay     #C9B8A8  ██████  Warm sections, approachability
Terra Cotta   #C77A58  ██████  Warm accents, vitality
Bamboo Green  #6B8E6F  ██████  Growth, life programs
Desert Sand   #D4BFA0  ██████  Soft neutrals, warmth
```

**Usage Guidelines**:
- Use more liberally (20-30% of composition)
- Provides essential warmth and grounding
- Footer sections, warm content areas
- Growth/life program contexts

#### Text Colors
```
Primary       #0f172a  ██████  Headings, high-emphasis content
Secondary     #475569  ██████  Body text, standard content
Tertiary      #64748b  ██████  Supporting text, captions
Disabled      #94a3b8  ██████  Inactive elements
```

---

### Color Usage Patterns

#### Primary CTAs (Buttons)
**Both Modes:**
```css
background: #2563eb; /* Electric Blue */
color: #ffffff;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;

/* Hover */
background: #1d4ed8; /* Darker blue */

/* Active */
background: #1e40af; /* Even darker */

/* Disabled */
background: #64748b;
cursor: not-allowed;
```

#### Secondary Actions
**Both Modes:**
```css
background: transparent;
border: 2px solid #2563eb;
color: #2563eb;
/* (Dark mode text: #2563eb, Light mode text: #2563eb) */

/* Hover */
background: rgba(37, 99, 235, 0.1);
```

#### Success States
**Both Modes:**
```css
background: #059669; /* Emerald */
color: #ffffff;

/* Or for inline messages: */
background: rgba(5, 150, 105, 0.1);
border-left: 4px solid #059669;
color: #059669; /* Dark mode: #10b981 for better visibility */
```

---

## Typography

### Font Families

**Primary Typeface: Inter**
- Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Usage: All UI, body text, headings
- Rationale: Clean, highly legible, professional, excellent web rendering

**Monospace: JetBrains Mono**
- Weights: 400 (Regular), 500 (Medium)
- Usage: Code, data, numbers, technical content
- Rationale: Clear distinction for data, excellent readability

**Optional Accent: Spectral or Lora**
- Weights: 400 (Regular), 600 (SemiBold)
- Usage: Pull quotes, editorial content (sparingly)
- Rationale: Adds warmth for long-form content

---

### Type Scale

#### Dark Mode Typography
```
Display Large     Inter 700  64px/72px  #f8fafc  Letter-spacing: -2%
Display           Inter 700  48px/56px  #f8fafc  Letter-spacing: -1.5%
H1                Inter 700  40px/48px  #f8fafc  Letter-spacing: -1%
H2                Inter 600  32px/40px  #f8fafc  Letter-spacing: -0.5%
H3                Inter 600  24px/32px  #cbd5e1  
H4                Inter 600  20px/28px  #cbd5e1  
H5                Inter 600  16px/24px  #cbd5e1  

Body Large        Inter 500  18px/28px  #cbd5e1  
Body              Inter 400  16px/24px  #cbd5e1  
Body Small        Inter 400  14px/20px  #cbd5e1  

Label             Inter 500  14px/20px  #94a3b8  
Caption           Inter 400  12px/16px  #94a3b8  

Button            Inter 600  16px/24px  #ffffff  Letter-spacing: 0.5%
```

#### Light Mode Typography
```
Display Large     Inter 700  64px/72px  #0f172a  Letter-spacing: -2%
Display           Inter 700  48px/56px  #0f172a  Letter-spacing: -1.5%
H1                Inter 700  40px/48px  #0f172a  Letter-spacing: -1%
H2                Inter 600  32px/40px  #0f172a  Letter-spacing: -0.5%
H3                Inter 600  24px/32px  #475569  
H4                Inter 600  20px/28px  #475569  
H5                Inter 600  16px/24px  #475569  

Body Large        Inter 500  18px/28px  #475569  
Body              Inter 400  16px/24px  #475569  
Body Small        Inter 400  14px/20px  #475569  

Label             Inter 500  14px/20px  #64748b  
Caption           Inter 400  12px/16px  #64748b  

Button            Inter 600  16px/24px  #ffffff  Letter-spacing: 0.5%
```

---

### Typography Guidelines

**Hierarchy**:
- Use size, weight, and color to create clear hierarchy
- Maximum 3-4 text sizes per page for clarity
- Consistent spacing between elements

**Readability**:
- Body text: 16px minimum for accessibility
- Line height: 1.5-1.75 for body text
- Line length: 60-80 characters optimal
- Paragraph spacing: 1.5em between paragraphs

**Contrast**:
- All text must meet WCAG AAA standards (7:1 for body, 4.5:1 for large)
- Dark mode primary text: #f8fafc on #0f172a = 15.6:1 ✅
- Light mode primary text: #0f172a on #ffffff = 15.6:1 ✅

---

## Spacing System

### Base Unit: 4px

Our spacing system uses a base unit of 4px, scaling in multiples for consistency:

```
4px    (0.25rem)   xs      Tight spacing, icon padding
8px    (0.5rem)    sm      Compact spacing, small elements
12px   (0.75rem)   md      Default inline spacing
16px   (1rem)      base    Standard spacing unit
24px   (1.5rem)    lg      Section spacing, component separation
32px   (2rem)      xl      Large section spacing
48px   (3rem)      2xl     Major section breaks
64px   (4rem)      3xl     Hero spacing, page sections
96px   (6rem)      4xl     Major page sections
128px  (8rem)      5xl     Maximum spacing
```

### Spacing Usage

**Component Internal Spacing**:
```css
/* Button */
padding: 12px 24px; /* md horizontal, lg vertical */

/* Card */
padding: 24px; /* lg all around */

/* Input Field */
padding: 12px 16px; /* md vertical, base horizontal */
```

**Layout Spacing**:
```css
/* Between components */
margin-bottom: 24px; /* lg */

/* Between sections */
margin-bottom: 64px; /* 3xl */

/* Page margins */
padding: 24px; /* Mobile */
padding: 48px; /* Tablet */
padding: 64px; /* Desktop */
```

---

## Components

### Buttons

#### Primary Button
**Dark Mode:**
```css
.button-primary {
  background: #2563eb;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.button-primary:active {
  transform: translateY(0);
  background: #1e40af;
}
```

**Light Mode:**
```css
/* Same styles, hover shadow adjusted: */
.button-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}
```

#### Secondary Button
**Both Modes:**
```css
.button-secondary {
  background: transparent;
  color: #2563eb;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid #2563eb;
}

.button-secondary:hover {
  background: rgba(37, 99, 235, 0.1);
}
```

#### Success Button
**Both Modes:**
```css
.button-success {
  background: #059669;
  color: #ffffff;
  /* Other styles same as primary */
}
```

---

### Cards

#### Standard Card
**Dark Mode:**
```css
.card {
  background: #1e293b; /* Dawn Approach */
  border: 1px solid #334155; /* Soft Glow */
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #475569;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}
```

**Light Mode:**
```css
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

#### Featured Card (With Earth Grounding)
**Dark Mode:**
```css
.card-featured {
  background: #1e293b;
  border: 1px solid #334155;
  border-bottom: 4px solid #9B8B7E; /* Warm Stone */
  border-radius: 12px;
  padding: 24px;
}
```

**Light Mode:**
```css
.card-featured {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-bottom: 4px solid #9B8B7E; /* Warm Stone */
  border-radius: 12px;
  padding: 24px;
}
```

---

### Input Fields

**Dark Mode:**
```css
.input {
  background: #0f172a; /* Night Sky */
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #2563eb; /* Electric Blue */
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.input::placeholder {
  color: #64748b;
}
```

**Light Mode:**
```css
.input {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input::placeholder {
  color: #94a3b8;
}
```

---

### Navigation

#### Primary Navigation
**Dark Mode:**
```css
.nav {
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  padding: 16px 24px;
}

.nav-link {
  color: #cbd5e1;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #f8fafc;
  background: rgba(37, 99, 235, 0.1);
}

.nav-link.active {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.15);
}
```

**Light Mode:**
```css
.nav {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-link {
  color: #475569;
  padding: 8px 16px;
  border-radius: 6px;
}

.nav-link:hover {
  color: #0f172a;
  background: rgba(37, 99, 235, 0.05);
}

.nav-link.active {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.1);
}
```

---

### Alerts & Messages

#### Success Message
**Both Modes:**
```css
.alert-success {
  background: rgba(5, 150, 105, 0.1);
  border-left: 4px solid #059669;
  padding: 16px;
  border-radius: 8px;
}

/* Dark mode text */
[data-theme="dark"] .alert-success {
  color: #10b981;
}

/* Light mode text */
[data-theme="light"] .alert-success {
  color: #047857;
}
```

#### Error Message
**Both Modes:**
```css
.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border-left: 4px solid #ef4444;
  padding: 16px;
  border-radius: 8px;
}

/* Dark mode */
[data-theme="dark"] .alert-error {
  color: #f87171;
}

/* Light mode */
[data-theme="light"] .alert-error {
  color: #dc2626;
}
```

---

## Layout Patterns

### Homepage Hero

**Dark Mode:**
```css
.hero-dark {
  background: linear-gradient(180deg, 
    #020617 0%,
    #0f172a 50%,
    #020617 100%
  );
  min-height: 600px;
  padding: 64px 24px;
  display: flex;
  align-items: center;
  position: relative;
}

.hero-dark h1 {
  color: #f8fafc;
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 24px;
}

.hero-dark p {
  color: #cbd5e1;
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 32px;
}
```

**Light Mode:**
```css
.hero-light {
  background: linear-gradient(180deg, 
    #E8F4F8 0%,
    #F5F3F0 60%,
    #C9B8A8 100%
  );
  min-height: 600px;
  padding: 64px 24px;
  display: flex;
  align-items: center;
  position: relative;
}

.hero-light h1 {
  color: #0f172a;
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 24px;
}

.hero-light p {
  color: #475569;
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 32px;
}
```

---

### Content Sections

**Dark Mode:**
```css
.section-dark {
  background: #0f172a;
  padding: 64px 24px;
}

.section-dark.elevated {
  background: #1e293b;
}

.section-dark.with-grounding::after {
  content: '';
  display: block;
  height: 8px;
  background: #9B8B7E;
  margin-top: 32px;
}
```

**Light Mode:**
```css
.section-light {
  background: #ffffff;
  padding: 64px 24px;
}

.section-light.warm {
  background: #f5f3f0;
}

.section-light.with-grounding::after {
  content: '';
  display: block;
  height: 8px;
  background: #9B8B7E;
  margin-top: 32px;
}
```

---

### Grid System

**12-Column Responsive Grid:**
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(8, 1fr);
    gap: 20px;
  }
}
```

---

## Iconography

### Icon System

**Size Scale:**
```
16px  Small inline icons, tight UI
20px  Standard inline icons
24px  Default UI icons, buttons
32px  Feature icons, headers
48px  Large feature icons
64px  Hero/illustration icons
```

**Colors:**
- **Dark Mode**: Use #cbd5e1 for neutral icons, accent colors for branded
- **Light Mode**: Use #475569 for neutral icons, accent colors for branded

**Style:**
- Stroke-based (2px stroke weight for 24px icons)
- Rounded corners (2px radius on corners)
- Consistent optical size
- Professional, not playful

**Sources:**
- **Recommended**: Lucide Icons, Heroicons, Phosphor Icons
- **Custom**: Match stroke weight and corner radius

---

## Accessibility

### Color Contrast

**Minimum Standards:**
- **Body Text**: WCAG AAA (7:1 ratio)
- **Large Text**: WCAG AA (4.5:1 ratio)
- **UI Components**: WCAG AA (3:1 ratio)

**Tested Combinations:**

Dark Mode (passing AAA):
- #f8fafc on #020617 = 19.3:1 ✅
- #f8fafc on #0f172a = 15.6:1 ✅
- #cbd5e1 on #0f172a = 11.2:1 ✅

Light Mode (passing AAA):
- #0f172a on #ffffff = 15.6:1 ✅
- #475569 on #ffffff = 9.4:1 ✅

### Keyboard Navigation

**Focus States:**
```css
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Never remove outlines without replacement */
```

**Tab Order:**
- Logical flow (top to bottom, left to right)
- Skip links for long navigation
- No tab-index manipulation unless necessary

### Screen Readers

**Semantic HTML:**
- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (<nav>, <main>, <article>)
- Include ARIA labels when needed
- Alt text for all images

---

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */

/* Extra Small: 0-640px (Mobile) */
/* Default styles */

/* Small: 641px-768px (Large Mobile) */
@media (min-width: 641px) { }

/* Medium: 769px-1024px (Tablet) */
@media (min-width: 769px) { }

/* Large: 1025px-1280px (Desktop) */
@media (min-width: 1025px) { }

/* Extra Large: 1281px+ (Wide Desktop) */
@media (min-width: 1281px) { }
```

### Responsive Typography

```css
/* Mobile */
h1 { font-size: 32px; line-height: 1.2; }
h2 { font-size: 24px; }
body { font-size: 16px; }

/* Tablet */
@media (min-width: 769px) {
  h1 { font-size: 40px; }
  h2 { font-size: 32px; }
}

/* Desktop */
@media (min-width: 1025px) {
  h1 { font-size: 48px; }
  h2 { font-size: 36px; }
  body { font-size: 18px; }
}
```

---

## Dark/Light Mode Implementation

### Mode Detection & Toggle

**JavaScript:**
```javascript
// Detect system preference
const getPreferredTheme = () => {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};

// Apply theme
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Initialize
applyTheme(getPreferredTheme());

// Listen for system changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

// Toggle function
const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
};
```

**CSS:**
```css
/* Smooth transitions */
* {
  transition: background-color 0.3s ease, 
              color 0.3s ease, 
              border-color 0.3s ease;
}

/* Disable transitions on mode change */
[data-theme-changing] * {
  transition: none !important;
}
```

---

## Animation & Motion

### Principles

1. **Purposeful**: Every animation serves a function
2. **Fast**: 200-400ms for most UI animations
3. **Natural**: Ease-out for entrances, ease-in for exits
4. **Respectful**: Honor `prefers-reduced-motion`

### Standard Transitions

```css
/* Hover states */
transition: all 0.2s ease;

/* Mode changes */
transition: background-color 0.3s ease, color 0.3s ease;

/* Page transitions */
transition: opacity 0.4s ease, transform 0.4s ease;
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Design Testing Checklist

Before finalizing any design:

**Luminance Hierarchy**:
- [ ] Can you identify primary → secondary → tertiary in 3 seconds?
- [ ] Does visual weight match information priority?

**Contrast**:
- [ ] All text meets WCAG AAA standards
- [ ] Interactive elements clearly distinguishable
- [ ] Color not sole indicator of information

**Mode Testing**:
- [ ] Works in both dark and light modes (or mode specified)
- [ ] Illustrations optimized for target background
- [ ] Proper contrast maintained in both

**Warmth**:
- [ ] Earth tones present for balance (10-15% dark / 20-30% light)
- [ ] Doesn't feel purely cold/clinical
- [ ] Approachable while professional

**Spacing**:
- [ ] Uses spacing system (4px base multiples)
- [ ] Generous negative space (60%+ white space)
- [ ] Clear visual breathing room

**Accessibility**:
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Proper focus states
- [ ] Semantic HTML

---

## Brand Assets

### Logo Usage

**Minimum Sizes:**
- Print: 24mm width
- Digital: 120px width
- Favicon: 32px × 32px

**Clear Space:**
- Minimum clear space = height of "O" in COW on all sides

**Colors:**
- **Dark Mode**: Cerulean (#00A5CF) or White (#ffffff)
- **Light Mode**: Deep Cerulean (#007BA7)
- **Never**: Alter colors, stretch, rotate, add effects

---

## Resources

### Design Tools

**Recommended:**
- **Figma**: Primary design tool
- **Adobe XD**: Alternative option
- **Sketch**: Alternative option

**Plugins:**
- **Color Contrast Checker**: Ensure accessibility
- **Unsplash**: Stock photography
- **Iconify**: Icon library access

### Development Tools

**Frameworks:**
- **Tailwind CSS**: Utility-first CSS (recommended)
- **Custom CSS**: Follow guidelines

**Testing:**
- **WebAIM Contrast Checker**: Color contrast
- **axe DevTools**: Accessibility testing
- **Lighthouse**: Performance and accessibility

---

## Contact & Support

**For Design Questions:**
- Email: design@cow.group
- Slack: #design-system

**For Brand Questions:**
- Email: brand@cow.group

**Resources:**
- Color Palette: COW_Color_Palette_Quick_Reference_UPDATED.md
- Illustrations: COW_Ink_Painting_Guide_UPDATED.md
- Voice & Tone: COW_Voice_Tone_Guide.md

---

**Last Updated:** October 21, 2025  
**Version:** 3.0  
**Next Review:** January 2026
