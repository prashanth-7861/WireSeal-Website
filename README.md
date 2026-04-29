# WireSeal Landing Page

A premium, terminal-inspired landing page designed to sell WireSeal as the professional WireGuard solution.

## Design Direction

- **Visual aesthetic**: Premium security tool / terminal app feel
- **Color palette**: Dark theme with green (#22c55e) accent - terminal/hacker vibes
- **Typography**: JetBrains Mono (display + code) + Instrument Sans (body)
- **Atmosphere**: Scanlines, grid background, floating glows, typing cursor

## Key Selling Points

1. **Lead with pain**: WireGuard defaults to plaintext configs — keys on disk
2. **Solution**: Zero plaintext secrets with encrypted vault
3. **Technical differentiation**: Dual-layer AEAD, Argon2id KDF, TOTP 2FA
4. **Comparison table**: Wins vs manual setup vs WG-Easy across 9 features

## Structure

1. Hero — "Your WireGuard keys should never see daylight" + terminal mockup
2. Problem — Why existing solutions fail (3 cards)
3. Architecture — Defense in depth visualization
4. Compare — Feature table vs alternatives
5. Install — CTA with one-liner copy buttons

## Usage

Open `index.html` in any modern browser. No build step required.

## Tech Stack

- Pure HTML/CSS/JS
- Google Fonts: JetBrains Mono, Instrument Sans
- CSS Grid + Flexbox
- Native scroll-behavior: smooth
- Intersection Observer for animations (optional)

## File Structure

```
index.html    # Main page
style.css    # All styles
script.js    # Interactions
favicon.svg  # Logo
README.md    # This file
```

## Based On

[WireSeal](https://github.com/prashanth-7861/WireSeal) — WireGuard server automation with zero plaintext secrets