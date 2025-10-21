# COW Color Palette Quick Reference

## Philosophy
**"Clear luminance hierarchy with warm foundation."**

Our color system balances professional depth with approachable warmth across both dark and light modes. Every design maintains clear information hierarchy through intentional luminance layering.

---

## Dark Mode Palette

### Background Layers (Depth Foundation)
```
██████  Deep Space       #020617  Primary background, page base
██████  Night Sky        #0f172a  Sections, mid-tone surfaces
██████  Dawn Approach    #1e293b  Elevated cards, modals
██████  Soft Glow        #334155  Hover states, active elements
```

### Accent Colors (Signal & Action)
```
██████  Electric Blue    #2563eb  Primary CTAs, interactive elements, links
██████  Emerald         #059669  Success states, growth indicators, confirms
██████  Cerulean        #00A5CF  Brand elements, maintaining identity
██████  Gold            #D4AF37  Premium features, value highlights
```

### Earth Tones (Warm Grounding - 10-15% usage)
```
██████  Warm Stone      #9B8B7E  Borders, dividers, subtle grounding
██████  Soft Clay       #C9B8A8  Warm containers, human touch
██████  Terra Cotta     #C77A58  Warm accents, vitality
```

### Text (Light on Dark)
```
██████  Primary Text    #f8fafc  Headings, high-emphasis content
██████  Secondary Text  #cbd5e1  Body text, readable content
██████  Tertiary Text   #94a3b8  Supporting text, captions, metadata
██████  Disabled        #64748b  Inactive elements
```

---

## Light Mode Palette

### Background Layers (Light Foundation)
```
██████  Pure White      #ffffff  Primary background, page base
██████  Pearl           #f8fafc  Subtle distinction, soft sections
██████  Rice Paper      #f5f3f0  Warm alternative backgrounds
██████  Soft Cloud      #f1f5f9  Elevated surfaces, cards
```

### Accent Colors (Signal & Action)
```
██████  Electric Blue   #2563eb  Primary CTAs, interactive elements, links
██████  Emerald         #059669  Success states, growth indicators
██████  Deep Cerulean   #007BA7  Brand elements, headers, key features
██████  Deep Gold       #B8860B  Premium features, value highlights
```

### Earth Tones (Warm Grounding - 20-30% usage)
```
██████  Warm Stone      #9B8B7E  Borders, footers, structural grounding
██████  Soft Clay       #C9B8A8  Warm sections, approachable areas
██████  Terra Cotta     #C77A58  Warm accents, human connection
██████  Bamboo Green    #6B8E6F  Growth, life programs, renewal
██████  Desert Sand     #D4BFA0  Soft neutral earth tone
```

### Text (Dark on Light)
```
██████  Primary Text    #0f172a  Headings, high-emphasis content
██████  Secondary Text  #475569  Body text, readable content
██████  Tertiary Text   #64748b  Supporting text, captions
██████  Disabled        #94a3b8  Inactive elements
```

---

## Color Usage by Context

### 1. Primary Actions (CTAs, Buttons)
**Both Modes:**
```
Background: ██████ Electric Blue (#2563eb)
Text:       ██████ White (#ffffff)
Hover:      Darken 10% (dark mode) / Lighten 10% (light mode)

Use: Primary buttons, main CTAs, critical actions
Example: "Get Started," "Invest Now," "Join Waitlist"
```

### 2. Success & Growth
**Both Modes:**
```
Background: ██████ Emerald (#059669)
Text:       ██████ White (#ffffff)
Icon:       ██████ Emerald (#059669) on light backgrounds

Use: Success messages, growth metrics, confirmations
Example: "Transaction Complete," "Portfolio Growing"
```

### 3. Brand Elements
**Dark Mode:**
```
Primary:    ██████ Cerulean (#00A5CF)
Supporting: ██████ Warm Stone (#9B8B7E)
Use: Logo, brand headers, key navigation
```

**Light Mode:**
```
Primary:    ██████ Deep Cerulean (#007BA7)
Supporting: ██████ Warm Stone (#9B8B7E)
Use: Logo, brand headers, key navigation
```

### 4. Premium Features
**Both Modes:**
```
Accent:     ██████ Gold (#D4AF37 dark / #B8860B light)
Supporting: ██████ Warm Stone (#9B8B7E)
Background: Dark: #1e293b / Light: #f5f3f0

Use: Gold vertical, premium membership, special features
Example: Institutional access, exclusive research
```

### 5. Data Visualization
**Dark Mode:**
```
Primary:    ██████ Electric Blue (#2563eb)
Secondary:  ██████ Emerald (#059669)
Tertiary:   ██████ Cerulean (#00A5CF)
Quaternary: ██████ Gold (#D4AF37)
Background: ██████ Night Sky (#0f172a)
Grid/Axis:  ██████ Soft Glow (#334155)
```

**Light Mode:**
```
Primary:    ██████ Deep Cerulean (#007BA7)
Secondary:  ██████ Emerald (#059669)
Tertiary:   ██████ Electric Blue (#2563eb)
Quaternary: ██████ Deep Gold (#B8860B)
Background: ██████ White or Pearl (#ffffff / #f8fafc)
Grid/Axis:  ██████ Soft Cloud (#f1f5f9)
```

---

## Homepage Hero Specifications

### Dark Mode Hero
```css
background: linear-gradient(180deg, 
  #020617 0%,      /* Deep space - top */
  #0f172a 50%,     /* Night sky - middle */
  #020617 100%     /* Deep space - bottom */
);

/* Illustration colors for dark background: */
Cerulean:      #00A5CF (luminous elements)
Electric Blue: #2563eb (accents, highlights)
Emerald:       #059669 (growth indicators)
Gold:          #D4AF37 (premium touches)
Warm Stone:    #9B8B7E (subtle grounding, 10% usage)
```

### Light Mode Hero
```css
background: linear-gradient(180deg, 
  #E8F4F8 0%,      /* Ice blue - top */
  #F5F3F0 60%,     /* Rice paper - middle */
  #C9B8A8 100%     /* Soft clay - bottom */
);

/* Illustration colors for light background: */
Deep Cerulean: #007BA7 (main elements)
Electric Blue: #2563eb (accents)
Emerald:       #059669 (growth)
Deep Gold:     #B8860B (premium)
Warm Stone:    #9B8B7E (grounding, 25% usage)
Terra Cotta:   #C77A58 (warmth)
```

---

## Luminance Hierarchy Testing

**Before finalizing any design, check:**

1. **Hierarchy Test**: Can you identify primary → secondary → tertiary information in 3 seconds?
2. **Contrast Test**: Does text meet WCAG AAA standards (7:1 for body, 4.5:1 for large)?
3. **Mode Test**: Does this work in both dark and light modes (or is mode specified)?
4. **Warmth Test**: Are earth tones present for balance? (10-15% dark / 20-30% light)
5. **Signal Test**: Do accent colors guide attention intentionally?

---

## Accessibility Standards

### Dark Mode Contrast Ratios

**On Deep Space (#020617):**
- ✅ Primary Text (#f8fafc) - 19.3:1 (AAA)
- ✅ Secondary Text (#cbd5e1) - 13.8:1 (AAA)
- ✅ Electric Blue (#2563eb) - 5.2:1 (AA Large)
- ⚠️ Emerald (#059669) - 3.8:1 (Large text only)

**On Night Sky (#0f172a):**
- ✅ Primary Text (#f8fafc) - 15.6:1 (AAA)
- ✅ Secondary Text (#cbd5e1) - 11.2:1 (AAA)
- ✅ Electric Blue (#2563eb) - 4.9:1 (AA Large)

### Light Mode Contrast Ratios

**On White (#ffffff):**
- ✅ Primary Text (#0f172a) - 15.6:1 (AAA)
- ✅ Secondary Text (#475569) - 9.4:1 (AAA)
- ✅ Electric Blue (#2563eb) - 6.8:1 (AA)
- ✅ Deep Cerulean (#007BA7) - 5.6:1 (AA Large)
- ✅ Emerald (#059669) - 4.7:1 (AA Large)

**On Rice Paper (#f5f3f0):**
- ✅ Primary Text (#0f172a) - 14.8:1 (AAA)
- ✅ Secondary Text (#475569) - 8.9:1 (AAA)
- ✅ Deep Cerulean (#007BA7) - 5.2:1 (AA Large)

---

## Usage Rules

### ✅ DO:
- Use Electric Blue (#2563eb) for primary interactive elements
- Use Emerald (#059669) for success and growth indicators
- Include earth tones for warmth (10-15% dark / 20-30% light)
- Maintain clear luminance hierarchy
- Test designs in both modes during development
- Use cerulean for brand consistency

### ❌ DON'T:
- Use too many accent colors simultaneously (max 2-3 per section)
- Place earth tones on dark backgrounds without testing visibility
- Forget warm grounding in predominantly cool designs
- Use low-contrast combinations for body text
- Mix Electric Blue and Cerulean equally (choose one as primary)
- Rely solely on color for information (use icons, labels too)

---

## Print Colors (CMYK Approximations)

**Core Colors:**
```
Deep Cerulean:   C100 M26 Y0 K35
Electric Blue:   C86 M60 Y0 K0
Emerald:         C95 M0 Y72 K38
Deep Gold:       C0 M27 Y94 K28
Warm Stone:      C0 M12 Y22 K39
Terra Cotta:     C0 M39 Y56 K22
```

**Always request color proofs for critical materials.**

---

## CSS Variables for Developers

### Dark Mode Variables
```css
:root[data-theme="dark"] {
  /* Backgrounds */
  --bg-base: #020617;
  --bg-surface: #0f172a;
  --bg-elevated: #1e293b;
  --bg-hover: #334155;
  
  /* Accent Colors */
  --accent-blue: #2563eb;
  --accent-green: #059669;
  --brand-cerulean: #00A5CF;
  --accent-gold: #D4AF37;
  
  /* Earth Tones */
  --earth-stone: #9B8B7E;
  --earth-clay: #C9B8A8;
  --earth-terra: #C77A58;
  
  /* Text */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-disabled: #64748b;
}
```

### Light Mode Variables
```css
:root[data-theme="light"] {
  /* Backgrounds */
  --bg-base: #ffffff;
  --bg-surface: #f8fafc;
  --bg-warm: #f5f3f0;
  --bg-elevated: #f1f5f9;
  
  /* Accent Colors */
  --accent-blue: #2563eb;
  --accent-green: #059669;
  --brand-cerulean: #007BA7;
  --accent-gold: #B8860B;
  
  /* Earth Tones */
  --earth-stone: #9B8B7E;
  --earth-clay: #C9B8A8;
  --earth-terra: #C77A58;
  --earth-bamboo: #6B8E6F;
  --earth-sand: #D4BFA0;
  
  /* Text */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --text-disabled: #94a3b8;
}
```

---

## Mode Switching Best Practices

### User Preference Detection
```javascript
// Detect system preference
const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listen for changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', e => {
    document.documentElement.setAttribute(
      'data-theme', 
      e.matches ? 'dark' : 'light'
    );
  });
```

### Smooth Transitions
```css
* {
  transition: background-color 0.3s ease, 
              color 0.3s ease, 
              border-color 0.3s ease;
}
```

### Images & Illustrations
- Store dark and light versions separately
- Use CSS to swap based on mode
```css
.illustration-light { display: block; }
.illustration-dark { display: none; }

[data-theme="dark"] .illustration-light { display: none; }
[data-theme="dark"] .illustration-dark { display: block; }
```

---

## Quick Start Guide

**For New Designs:**
1. Choose mode: Dark or light (or design for both)
2. Set background: Use layered backgrounds for depth
3. Add content: Use primary text colors
4. Add CTAs: Use Electric Blue (#2563eb)
5. Add warmth: Include earth tones (10-30% depending on mode)
6. Test hierarchy: Can you identify importance in 3 seconds?
7. Test contrast: Run WCAG checker
8. Test mode: View in alternate mode if designing dual-mode

**Safe Starter Combinations:**

**Dark Mode Professional:**
- Background: #0f172a
- Text: #f8fafc
- CTA: #2563eb
- Warm accent: #9B8B7E

**Light Mode Professional:**
- Background: #ffffff
- Text: #0f172a
- CTA: #2563eb
- Warm section: #f5f3f0

---

**Last Updated:** October 21, 2025  
**See Full Guide:** COW_Design_Guide_UPDATED.md  
**For Questions:** brand@cow.group
