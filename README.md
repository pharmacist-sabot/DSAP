# Drug Safety Assessment Platform (DSAP)

> *Web application for hospital medication safety self-assessment based on 2022 standards.*

![Vue 3](https://img.shields.io/badge/Vue-3.5+-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-06B6D4?logo=tailwindcss)
![Pinia](https://img.shields.io/badge/Pinia-Store-FFE450?logo=pinia)

## About The Project

This project is a specialized assessment tool designed to help hospitals evaluate their **Medication Safety Standards**. It covers **15 Standards** across **4 Dimensions** (Management, Service, System, Supply Chain).

The system implements a **Waterfall Scoring Logic**, ensuring that higher levels (Level 2-5) can only be achieved if previous levels are completed.

### Key Features

- **Config-Driven UI:** All assessment criteria are generated dynamically from `src/data/standards.json`.
- **Waterfall Scoring System:** Intelligent logic to calculate achieved levels based on completed criteria.
- **State Persistence:** Auto-save progress to `LocalStorage` using Pinia & VueUse.
- **Responsive Design:** Clean UI with Sidebar Navigation, utilizing Tailwind CSS.
- **Strict Typing:** Fully typed with TypeScript for reliability and maintainability.

---

## Architecture & Structure

This project is built upon a scalable architecture designed for long-term maintenance.

```text
src/
├── components/
│   ├── assessment/       # Domain-specific components (LevelCard, StandardNav)
│   └── common/           # Reusable atoms (BaseButton, BaseCheckbox, BaseDialog)
├── data/
│   └── standards.json    # The "Brain" of the app (15 Standards Config)
├── layouts/
│   └── AssessmentLayout.vue  # Main layout with Sidebar
├── stores/
│   └── assessment.ts     # Central State Management & Scoring Logic
├── types/
│   └── models.ts         # Type Definitions (Standard, Progress, HospitalInfo)
└── views/
    └── assessment/       # Page Views
```

## Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Utilities:** [VueUse](https://vueuse.org/) (for `useStorage`)
- **Linting:** ESLint (Antfu Config)

---

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- pnpm (Package Manager)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/pharmacist-sabot/DSAP.git

# 2. Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

The application will be available at `http://localhost:5173/`.

### Linting & Formatting

```bash
# Fix linting issues automatically
pnpm lint:fix
```

---

## Data Model (Concept)

The assessment logic relies on the relationship between `Standard`, `Level`, and `Criteria`.

```typescript
// See src/types/models.ts for full definition

interface Standard {
  id: number;
  levels: StandardLevel[]; // Level 0 - 5
}

interface StandardLevel {
  level: number;
  criteria: EvaluationCriterion[]; // Checkbox items
}
```

---

## License

This project is licensed under the [MIT License](LICENSE).
