# Calculator Pro by BrutalTools

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

> A beautiful, feature-rich scientific calculator web app with smooth animations, persistent history, and reference tables -- built with modern web technologies.

---

## Overview

**Calculator Pro** is a fully-featured scientific calculator that runs entirely in the browser. It combines the reliability of a hardware calculator with the convenience and polish of a modern web application. Whether you need quick arithmetic or advanced trigonometric and logarithmic computations, Calculator Pro delivers instant, accurate results with a sleek dark-themed interface.

Developed under **BrutalTools**.

---

## Screenshots

| Basic Mode | Scientific Mode |
|:---:|:---:|
| *[Screenshot placeholder -- basic calculator view]* | *[Screenshot placeholder -- scientific calculator view]* |

| Calculation History | Reference Tables |
|:---:|:---:|
| *[Screenshot placeholder -- history panel]* | *[Screenshot placeholder -- reference table sheet]* |

---

## Features

### Calculator

| # | Feature | Description |
|:-:|---------|-------------|
| 1 | Basic & Scientific Modes | Toggle seamlessly between a streamlined basic pad and a full scientific layout with animated transitions |
| 2 | Live Expression Preview | See your expression rendered in real time as you type |
| 3 | Exact Form Detection | Results like `sin(30 deg)` are returned as `1/2` rather than decimal approximations; supports `sqrt(2)/2`, `sqrt(3)`, and more |
| 4 | Full Keyboard Support | Type numbers, operators, and functions directly from your keyboard (see [Keyboard Shortcuts](#keyboard-shortcuts)) |
| 5 | Smart AC / CE Toggle | `AC` clears everything; after the first input it becomes `CE` to clear just the current entry |
| 6 | DEG / RAD Toggle | Switch angle units instantly; all trig functions respect the selected mode |
| 7 | Parentheses | Auto-nested parentheses with visual depth tracking |
| 8 | Copy to Clipboard | One-click copy of the displayed result |

### Reference Tables

Five tabbed reference sheets accessible from the scientific pad:

| Tab | Contents |
|-----|----------|
| Trigonometry | Common sin, cos, tan values; identities |
| Logarithms | log, ln, and exponential reference |
| Constants | Mathematical and physical constants |
| Powers | Squares, cubes, and nth powers |
| Conversions | Unit conversion quick-reference |

### History & Persistence

Every calculation is saved to a local **SQLite** database via **Prisma ORM**, so your history survives page reloads and browser restarts. Scroll through past expressions and results, and clear history at any time.

### Design

- **Dark theme** with emerald and amber accent palette
- **Glassmorphism** card effects throughout the UI
- **Framer Motion** animations for mode transitions, button presses, and sheet slides
- **Fully responsive** -- optimized for desktop and mobile viewports
- Card-based mobile layouts presented in bottom sheets for comfortable thumb reach

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0` -- `9` | Enter digit |
| `.` | Decimal point |
| `+` | Add |
| `-` | Subtract |
| `*` | Multiply |
| `/` | Divide |
| `Enter` or `=` | Evaluate expression |
| `Escape` | Clear all (AC) |
| `Backspace` | Delete last character |
| `(` `)` | Open / close parentheses |
| `%` | Percent |
| `^` | Power |

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | **Next.js 16** (App Router) | React framework with server components and file-based routing |
| Language | **TypeScript 5** | Static type checking across the entire codebase |
| Styling | **Tailwind CSS 4** | Utility-first CSS with JIT engine |
| Components | **shadcn/ui** (Radix UI) | Accessible, composable UI primitives |
| State | **Zustand** | Lightweight global state management |
| Database | **Prisma ORM** + **SQLite** | Typed database access with zero-config local storage |
| Animation | **Framer Motion** | Declarative spring and gesture animations |
| Icons | **Lucide React** | Consistent, tree-shakeable icon set |

---

## Project Structure

```
calculator/
|-- app/
|   |-- layout.tsx              # Root layout (theme, fonts, providers)
|   |-- page.tsx                # Home page -- calculator
|   |-- api/
|       |-- history/
|           |-- route.ts        # GET / POST calculation history
|   |-- globals.css             # Tailwind directives + custom tokens
|
|-- components/
|   |-- calculator/
|   |   |-- display.tsx         # Expression preview + result readout
|   |   |-- button-grid.tsx     # Basic & scientific button layouts
|   |   |-- keypad-button.tsx   # Individual button with press animation
|   |   |-- history-panel.tsx   # Scrollable calculation history
|   |   |-- ref-tables.tsx      # Tabbed reference tables sheet
|   |   |-- angle-toggle.tsx    # DEG / RAD switch
|   |   `-- copy-button.tsx     # Copy-to-clipboard action
|   |-- ui/                     # shadcn/ui primitives
|   |-- header.tsx              # App bar with logo + GitHub link
|   `-- footer.tsx              # "Developed under BrutalTools"
|
|-- lib/
|   |-- store.ts                # Zustand store (expression, history, mode)
|   |-- evaluator.ts            # Expression parser + exact-form detection
|   `-- utils.ts                # cn() helper and shared utilities
|
|-- prisma/
|   |-- schema.prisma           # History model definition
|   `-- dev.db                  # SQLite database file (gitignored)
|
|-- public/
|   `-- logo.svg                # BrutalTools lightning-bolt logo
|
|-- package.json
|-- tsconfig.json
|-- tailwind.config.ts
|-- next.config.ts
`-- README.md
```

---

## Getting Started

### Prerequisites

| Requirement | Minimum Version |
|-------------|:---------------:|
| Node.js | >= 18 |
| npm, yarn, or pnpm | latest stable |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/brutal-45/Calculator.git
cd Calculator

# 2. Install dependencies
npm install

# 3. Generate the Prisma client and create the SQLite database
npx prisma generate
npx prisma db push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Contributing

Contributions are welcome! To keep the codebase consistent, please follow these guidelines:

1. **Fork** the repository and create a feature branch (`git checkout -b feat/your-feature`).
2. **Write** clean, typed TypeScript. Run `npm run lint` before committing.
3. **Test** your changes locally with `npm run dev`.
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/) format (e.g., `feat: add natural-log reference tab`).
5. **Open** a pull request against `main` with a clear description of the change.

### Code Style

- Use **Prettier** with the included config (`npm run format`).
- Use **ESLint** with Next.js and TypeScript rules (`npm run lint`).
- Prefer functional components and hooks; avoid class components.

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
