<div align="center">

# ⚡ Calculator Pro

**A beautiful, feature-rich scientific calculator with exact form detection, persistent history, and comprehensive reference tables.**  

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0066?style=flat-square&logo=framer)](https://motion.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?style=flat-square)](https://zustand.docs.pmnd.rs/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-0A0A0A?style=flat-square)](https://ui.shadcn.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<p>
  <strong>Calculator Pro</strong> combines the reliability of a hardware calculator with the elegance of a modern web app. Whether you need quick arithmetic or advanced trigonometric computations — it delivers instant, accurate results with a gorgeous dark-themed interface.
</p>

<img src="https://img.shields.io/badge/Made_with_❤️_by_BrutalTools-emerald?style=for-the-badge" alt="Made by BrutalTools" />

</div>

---

## ✨ Highlights

| Feature | Description |
|:--------|:------------|
| 🎯 **Exact Form Detection** | `sin(30°)` → `1/2`, `√(8)` → `2√2/1` — returns symbolic results, not just decimals |
| ⌨️ **Full Keyboard Support** | Type expressions directly — digits, operators, functions, Enter, Escape all mapped |
| 📐 **17 Scientific Functions** | sin, cos, tan (and inverses), log, ln, x², x³, √x, ∛x, x!, eˣ, 10ˣ, 1/x, \|x\| |
| 💾 **Persistent History** | SQLite-powered storage via Prisma — calculations survive reloads and restarts |
| 📚 **5 Reference Tables** | Trig values, logarithms, constants, powers, and conversions — all at your fingertips |
| 🌙 **Glassmorphism UI** | Dark theme with backdrop blur, ambient glow orbs, noise texture, and smooth animations |
| 📱 **Fully Responsive** | Optimized for desktop and mobile — sheets adapt to screen size |
| 🔢 **Live Expression Preview** | See your expression build in real time as you type |

---

## 🖼️ Screenshots

| Mode | Description |
|:---:|:---|
| **Basic** | Clean 4-function layout with AC/CE toggle, ±, %, and full keyboard support |
| **Scientific** | Extended layout with 20 scientific buttons, DEG/RAD toggle, and parenthesized expressions |
| **History** | Scrollable panel with search, copy-to-clipboard, mode badges (BAS/SCI), and relative timestamps |
| **Reference Tables** | Five tabbed sheets with trig values (exact forms highlighted), logarithms, constants, powers, and unit conversions |

---

## 🧮 Feature Details

### Calculator Engine

| # | Feature | Details |
|:-:|---------|---------|
| 1 | **Basic & Scientific Modes** | Seamless animated tab switching between streamlined and full layouts |
| 2 | **Live Expression Preview** | Real-time rendering of your expression as you build it |
| 3 | **Exact Form Detection** | Custom reverse-mapping engine: decimals → fractions, radicals, trig values, constants. Supports `1/2`, `√2/2`, `√3`, `(√6−√2)/4`, and more |
| 4 | **Full Keyboard Support** | All keys mapped: `0-9`, `+-*/.=%()`, `Enter/=`, `Backspace`, `Delete`, `Escape` |
| 5 | **Smart AC / CE Toggle** | `AC` resets everything; after first input becomes `CE` to clear current entry only |
| 6 | **DEG / RAD Toggle** | Instant angle unit switch — all trig functions and exact form detection respect the selected mode |
| 7 | **Parentheses** | Auto-nested with visual depth tracking via an animated counter badge |
| 8 | **Copy to Clipboard** | One-click copy with animated Check/Copy feedback (both display and history) |
| 9 | **Mathematical Constants** | Quick-insert `π` and `e` with proper symbolic display |
| 10 | **17 Scientific Functions** | sin, cos, tan, sin⁻¹, cos⁻¹, tan⁻¹, log, ln, x², x³, √x, ∛x, x!, eˣ, 10ˣ, 1/x, \|x\| |
| 11 | **Gamma Function** | Lanczos approximation for non-integer factorials (up to 170!) |
| 12 | **Implicit Multiplication** | `2(3)` → `2×(3)`, `)(` → `)×(`, `)2` → `)×2` |
| 13 | **Error Handling** | Graceful shake animation on errors — division by zero, invalid operations, overflow |

### Reference Tables

Five tabbed reference sheets accessible via the **Tables** button:

| Tab | Contents |
|-----|----------|
| 📐 **Trig** | Common sin, cos, tan values for 14 angles (0°–360°) with exact forms highlighted in amber |
| 📊 **Log** | log₁₀, ln, log₂, n², and √n for 17 common values |
| π **Const** | 12 mathematical constants (π, e, √2, φ, etc.) with copy-to-clipboard values |
| ⬆ **Powers** | n², n³, √n, ∛n, and n! for n = 1 to 20 |
| 🔄 **Conv** | Degrees ↔ radians, temperature (°C / °F / K), and common fractions with percentages |

### History & Persistence

Every calculation is saved to a local **SQLite** database via **Prisma ORM**:

- 📜 Scrollable history panel with expression, result, exact form badges, and mode indicator
- 🔍 Search through past calculations (appears when >3 entries)
- 📋 One-click copy of any history entry
- ⚠️ Double-confirm clear button to prevent accidental deletion
- 💾 Up to 50 most recent calculations stored and persisted across sessions

### Design & UX

- **Dark theme** with emerald and amber accent palette
- **Glassmorphism** cards with backdrop blur, inner highlights, and layered shadows
- **Framer Motion** animations throughout: mode transitions, button presses, sheet slides, result reveals
- **Ambient glow orbs** with gentle floating animations
- **Dot grid + noise texture** background for visual depth
- **Keyboard shortcut badges** in the footer for quick reference
- **Animated text shimmer** on the BrutalTools branding
- **Custom SVG logo** with lightning bolt, gradient glow, and corner sparkle
- **Fully responsive** — optimized for desktop and mobile viewports

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|:----|:-------|
| `0` — `9` | Enter digit |
| `.` | Decimal point |
| `+` `-` `*` `/` | Add, Subtract, Multiply, Divide |
| `Enter` or `=` | Evaluate expression |
| `Escape` | Clear all (AC) |
| `Delete` | Clear entry (CE) |
| `Backspace` | Delete last character |
| `(` `)` | Open / close parentheses |
| `%` | Percent |

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|:---------|:-----------|:--------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | React framework with server components and file-based routing |
| **UI Library** | [React 19](https://react.dev/) | Latest React with concurrent features |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Static type checking across the entire codebase |
| **Runtime** | [Bun](https://bun.sh/) | Fast JavaScript runtime and package manager |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS with JIT engine |
| **Components** | [shadcn/ui](https://ui.shadcn.com/) (New York) | 50 accessible Radix UI primitives (Sheet, Tabs, ScrollArea, Dialog…) |
| **State** | [Zustand 5](https://zustand.docs.pmnd.rs/) | Lightweight global state management for calculator logic |
| **Database** | [Prisma 6](https://prisma.io/) + SQLite | Typed database access with zero-config local storage |
| **Animation** | [Framer Motion 12](https://motion.dev/) | Declarative spring and gesture animations |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, tree-shakeable icon set |
| **Fonts** | [Geist](https://vercel.com/font) Sans + Mono | Modern typeface designed by Vercel |

---

## 📁 Project Structure

```
calculator/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (theme, fonts, providers)
│   │   ├── page.tsx                # Home page → renders CalculatorApp
│   │   ├── globals.css             # Tailwind directives, OKLCH theme, custom utilities
│   │   └── api/
│   │       ├── route.ts            # Health check: GET → {"message":"Hello, world!"}
│   │       └── calculations/
│   │           └── route.ts        # GET / POST / DELETE calculation history API
│   │
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── calculator-app.tsx      # Main app shell (header, footer, layout, keyboard events)
│   │   │   ├── calculator-display.tsx  # Expression preview + result readout + copy button
│   │   │   ├── calculator-keyboard.tsx # BasicCalculator + ScientificCalculator + Btn/SciBtn
│   │   │   ├── history-panel.tsx       # Scrollable calculation history with search
│   │   │   └── reference-tables.tsx    # 5 reference table panels (Trig, Log, Const, Powers, Conv)
│   │   └── ui/                         # 50 shadcn/ui primitives (new-york style)
│   │
│   ├── stores/
│   │   └── calculator-store.ts         # Zustand store — expression evaluator, history, mode, angle unit
│   │
│   ├── hooks/
│   │   ├── use-mobile.ts               # Mobile breakpoint detection (768px)
│   │   └── use-toast.ts                # Toast notification system
│   │
│   └── lib/
│       ├── db.ts                       # Prisma client singleton
│       ├── exact-values.ts             # Exact form lookup engine (trig, fractions, radicals, constants)
│       └── utils.ts                    # cn() helper and shared utilities
│
├── prisma/
│   └── schema.prisma                   # Calculation model definition (SQLite)
│
├── public/                             # Static assets (logos, robots.txt)
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Browser (Client)                   │
│                                                       │
│  ┌─────────────┐    ┌──────────────┐                  │
│  │  Components   │    │   Zustand     │               │
│  │  (React 19)   │◄──│   Store       │                │
│  │  + Framer     │    │  (285 lines)  │               │
│  │   Motion      │    │              │                │
│  └─────────────┘    └──────┬───────┘                  │
│                             │                         │
│  ┌─────────────┐    ┌──────▼───────┐                  │
│  │  shadcn/ui  │    │  Next.js API │                  │
│  │  (50 comps) │    │  Routes      │                  │
│  └─────────────┘    └──────┬───────┘                  │
└────────────────────────────┼──────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Prisma ORM     │
                    │  + SQLite       │
                    │  (Calculation)  │
                    └─────────────────┘
```

**Data Flow:**
1. User interacts with calculator buttons or keyboard → **Zustand store** updates state
2. On `calculate()`, the store evaluates the expression using the built-in math engine
3. The result is displayed and simultaneously **POSTed** to `/api/calculations`
4. On page load, history is **fetched** from `GET /api/calculations`
5. Prisma ORM manages all database operations with full type safety

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Minimum Version |
|:------------|:----------------|
| [Node.js](https://nodejs.org/) | >= 18 |
| [Bun](https://bun.sh/) | latest stable |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/brutal-45/Calculator.git
cd Calculator

# 2. Install dependencies
bun install

# 3. Generate the Prisma client and create the SQLite database
bunx prisma generate
bunx prisma db push
```

### Development

```bash
bun run dev
```

> The app will be available at `http://localhost:3000`

### Production Build

```bash
bun run build
bun start
```

---

## 🤝 Contributing

Contributions are welcome! To keep the codebase consistent, please follow these guidelines:

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b feat/your-feature
   ```
2. **Write** clean, typed TypeScript. Run lint before committing:
   ```bash
   bun run lint
   ```
3. **Test** your changes locally:
   ```bash
   bun run dev
   ```
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/) format:
   ```
   feat: add natural-log reference tab
   fix: correct parentheses count in scientific mode
   docs: update README with new keyboard shortcuts
   ```
5. **Open** a pull request against `main` with a clear description of the change.

### Reporting Issues

If you find a bug or have a feature request, please [open an issue](https://github.com/brutal-45/Calculator/issues) and include:

- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Screenshots if applicable

---

## 📜 License

This project is released under the **MIT License**.

```
MIT License

Copyright (c) 2025 BrutalTools

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

<strong>Developed under BrutalTools</strong>

Made with ❤️ · ⚡ Powered by Next.js, React, and Tailwind CSS

</div>
