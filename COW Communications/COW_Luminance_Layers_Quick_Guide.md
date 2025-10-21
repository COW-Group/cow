# Luminance Layers: Quick Implementation Guide

## For Designers, Developers, and Content Creators

**TL;DR:** Create clear visual hierarchy through intentional luminance levels. Add warm earth-tone grounding (10-15% dark mode / 20-30% light mode). Test in both modes.

---

## The 30-Second Rule

Before publishing any design, ask:

**"Is the luminance hierarchy clear in 3 seconds?"**

Can viewers immediately identify:
1. **Primary** information (most prominent/bright)
2. **Secondary** information (supporting)
3. **Tertiary** information (background/context)

If no clear hierarchy → Adjust sizes, weights, or contrast.

---

## Quick Decision Tree

```
Are you designing for dark or light mode (or both)?
    │
    ├─→ DARK MODE:
    │    │
    │    ├─ Background layers correct? (Deep Space → Night Sky → Dawn Approach)
    │    ├─ Primary actions using Electric Blue (#2563eb)?
    │    ├─ Earth tones present for warmth (10-15%)?
    │    └─ Text contrast meeting WCAG AAA? (#f8fafc on #0f172a)
    │
    ├─→ LIGHT MODE:
    │    │
    │    ├─ Background layers correct? (White → Pearl → Soft Cloud)
    │    ├─ Primary actions using Electric Blue (#2563eb)?
    │    ├─ Earth tones present for warmth (20-30%)?
    │    └─ Text contrast meeting WCAG AAA? (#0f172a on #ffffff)
    │
    └─→ BOTH MODES:
         │
         ├─ Design tested in both contexts?
         ├─ Illustrations optimized for each background?
         ├─ Color variables properly set up?
         └─ Mode toggle working smoothly?
```

---

## 5 Fast Fixes for Common Situations

### Fix 1: Homepage Hero (Most Common)

**Dark Mode:**
```css
background: linear-gradient(180deg, 
  #020617 0%,      /* Deep space */
  #0f172a 50%,     /* Night sky */
  #020617 100%     /* Back to deep */
);
min-height: 600px;
```

**Light Mode:**
```css
background: linear-gradient(180deg, 
  #E8F4F8 0%,      /* Ice blue */
  #F5F3F0 60%,     /* Rice paper */
  #C9B8A8 100%     /* Soft clay */
);
min-height: 600px;
```

**Illustration Integration:**
- Place illustration at 50-70% opacity
- Ensure proper contrast with text overlay
- Use mode-specific illustration versions

---

### Fix 2: Primary CTA Button

**Problem:** Button doesn't stand out or lacks warmth

**Solution:** Use Electric Blue with proper hover states
```css
.button-primary {
  background: #2563eb;  /* Electric Blue - both modes */
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: #1d4ed8;  /* Darker */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
```

**Quick Win:** Same color works both modes, just adjust shadow intensity

---

### Fix 3: Card Component Without Enough Depth

**Problem:** Cards don't feel elevated, blend with background

**Dark Mode Solution:**
```css
.card {
  background: #1e293b;  /* Dawn Approach - lighter than page */
  border: 1px solid #334155;  /* Soft Glow */
  border-radius: 12px;
  padding: 24px;
}

.card:hover {
  border-color: #475569;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}
```

**Light Mode Solution:**
```css
.card {
  background: #ffffff;  /* Pure white - cleaner than page */
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

**Add Warm Grounding (Optional):**
```css
.card-grounded {
  border-bottom: 4px solid #9B8B7E;  /* Warm Stone */
}
```

---

### Fix 4: Section Lacking Warmth

**Problem:** Everything feels cold, purely blue/gray

**Solution:** Add earth-tone footer or accent
```css
.section-with-grounding::after {
  content: '';
  display: block;
  height: 8px;
  width: 100%;
  background: #9B8B7E;  /* Warm Stone */
  margin-top: 32px;
}
```

**Or warm background section:**
```css
.section-warm {
  background: #f5f3f0;  /* Rice Paper - light mode */
  padding: 64px 24px;
}

[data-theme="dark"] .section-warm {
  background: #1e293b;  /* Don't use earth tones as dark bg */
  border-left: 4px solid #9B8B7E;  /* Accent instead */
}
```

---

### Fix 5: Text Contrast Issues

**Problem:** Text hard to read, fails accessibility

**Dark Mode Fix:**
```css
/* Headings */
h1, h2 { color: #f8fafc; }  /* Primary - highest contrast */

/* Body */
p { color: #cbd5e1; }  /* Secondary - readable */

/* Supporting */
.caption { color: #94a3b8; }  /* Tertiary - for meta info */
```

**Light Mode Fix:**
```css
/* Headings */
h1, h2 { color: #0f172a; }  /* Primary */

/* Body */
p { color: #475569; }  /* Secondary */

/* Supporting */
.caption { color: #64748b; }  /* Tertiary */
```

**Testing:** Use WebAIM Contrast Checker, aim for 7:1 ratio minimum

---

## Color Combinations Cheat Sheet

### Professional/Financial (Default)
```
Dark Mode:
  Background:  #0f172a
  Text:        #f8fafc
  CTA:         #2563eb (Electric Blue)
  Grounding:   #9B8B7E (Warm Stone, 10-15%)
  
Light Mode:
  Background:  #ffffff
  Text:        #0f172a
  CTA:         #2563eb (Electric Blue)
  Grounding:   #9B8B7E (Warm Stone, 20-30%)
```

### Success/Growth States
```
Both Modes:
  Primary:     #059669 (Emerald)
  Background:  rgba(5, 150, 105, 0.1)
  Border:      4px solid #059669 (left)
```

### Premium Features
```
Dark Mode:
  Accent:      #D4AF37 (Gold)
  Supporting:  #00A5CF (Cerulean)
  Background:  #1e293b
  
Light Mode:
  Accent:      #B8860B (Deep Gold)
  Supporting:  #007BA7 (Deep Cerulean)
  Background:  #f5f3f0 (Rice Paper)
```

### Community/Blog (Warmer)
```
Light Mode:
  Background:  #f5f3f0 (Rice Paper)
  Text:        #475569
  Accents:     #6B8E6F (Bamboo Green)
  CTA:         #2563eb (Electric Blue)
```

---

## Copy-Paste Code Snippets

### CSS Variables Setup

```css
/* Dark Mode Variables */
:root[data-theme="dark"] {
  --bg-base: #020617;
  --bg-surface: #0f172a;
  --bg-elevated: #1e293b;
  --bg-hover: #334155;
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  
  --accent-blue: #2563eb;
  --accent-green: #059669;
  --brand-cerulean: #00A5CF;
  --accent-gold: #D4AF37;
  
  --earth-stone: #9B8B7E;
  --earth-clay: #C9B8A8;
}

/* Light Mode Variables */
:root[data-theme="light"] {
  --bg-base: #ffffff;
  --bg-surface: #f8fafc;
  --bg-warm: #f5f3f0;
  --bg-elevated: #f1f5f9;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  
  --accent-blue: #2563eb;
  --accent-green: #059669;
  --brand-cerulean: #007BA7;
  --accent-gold: #B8860B;
  
  --earth-stone: #9B8B7E;
  --earth-clay: #C9B8A8;
  --earth-terra: #C77A58;
  --earth-bamboo: #6B8E6F;
}
```

### Hero with Mode Switching

```html
<section class="hero" data-mode-sensitive>
  <div class="hero-content">
    <h1>Wealth that works while you live</h1>
    <p>Building the performance layer for real-world assets</p>
    <button class="button-primary">Get Started</button>
  </div>
  <div class="hero-illustration">
    <picture>
      <source 
        srcset="hero-dark.png" 
        media="(prefers-color-scheme: dark)"
      >
      <img src="hero-light.png" alt="Gold mountain illustration">
    </picture>
  </div>
</section>

<style>
.hero {
  min-height: 600px;
  padding: 64px 24px;
  position: relative;
  display: flex;
  align-items: center;
}

[data-theme="dark"] .hero {
  background: linear-gradient(180deg, #020617, #0f172a, #020617);
}

[data-theme="light"] .hero {
  background: linear-gradient(180deg, #E8F4F8, #F5F3F0, #C9B8A8);
}

.hero h1 {
  color: var(--text-primary);
  font-size: 48px;
  margin-bottom: 24px;
}

.hero p {
  color: var(--text-secondary);
  font-size: 20px;
  margin-bottom: 32px;
}
</style>
```

### Card with Warm Grounding

```html
<div class="card card-grounded">
  <h3>Premium Gold Access</h3>
  <p>Institutional-grade optimization for your gold holdings</p>
  <button class="button-primary">Learn More</button>
</div>

<style>
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--bg-hover);
  border-bottom: 4px solid var(--earth-stone);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

[data-theme="dark"] .card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

[data-theme="light"] .card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
</style>
```

### Input with Focus States

```html
<input 
  type="text" 
  class="input" 
  placeholder="Enter email"
>

<style>
.input {
  background: var(--bg-surface);
  border: 1px solid var(--bg-hover);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.input::placeholder {
  color: var(--text-tertiary);
}
</style>
```

---

## JavaScript: Mode Toggle

```javascript
// Get current theme
const getTheme = () => {
  return localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
};

// Apply theme
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update toggle button if exists
  const toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.setAttribute('aria-label', 
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
};

// Initialize
applyTheme(getTheme());

// Toggle function
const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
};

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

// Add to toggle button
document.querySelector('[data-theme-toggle]')
  ?.addEventListener('click', toggleTheme);
```

---

## Common Mistakes & Fixes

### Mistake 1: No Clear Hierarchy

❌ **Wrong:**
- All text same size and color
- Everything equally prominent
- Viewer doesn't know where to look

✅ **Right:**
```css
h1 { 
  font-size: 48px; 
  font-weight: 700; 
  color: var(--text-primary); 
}
h2 { 
  font-size: 32px; 
  font-weight: 600; 
  color: var(--text-primary); 
}
p { 
  font-size: 18px; 
  font-weight: 400; 
  color: var(--text-secondary); 
}
.caption { 
  font-size: 14px; 
  color: var(--text-tertiary); 
}
```

---

### Mistake 2: Missing Warm Grounding

❌ **Wrong:**
- Pure blues and grays only
- Feels cold, clinical, unapproachable
- Missing human touch

✅ **Right:**
- Add earth tones (10-15% dark / 20-30% light)
- Footer sections in Warm Stone
- Accent borders or dividers
- Warm background sections where appropriate

---

### Mistake 3: Poor Contrast

❌ **Wrong:**
- `#64748b` text on `#0f172a` background (fails WCAG)
- Low contrast that strains eyes
- Inaccessible to users with vision impairments

✅ **Right:**
- Dark mode: `#f8fafc` on `#0f172a` (15.6:1) ✅
- Light mode: `#0f172a` on `#ffffff` (15.6:1) ✅
- Always test with WebAIM Contrast Checker

---

### Mistake 4: Same Design Both Modes

❌ **Wrong:**
- Just inverting colors
- Not optimizing for each mode's context
- Illustrations look wrong in opposite mode

✅ **Right:**
- Create mode-specific illustration versions
- Adjust shadow intensity per mode
- Optimize background layers for each
- Test extensively in both contexts

---

### Mistake 5: Too Many Accent Colors

❌ **Wrong:**
- Using Electric Blue, Emerald, Cerulean, Gold all equally
- Rainbow explosion, no focus
- Confusing visual hierarchy

✅ **Right:**
- Choose 1-2 accent colors per section
- Electric Blue for primary actions
- Emerald only for success/growth
- Gold only for premium features
- Cerulean for brand elements only

---

## Testing Your Design

### Checklist:

**Luminance Hierarchy**:
- [ ] Can identify primary info in 3 seconds?
- [ ] Clear visual weight differentiation?
- [ ] Most important = most prominent?

**Color & Contrast**:
- [ ] All text meets WCAG AAA (7:1 minimum)?
- [ ] Interactive elements clearly visible?
- [ ] Accent colors used intentionally?

**Warmth & Balance**:
- [ ] Earth tones present (10-15% dark / 20-30% light)?
- [ ] Doesn't feel purely cold/clinical?
- [ ] Approachable while professional?

**Mode Testing**:
- [ ] Tested in both dark and light modes?
- [ ] Illustrations optimized for each background?
- [ ] Mode toggle working smoothly?
- [ ] Transitions not jarring?

**Accessibility**:
- [ ] Keyboard navigable?
- [ ] Focus states visible?
- [ ] Screen reader friendly?
- [ ] Honors prefers-reduced-motion?

### The Squint Test:

1. Step back from screen (6 feet)
2. Squint at design
3. Can you still identify:
   - Main heading/primary element?
   - Primary CTA?
   - Overall structure?

If yes → Good hierarchy  
If no → Increase contrast/size of key elements

---

## Quick Reference: Key Colors

**Copy these hex codes:**

### Dark Mode
```
Backgrounds:
  Deep Space:    #020617
  Night Sky:     #0f172a
  Dawn Approach: #1e293b
  
Text:
  Primary:       #f8fafc
  Secondary:     #cbd5e1
  Tertiary:      #94a3b8
  
Accents:
  Electric Blue: #2563eb
  Emerald:       #059669
  Cerulean:      #00A5CF
  Gold:          #D4AF37
  
Earth (10-15%):
  Warm Stone:    #9B8B7E
  Soft Clay:     #C9B8A8
```

### Light Mode
```
Backgrounds:
  Pure White:    #ffffff
  Pearl:         #f8fafc
  Rice Paper:    #f5f3f0
  
Text:
  Primary:       #0f172a
  Secondary:     #475569
  Tertiary:      #64748b
  
Accents:
  Electric Blue: #2563eb
  Emerald:       #059669
  Deep Cerulean: #007BA7
  Deep Gold:     #B8860B
  
Earth (20-30%):
  Warm Stone:    #9B8B7E
  Soft Clay:     #C9B8A8
  Terra Cotta:   #C77A58
  Bamboo Green:  #6B8E6F
```

---

## When to Break the Rules

**Almost never, but acceptable exceptions:**

1. **Print Materials**: May need different color approach
2. **Partner Co-Branding**: When partner brand guidelines require
3. **Temporary Campaigns**: Seasonal or special event variations
4. **A/B Testing**: Testing alternatives (document findings)

**Still maintain:**
- Clear hierarchy principle
- Accessibility standards
- Brand recognition (cerulean present)
- Professional aesthetic

---

## Questions?

### "How much earth tone is enough?"

**Dark Mode**: 10-15% of composition  
**Light Mode**: 20-30% of composition

**Examples**:
- Footer section: 15% of page height
- Card borders: Subtle presence counts
- Section accents: Thin bars or dividers
- Background sections: Full sections OK in light mode

### "Can I use just one mode?"

**Yes**, but:
- Specify which mode your design targets
- Ensure it works perfectly in that context
- Consider future dual-mode implementation
- Document mode-specific decisions

### "What if I need more colors?"

**For data visualization**: OK to expand palette
- Use: Electric Blue, Emerald, Cerulean, Gold, Terra Cotta
- Still maintain: Clear hierarchy, accessibility
- Document: When/why additional colors used

**For general UI**: Stick to system
- Two accent colors per section maximum
- More colors = more confusion

### "How do I handle images/photos?"

**Dark Mode**:
- Reduce brightness slightly (0.9 opacity)
- Add subtle border if needed
- Ensure sufficient contrast with dark background

**Light Mode**:
- Full brightness OK
- Add subtle shadow for depth
- Maintain clean edges

### "Do transitions need to be identical both modes?"

**No**:
- Adjust shadow intensity per mode (lighter in light mode)
- Dark mode can use more dramatic shadows
- Keep timing/easing consistent
- Test to ensure smoothness in both

---

## Remember

**Luminance Layers isn't just a visual system—it's how we express COW's values:**

- **Clear Hierarchy** = Clear thinking and honest communication
- **Warm Grounding** = Human-centered despite technical sophistication
- **Dual Modes** = Adapting to user needs without compromising quality
- **Professional Quality** = Serious financial infrastructure

Every time you create clear luminance hierarchy with warm grounding, you're communicating: 

**"Sophisticated technology, human touch."**

---

**Keep this guide handy. Share with your team. Build with luminance layers.**

---

*Questions? Reference the full COW_Design_Guide_UPDATED.md for complete details.*

**Last Updated:** October 21, 2025
