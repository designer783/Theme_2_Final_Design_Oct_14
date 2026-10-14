# Detailed Sticker Sheet — Theme 2

A modern, high-performance automotive documentation web application for vehicle sellers and buyers. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## 🚀 Key Features

- **Editorial Brutalist Design System**:
  - **Design A**: Editorial newsprint/paper aesthetic with tactile hairline borders, custom grain effects, and signal red accents (`#d9381e`).
  - **Design B**: Sleek dark layout with high-contrast typography, unified vibrant orange CTA buttons (`#ffa51f`), and responsive hover states.
  - Interactive theme switcher (`?design=a` / `?design=b`) with `localStorage` persistence.
- **Mobile-First Responsive Architecture**:
  - Full responsive layout across mobile (375px+), tablet, and desktop (up to 4K / 2560px).
  - Clean slide-out navigation drawer with accessible keyboard focus trap and ARIA labels.
- **Interactive VIN & Plate Lookup**:
  - Stacked mobile-friendly input fields with dynamic character counters and inline validation.
  - Decodes real sample vehicles and dynamically generates vehicle specs for custom 17-character VINs.
- **Certified Sample Vehicle Records**:
  - Live certified vehicle reports and authentic factory window stickers for Toyota Corolla, Honda Civic, Mercedes-Benz C300, and Toyota Tacoma.
  - Deep-linked sample sticker URLs matching production database format.
- **Interactive Modals**:
  - High-resolution Monroney window sticker preview with printable PDF view option.
  - Multi-tab certified vehicle history report modal (timeline, title brands check, odometer verification, auction history).
  - Detailed build sheet modal.
  - Dynamic checkout modal with plan summary, quantity discount calculations, base64 data encoding, and checkout redirection.
- **Returning Visitor Revisit Banner**:
  - Detects prior vehicle searches from session cookies and displays a bottom-left retention alert with a special `$20` access offer.
- **Live Chat & Customer Support**:
  - Floating live chat launcher with direct agent integration.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/) with Single-File Bundle Plugin
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with Vanilla CSS design tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `pnpm`

### Installation

```bash
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- To preview **Design A**: [http://localhost:3000/?design=a](http://localhost:3000/?design=a)
- To preview **Design B**: [http://localhost:3000/?design=b](http://localhost:3000/?design=b)

### Type Checking

```bash
npm run typecheck
```

### Production Build

Compile and bundle the production single-file package:

```bash
npm run build
```

The output bundle is generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📂 Project Structure

```text
├── public/                 # Static assets (images, logos, textures)
│   ├── images/             # Background textures & banner artwork
│   └── *.webp              # Vehicle thumbnails and sample stickers
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Chrome.tsx      # Header, mobile drawer, footer, design switch
│   │   ├── LookupForm.tsx  # VIN & license plate lookup forms
│   │   ├── PricingGrid.tsx # Pricing plans, package toggle & checkout modal
│   │   ├── RevisitBanner.tsx # Returning visitor alert banner
│   │   ├── LiveChatWidget.tsx # Floating live chat launcher
│   │   ├── InteractiveReportModal.tsx # Vehicle history report modal
│   │   ├── InteractiveStickerModal.tsx # Window sticker preview modal
│   │   └── Ui.tsx          # Design system wrappers, section heads, buttons
│   ├── config/             # Site configuration, domain constants, and pricing tiers
│   │   ├── site.ts         # Brand name, domains, support phone/email
│   │   └── pricing.ts      # Plans, prices, limits, and checkout plan codes
│   ├── data/               # Content copy, navigation, legal text, and mock vehicles
│   │   ├── content.ts      # Page copy transcribed from locked specs
│   │   ├── legalText.ts    # Complete Terms & Conditions and Privacy Policy body
│   │   └── mockData.ts     # Sample vehicle records and window sticker specs
│   ├── pages/              # Application pages (Home, VehicleHistory, Sample, Pricing, etc.)
│   ├── utils/              # Cookie helpers, base64 encoders, and lookup utilities
│   ├── App.tsx             # Main application orchestrator & routing
│   ├── index.css           # Global typography tokens, design tokens & Design B styles
│   └── main.tsx            # Application entry point
├── package.json            # Project manifest & build scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build and single-file bundling configuration
```

---

## 📄 License

Proprietary — All rights reserved.
