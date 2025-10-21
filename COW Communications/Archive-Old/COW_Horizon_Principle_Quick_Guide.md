# The Horizon Principle: Quick Implementation Guide

## For Designers, Developers, and Content Creators

**TL;DR:** Cerulean (sky/water) always meets Earth (stone/clay/growth). Never let cerulean float alone.

---

## The 30-Second Rule

Before publishing any design, ask:

**"Where does sky meet earth in this design?"**

If you can't answer, add earth-tone grounding.

---

## Quick Decision Tree

```
Is there cerulean (blue) in your design?
    │
    ├─→ YES: Is there earth-tone grounding?
    │        │
    │        ├─→ YES: ✅ Good! Ship it.
    │        │
    │        └─→ NO: ❌ Add earth-tone element
    │                 (footer, base, background, accent)
    │
    └─→ NO: Are you using earth tones only?
             │
             ├─→ YES: Add cerulean accent
             │        (at least 10% of composition)
             │
             └─→ NO: ❌ Not on brand
                      Use cerulean + earth combination
```

---

## 5 Fast Fixes for Common Situations

### Fix 1: Logo on Page (Most Common Issue)

**Problem:** Cerulean logo floating on pure white page

**Solution:** Add earth-tone element anywhere on page
```
Options:
• Earth-tone footer section
• Warm stone header accent line
• Soft clay background for one section
• Terra cotta divider between sections
```

**Minimum:** 20% of page should have earth-tone presence

---

### Fix 2: Hero Section

**Problem:** Cerulean gradient with text, no grounding

**Solution:** Create horizon composition
```
┌──────────────────────────────┐
│ Cerulean gradient (top 40%)  │ ← Sky
├──────────────────────────────┤ ← Horizon
│ Earth gradient (bottom 60%)  │ ← Ground
└──────────────────────────────┘

Colors:
• Top: #007BA7 → #B0E0E6
• Bottom: #C9B8A8 → #9B8B7E
```

**Text placement:** On horizon zone for best contrast

---

### Fix 3: Button or CTA

**Problem:** Cerulean button floating in white space

**Solution:** Add earth-tone context
```
Options:
• Place button in soft clay background section
• Add warm stone footer bar behind button
• Use earth-tone container for button area
```

**Quick win:** Wrap button area in `background: #C9B8A8` container

---

### Fix 4: Icons or Illustrations

**Problem:** Cerulean icon with no base

**Solution:** Add earth-tone grounding element
```
   ≈≈≈  ← Cerulean icon/element
    │
  ─────  ← Earth-tone base (warm stone)

Implementation:
• Add 4px warm stone bottom border
• Place icon on soft clay background
• Add earth-tone shadow/base shape
```

---

### Fix 5: Data Visualization

**Problem:** Cerulean chart on white background

**Solution:** Earth-tone context
```
Options:
• Chart container: soft clay background
• Chart axis: warm stone color
• Supporting text: terra cotta accents
• Legend background: earth-tone panel
```

**Minimum:** Chart should have earth-tone border or background

---

## Color Combinations Cheat Sheet

### For Professional Contexts (Finance, Products)
```
Primary: Deep Cerulean (#007BA7) - 60%
Ground:  Warm Stone (#9B8B7E) - 35%
Accent:  Gold (#B8860B) - 5%
```

### For Life Programs (Human-Centered)
```
Primary: Light Cerulean (#4FC3E0) - 40%
Ground:  Soft Clay (#C9B8A8) - 50%
Accent:  Bamboo Green (#6B8E6F) - 10%
```

### For Community/Blog (Accessible)
```
Primary: Powder Blue (#B0E0E6) - 30%
Ground:  Rice Paper (#F5F3F0) - 60%
Accent:  Moss (#8A9A7B) - 10%
```

### For Premium Features
```
Primary: Deep Cerulean (#007BA7) - 30%
Feature: Terra Cotta (#C77A58) - 30%
Feature: Deep Gold (#B8860B) - 30%
Ground:  Warm Stone (#9B8B7E) - 10%
```

---

## Copy-Paste Code Snippets

### CSS: Hero with Horizon

```css
.hero {
  display: flex;
  flex-direction: column;
  height: 600px;
}

.hero-sky {
  flex: 4; /* 40% */
  background: linear-gradient(to bottom, #007BA7, #B0E0E6);
}

.hero-earth {
  flex: 6; /* 60% */
  background: linear-gradient(to bottom, #C9B8A8, #9B8B7E);
}
```

### CSS: Grounded Card

```css
.card {
  background: white;
  border-radius: 12px;
  border-bottom: 4px solid #9B8B7E; /* Warm stone ground */
  padding: 24px;
}
```

### CSS: Grounded Button

```css
.button-container {
  background: #C9B8A8; /* Soft clay */
  padding: 48px 24px;
  border-radius: 8px;
}

.button {
  background: #007BA7; /* Cerulean */
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}
```

### CSS: Section with Earth Footer

```css
.section {
  display: flex;
  flex-direction: column;
}

.section-content {
  background: white; /* or cerulean tones */
  padding: 64px 24px;
}

.section-ground {
  background: #9B8B7E; /* Warm stone */
  height: 8px; /* Grounding strip */
}
```

---

## Figma Quick Actions

### Create Horizon Component

1. **Create Frame:** 1920 x 800px
2. **Add Rectangle 1:** Full width, 320px height
   - Fill: Linear gradient #007BA7 → #B0E0E6
   - Position: Top
3. **Add Rectangle 2:** Full width, 480px height
   - Fill: Linear gradient #C9B8A8 → #9B8B7E
   - Position: Bottom
4. **Name:** "Hero Horizon Template"
5. **Create Component:** ⌘⌥K

### Create Grounded Card Component

1. **Create Frame:** 400 x 300px
2. **Add Rectangle (Card):** Fill: White, Radius: 12px
3. **Add Rectangle (Ground):** 4px height at bottom
   - Fill: #9B8B7E (Warm Stone)
4. **Name:** "Card - Grounded"
5. **Create Component:** ⌘⌥K

---

## Common Mistakes & Fixes

### Mistake 1: Pure White Everywhere

❌ **Wrong:**
- Cerulean logo
- White background
- No earth tones anywhere

✅ **Right:**
- Cerulean logo
- Mostly white background
- Warm stone footer or accent section (20%+)

---

### Mistake 2: Earth Tones as Tiny Accent Only

❌ **Wrong:**
- 95% cerulean
- 5% warm stone (tiny border)

✅ **Right:**
- 60% cerulean
- 40% earth tones (substantial grounding)

---

### Mistake 3: No Clear Horizon Moment

❌ **Wrong:**
- Cerulean scattered throughout
- Earth tones scattered throughout
- No clear meeting point

✅ **Right:**
- Clear separation or transition
- Visible "where sky meets earth" moment
- Intentional relationship between colors

---

## Testing Your Design

### Checklist:

- [ ] Is cerulean present? (Yes = on brand)
- [ ] Are earth tones present? (Yes = grounded)
- [ ] Can I point to "where sky meets earth"?
- [ ] Is the ratio appropriate (60-40, 50-50, or 40-60)?
- [ ] Does it feel warm AND professional?
- [ ] Would this design look good in grayscale? (composition test)

### The Squint Test:

1. Step back from screen
2. Squint at design
3. See color blocks, not details

**Ask:** Do I see cerulean AND earth in relationship?

If no, adjust ratios.

---

## When to Break the Rule

**Almost never.** But if you must:

**Acceptable exceptions:**
- Small UI elements (individual icons, buttons in isolation)
- Print materials where color is limited
- Black and white contexts

**Still apply principle:**
- Ensure page/context has horizon moment
- Don't let the entire experience float
- Ground the system, even if individual elements float

---

## Quick Reference: Earth Tone Colors

**Copy these hex codes:**

```
Warm Stone:     #9B8B7E
Soft Clay:      #C9B8A8
Terra Cotta:    #C77A58
Desert Sand:    #D4BFA0
Bamboo Green:   #6B8E6F
Moss:           #8A9A7B
Sage:           #A4AC96
Rice Paper:     #F5F3F0
```

**Pro tip:** Add these to Figma/Sketch swatches as "Earth Tones - Grounding"

---

## Questions?

### "How much earth tone is enough?"

**Minimum:** 20% of composition  
**Ideal:** 30-60% depending on context  
**Maximum:** 70% (keep some cerulean present)

### "Can I use just earth tones?"

**Short answer:** No.

**Why:** Cerulean is your brand signature. Without it, you're not COW.

**Solution:** Add at least 10% cerulean accent (button, header, icon)

### "What if my design is mostly text?"

**Solution:** Ground the text container
- Text on rice paper background (#F5F3F0)
- Cerulean headers
- Warm stone section dividers
- Earth-tone footer

### "Does this apply to emails?"

**Yes!** Every touchpoint needs horizon moment.

**Quick email fix:**
- Header: Cerulean background or logo
- Body: White or rice paper
- Footer: Warm stone background section

### "What about social media?"

**Yes!** Even small formats.

**Instagram post template:**
```
┌──────────────┐
│ Cerulean top │ 30%
├──────────────┤
│ Content      │ 50%
├──────────────┤
│ Earth bottom │ 20%
└──────────────┘
```

---

## Remember

**The Horizon Principle isn't a rule to follow blindly—it's the visual expression of COW's values:**

- **Aspiration** (cerulean) **grounded in reality** (earth)
- **Innovation** (sky) **rooted in nature** (ground)
- **Transformation** (water) **honoring foundation** (stone)

Every time you create a horizon moment, you're communicating: "We're reaching for the sky, but standing on solid ground."

---

**Keep this guide handy. Share with your team. Make the horizon visible in everything you create.**

---

*Questions? Reference the full COW_Design_Guide_UPDATED.md for complete details.*

**Last Updated:** October 15, 2025