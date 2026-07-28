---
version: alpha
name: Saleshandy Modern SaaS
description: A bright, conversion-focused SaaS system with strong blue accents, crisp typography, and soft low-elevation surfaces.
colors:
  primary: "#275DF5"
  secondary: "#0B0B0B"
  tertiary: "#EEEEEE"
  neutral: "#FFFFFF"
  surface: "#FFFFFF"
  on-surface: "#0B0B0B"
  muted: "#6B7280"
  border: "#EEEEEE"
  success: "#10B981"
  warning: "#F59E0B"
  info: "#DDE7FF"
  error: "#EF4444"
typography:
  headline-display:
    fontFamily: Matter
    fontSize: 57px
    fontWeight: 700
    lineHeight: 68px
    letterSpacing: -1.4742px
  headline-lg:
    fontFamily: Matter
    fontSize: 40px
    fontWeight: 700
    lineHeight: 57.834px
    letterSpacing: -1.701px
  headline-md:
    fontFamily: Matter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 33.264px
    letterSpacing: -0.756px
  headline-sm:
    fontFamily: Matter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  body-lg:
    fontFamily: Matter
    fontSize: 18px
    fontWeight: 500
    lineHeight: 28px
    letterSpacing: 0px
  body-md:
    fontFamily: Matter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0px
  body-sm:
    fontFamily: Matter
    fontSize: 13px
    fontWeight: 500
    lineHeight: 18px
    letterSpacing: 0px
  label-lg:
    fontFamily: Matter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  label-md:
    fontFamily: Matter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0px
  label-sm:
    fontFamily: Matter
    fontSize: 12px
    fontWeight: 700
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Matter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
rounded:
  none: 0px
  sm: 8px
  md: 10px
  lg: 14px
  xl: 18px
  full: 9999px
spacing:
  xs: 6px
  sm: 14px
  md: 24px
  lg: 96px
  xl: 128px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 10px 20px
    height: 56px
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 10px 20px
    height: 56px
  button-link:
    backgroundColor: transparent
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 0px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    height: 56px
  chip:
    backgroundColor: "{colors.info}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 8px 14px
  top-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-sm}"
    height: 40px
  nav-item:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.label-md}"
    padding: 0px
---

# Saleshandy Modern SaaS

## Overview
Saleshandy presents as a confident, high-conversion B2B SaaS brand: clean, modern, and optimized for immediate action. The visual tone is professional rather than playful, with a bright white canvas, a strong electric-blue accent, and dense but orderly trust-building content. The layout feels spacious in the hero, then progressively more information-rich below, signaling a product built for sales teams that value clarity and speed.

## Colors
- **Primary (#275DF5):** A vivid blue used for the main CTA, active highlights, and key emphasis. It carries the brand’s energy and draws attention to conversion points.
- **Secondary (#0B0B0B):** A near-black ink color used for primary text and headlines. It creates sharp contrast and keeps the interface crisp and authoritative.
- **Neutral (#FFFFFF):** The base canvas for the entire site. This pure white surface supports the airy SaaS feel and lets blue accents stand out.
- **Surface (#FFFFFF):** Card and form backgrounds remain white, reinforcing a flat, clean layering strategy with subtle shadows instead of strong tonal blocks.
- **Tertiary (#EEEEEE):** A soft light gray used for borders, dividers, and subtle UI separation. It avoids visual noise while still defining structure.
- **Muted (#6B7280):** A subdued gray for less important navigation and supporting text. It keeps hierarchy clear without competing with headlines.
- **Border (#EEEEEE):** A dedicated border tone that keeps inputs, buttons, and cards softly outlined rather than heavily framed.
- **Info (#DDE7FF):** A pale blue tint suitable for selected chips, secondary highlights, and neutral emphasis states.
- **Success (#10B981):** A green accent for positive states and trust indicators when needed.
- **Warning (#F59E0B):** A warm amber used sparingly for cautionary or attention-oriented messages.
- **Error (#EF4444):** A clear red for destructive actions or validation errors.

## Typography
The system uses Matter across the interface, giving the brand a modern, geometric, and highly legible voice. Headings are bold and tightly tracked, with large negative letter spacing at display sizes to create a strong, sales-led visual impact. Body text is medium-weight and compact, reflecting the product’s efficiency-first personality.

- **Headlines:** `headline-display`, `headline-lg`, and `headline-md` are used for hero statements and section titles. They rely on 700/600 weights, large sizes, and reduced letter spacing to feel authoritative and conversion-oriented.
- **Body:** `body-lg`, `body-md`, and `body-sm` support descriptive copy, trust messages, and microcopy. The base body rhythm is restrained and readable, with 14px/20px as the most practical everyday size.
- **Labels:** `label-lg`, `label-md`, and `label-sm` are intended for buttons, nav items, chips, and small utility text. Labels are typically semibold or bold for clarity in high-action areas.
- **Caption:** `caption` handles low-emphasis helper content such as disclaimers and note text.
- Uppercase styling is not a dominant pattern; emphasis is created more through weight, scale, and accent color than through all-caps treatment.

## Layout & Spacing
The page uses a centered, fixed-max-width hero layout with generous outer whitespace and a vertically stacked content rhythm. The spacing scale is intentionally simple: small increments of 6px and 14px support tight UI alignment, while 24px separates major elements and 96px/128px create section-level breathing room.

Cards and controls use compact padding rather than oversized interior spacing, matching the product’s conversion-first tone. The overall composition is airy at the top, then denser in the trust and proof sections, which helps guide users from headline to signup with minimal friction.

## Elevation & Depth
Depth is intentionally subtle. Rather than heavy shadows or layered surfaces, the interface depends on high contrast, fine borders, and occasional soft shadows to indicate interactivity. Primary emphasis comes from color and typography, while cards and inputs use light gray borders and restrained shadowing to stay polished but not ornamental.

This flat-light approach works well for a SaaS landing page because it keeps attention on the CTA and social proof instead of on decorative depth effects.

## Shapes
The shape language is soft and approachable, with medium corner radii on controls and cards. `rounded.md` and `rounded.lg` define the main visual rhythm, while `rounded.full` is reserved for pills and chips. The result is modern and friendly, but still disciplined enough for a business tool.

## Components
- **Buttons:** `button-primary` is the dominant action style: blue fill, white text, semibold label, 56px height, and 10px/20px padding. Use it for signup and demo-driving actions. `button-secondary` is a white button with a light border and subtle shadow for secondary conversions like booking a demo. `button-link` is reserved for header or banner links and should remain minimal.
- **Navigation items:** `nav-item` should stay muted and lightweight, with no filled background. Active states should rely on weight or color rather than heavy decoration.
- **Cards:** `card` uses a white background, `rounded.lg`, and soft shadowing. Cards should feel like clean containers for proof, form blocks, or feature groupings rather than prominent surfaces.
- **Inputs:** `input` fields should be 56px tall, lightly bordered, and set in body text. Focus states should use the primary blue for clarity, but the base appearance should stay understated.
- **Chips:** `chip` is pill-shaped and lightly tinted, suitable for feature selectors or capability tags. Keep chip padding compact and text semibold enough to remain legible at small sizes.
- **Top banner:** `top-banner` is a compact blue strip with white text and short promotional copy. It should remain visually separate but not overpower the main navigation.
- **Trust and social proof elements:** Review badges, customer logos, and certification marks should remain low-contrast and orderly. Their job is to validate, not to compete with the hero CTA.
- **Form groupings:** Signup areas should prioritize one clear primary action and one or two low-friction alternatives such as Google or Microsoft sign-in.

## Do's and Don'ts
- Do keep the interface bright, clean, and conversion-focused.
- Do use the primary blue sparingly to concentrate attention on CTAs and active states.
- Do preserve the strong headline hierarchy with bold Matter typography and tight tracking.
- Do rely on subtle borders and soft shadows instead of heavy elevation.
- Don't introduce dark themes, rich gradients, or decorative textures.
- Don't over-round controls; keep corners medium and controlled.
- Don't make secondary actions look more prominent than the primary signup path.
- Don't clutter the layout with excessive color variation or dense visual ornamentation.