# Frontend Animations Polish

## Goal
Elevate the UI's feel by combining an ambient background animation, tactile micro-interactions on UI elements, and a staggered page load animation for the Hero section.

## 1. Ambient Hero Animation
- **What**: The background gradient orbs (`parallax-bg-shape`) in the Hero currently only move on scroll. We will add a slow, continuous CSS animation so they float and breathe independently.
- **Implementation**: Create a `@keyframes float-ambient` in `styles.css` that slightly scales and translates the shapes over a long duration (e.g., 20 seconds) infinitely.
- **Trade-offs**: Minimal performance impact since opacity/transform animations are hardware accelerated.

## 2. Tactile Micro-Interactions
- **What**: Interactive elements should feel physical and responsive.
- **Implementation**: 
  - Add `active:scale-[0.98]` to buttons and cards to create a "press" effect.
  - On the Hero action buttons (GitHub, LinkedIn, Ask AI), add `group` and animate the `ArrowUpRight` icon to slightly shift up and right on hover (`group-hover:-translate-y-0.5 group-hover:translate-x-0.5`).

## 3. Staggered Page Load
- **What**: Instead of the Hero section appearing instantly, it will slide up and fade in sequentially, drawing the user's eye down the content hierarchy.
- **Implementation**: Use Tailwind's `animate-in fade-in slide-in-from-bottom-4` utilities on the Hero elements:
  - Top label: `delay-[0ms]`
  - Tagline: `delay-[150ms] fill-mode-backwards`
  - Paragraph: `delay-[300ms] fill-mode-backwards`
  - Button Row: `delay-[450ms] fill-mode-backwards`
