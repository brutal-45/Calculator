---
Task ID: 1
Agent: Main Agent
Task: Fix all issues and add GitHub link option

Work Log:
- Fixed logo Math.random() flickering — replaced with static SVG gradient ID
- Fixed exact form trig lookup bug in RAD mode — findExactForm now verifies decimal matches expected trig value
- Fixed keyboard handler regex — removed unhandled ^ and c characters
- Cleaned up dead JSX children in the divide button of BasicCalculator
- Added GitHub link component to footer with add/edit/remove functionality (localStorage)

Stage Summary:
- All lint errors resolved (zero issues)
- Dev server compiles cleanly with no errors
- 5 bugs/issues fixed + 1 new feature (GitHub link) added
- Files modified: calculator-app.tsx, calculator-keyboard.tsx, exact-values.ts, calculator-store.ts
---
Task ID: 1
Agent: Main Agent
Task: Solve all issues in calculator app and update README.md

Work Log:
- Read and analyzed all 14 source files in the calculator project
- Ran ESLint — no lint errors found
- Identified 4 bugs and 1 README accuracy issue
- Fixed Delete key not in preventDefault check in calculator-app.tsx keyboard handler
- Fixed pressing = after result showing Error (now returns early when hasResult is true) in calculator-store.ts
- Fixed constant display (e/π) — typing digits after constant no longer creates invalid display like e5
- Fixed scientificFunction not working on constant displays (sin(e) now correctly computes sin(Math.E))
- Added isConstantSymbol() and constantValue() helper functions to calculator-store.ts
- Rewrote README.md with accurate project structure, correct keyboard shortcuts, bun commands, and detailed feature descriptions

Stage Summary:
- 4 bugs fixed: Delete key preventDefault, = after result, constant digit append, scientific functions on constants
- README fully rewritten to match actual file structure and features
- All changes verified with ESLint (clean) and dev server compilation (successful)
- No existing features were changed or removed
