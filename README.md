# Calculator Pro by BrutalTools

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

> A beautiful, feature-rich scientific calculator web app with smooth animations, persistent history, and reference tables — built with modern web technologies.

---

## Overview

**Calculator Pro** is a fully-featured scientific calculator that runs entirely in the browser. It combines the reliability of a hardware calculator with the convenience and polish of a modern web application. Whether you need quick arithmetic or advanced trigonometric and logarithmic computations, Calculator Pro delivers instant, accurate results with a sleek dark-themed interface.

Developed under **BrutalTools**.

---

## Screenshots

| Basic Mode | Scientific Mode |
|:---:|:---:|
| *[Screenshot placeholder — basic calculator view]* | *[Screenshot placeholder — scientific calculator view]* |

| Calculation History | Reference Tables |
|:---:|:---:|
| *[Screenshot placeholder — history panel]* | *[Screenshot placeholder — reference table sheet]* |

---

## Features

### Calculator

| # | Feature | Description |
|:-:|---------|-------------|
| 1 | Basic & Scientific Modes | Toggle seamlessly between a streamlined basic pad and a full scientific layout with animated transitions |
| 2 | Live Expression Preview | See your expression rendered in real time as you type |
| 3 | Exact Form Detection | Results like `sin(30°)` are returned as `1/2` rather than decimal approximations; supports `√2/2`, `√3`, `(√6−√2)/4`, and more |
| 4 | Full Keyboard Support | Type numbers, operators, and functions directly from your keyboard (see [Keyboard Shortcuts](#keyboard-shortcuts)) |
| 5 | Smart AC / CE Toggle | `AC` clears everything; after the first input it becomes `CE` to clear just the current entry |
| 6 | DEG / RAD Toggle | Switch angle units instantly; all trig functions and exact form detection respect the selected mode |
| 7 | Parentheses | Auto-nested parentheses with visual depth tracking via a live counter badge |
| 8 | Copy to Clipboard | One-click copy of the displayed result (both exact and decimal forms) |
| 9 | Constants | Quick-insert mathematical constants `π` and `e` with proper symbolic display |
| 10 | Scientific Functions | sin, cos, tan (and inverses), log, ln, x², x³, √x, ∛x, x!, eˣ, 10ˣ, 1/x, and |x| |

### Reference Tables

Five tabbed reference sheets accessible via the **Tables** button:

| Tab | Contents |
|-----|----------|
| Trig | Common sin, cos, tan values for 14 angles (0°–360°) with exact forms highlighted in amber |
| Log | log₁₀, ln, log₂, n², and √n for 17 common values |
| Const | 12 mathematical constants (π, e, √2, φ, etc.) with copy-to-clipboard values |
| Powers | n², n³, √n, ∛n, and n! for n = 1 to 20 |
| Conv | Degrees ↔ radians, temperature conversions (°C / °F / K), and common fractions with percentages |

### History & Persistence

Every calculation is saved to a local **SQLite** database via **Prisma ORM**, so your history survives page reloads and browser restarts. Features include:

- Scrollable history panel with expression, result, exact form badges, and mode indicator
- Search through past calculations
- One-click copy of any history entry
- Double-confirm clear button to prevent accidental deletion
- Up to 50 most recent calculations stored

### Design

- **Dark theme** with emerald and amber accent palette
- **Glassmorphism** card effects with backdrop blur throughout the UI
- **Framer Motion** animations for mode transitions, button presses, sheet slides, and result reveals
- **Fully responsive** — optimized for desktop and mobile viewports
- Card-based mobile layouts presented in full-width sheets for comfortable thumb reach
- Custom BrutalTools logo with lightning bolt and gradient glow

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0` — `9` | Enter digit |
| `.` | Decimal point |
| `+` | Add |
| `-` | Subtract |
| `*` | Multiply |
| `/` | Divide |
| `Enter` or `=` | Evaluate expression |
| `Escape` | Clear all (AC) |
| `Delete` | Clear entry (CE) |
| `Backspace` | Delete last character |
| `(` `)` | Open / close parentheses |
| `%` | Percent |

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | **Next.js 16** (App Router) | React framework with server components and file-based routing |
| Language | **TypeScript 5** | Static type checking across the entire codebase |
| Runtime | **Bun** | Fast JavaScript runtime and package manager |
| Styling | **Tailwind CSS 4** | Utility-first CSS with JIT engine |
| Components | **shadcn/ui** (Radix UI) | Accessible, composable UI primitives (Sheet, Tabs, ScrollArea) |
| State | **Zustand** | Lightweight global state management for calculator logic |
| Database | **Prisma ORM** + **SQLite** | Typed database access with zero-config local storage |
| Animation | **Framer Motion** | Declarative spring and gesture animations |
| Icons | **Lucide React** | Consistent, tree-shakeable icon set |

---

## Project Structure

```
calculator/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (theme, fonts, providers)
│   │   ├── page.tsx                # Home page — renders CalculatorApp
│   │   ├── globals.css             # Tailwind directives + custom tokens
│   │   └── api/
│   │       └── calculations/
│   │           └── route.ts        # GET / POST / DELETE calculation history API
│   │
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── calculator-app.tsx  # Main app shell (header, footer, layout, keyboard events)
│   │   │   ├── calculator-display.tsx  # Expression preview + result readout + copy button
│   │   │   ├── calculator-keyboard.tsx # BasicCalculator + ScientificCalculator + Btn/SciBtn
│   │   │   ├── history-panel.tsx   # Scrollable calculation history with search
│   │   │   └── reference-tables.tsx # Tabbed reference tables (Trig, Log, Const, Powers, Conv)
│   │   └── ui/                     # shadcn/ui primitives
│   │
│   ├── stores/
│   │   └── calculator-store.ts     # Zustand store — expression evaluator, history, mode, angle unit
│   │
│   └── lib/
│       ├── db.ts                   # Prisma client singleton
│       ├── exact-values.ts         # Exact form lookup (trig, fractions, radicals, constants)
│       └── utils.ts                # cn() helper and shared utilities
│
├── prisma/
│   └── schema.prisma               # Calculation model definition
│
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

| Requirement | Minimum Version |
|-------------|:---------------:|
| Node.js | >= 18 |
| Bun | latest stable |

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
bun run build
bun start
```

---

## Contributing

Contributions are welcome! To keep the codebase consistent, please follow these guidelines:

1. **Fork** the repository and create a feature branch (`git checkout -b feat/your-feature`).
2. **Write** clean, typed TypeScript. Run `bun run lint` before committing.
3. **Test** your changes locally with `bun run dev`.
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/) format (e.g., `feat: add natural-log reference tab`).
5. **Open** a pull request against `main` with a clear description of the change.

### Reporting Issues

If you find a bug or have a feature request, please [open an issue](https://github.com/brutal-45/Calculator/issues) and include:

- A clear title and description.
- Steps to reproduce (for bugs).
- Expected vs. actual behavior.
- Screenshots if applicable.

---

## License

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

<p align="center">
  <strong>Developed under BrutalTools</strong>
</p>
