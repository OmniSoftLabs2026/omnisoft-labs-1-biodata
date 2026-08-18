# BiodataCraft – Product Requirements Document

## Overview
A modern marriage biodata generator website using Next.js, React, and Tailwind CSS with premium, minimal UI.

## Completed Features
- **Homepage** with hero section, template showcase (8 cards), and 3-step guide
- **Biodata Generator** form with 3 sections (Personal, Family, Contact), drag-to-reorder, field deletion, autosave to localStorage
- **Design Page** with 8 premium template picker + live preview
- **8 Premium Templates** with strict `Label : Value` layout:
  1. Ivory Cream (#FAF8F5) – burgundy text on off-white
  2. Warm Taupe (#9A8C80) – white text on warm gray
  3. Royal Gold (#D4AF37) – dark brown text on gold
  4. Deep Burgundy (#5B1E31) – gold/cream text on maroon
  5. Forest Green (#1C3B2B) – gold/cream text on dark green
  6. Sage Garden (#9CAF88) – dark green text on sage
  7. Terracotta (#C86D51) – white text on terracotta
  8. Peach Blush (#DCAE96) – dark brown text on peach

## Constraints
- No actual payment or authentication yet
- Data stored client-side only (localStorage)

## Upcoming Tasks
- P0: Payment Page UI (mock – no real gateway)
- P0: PDF Generation / Download on Success page
- P1: Section Reorder (drag whole sections)
- P2: Custom "BIO DATA" title text
