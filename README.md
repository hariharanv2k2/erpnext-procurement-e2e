# ERPNext Procurement E2E Test Suite

End-to-end test automation for the **ERPNext Buying module**, covering the complete procure-to-pay cycle using Playwright and TypeScript.

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Copy env and configure
cp .env.example .env
# Edit .env with your ERPNext credentials

# Run all tests
npm test
```

## Test Coverage

**45 tests** across **9 modules** covering the full procurement workflow:

| Module | Tests | Description |
|--------|-------|-------------|
| Supplier | 5 | Create, list, open, edit, validation |
| Item | 4 | Create, list, open, validation |
| Material Request | 5 | Create, submit, list, cancel, validation |
| Request for Quotation | 4 | Create with suppliers, submit, list, validation |
| Supplier Quotation | 4 | Create, submit, list, validation |
| Purchase Order | 7 | Create, submit, grand total, list, cancel, amend, validation |
| Purchase Receipt | 7 | Create, submit, PO-to-PR flow, % received, list, cancel, validation |
| Purchase Invoice | 7 | Create, submit, grand total, PO-to-PI flow, list, cancel, validation |
| Procure-to-Pay E2E | 1 | Full cycle: Supplier → Item → MR → RFQ → SQ → PO → PR → PI |

## Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:debug` | Run in debug mode |
| `npm run test:master-data` | Run Supplier + Item tests |
| `npm run test:transactions` | Run all transaction tests |
| `npm run test:e2e` | Run full procure-to-pay flow |
| `npm run test:supplier` | Run Supplier tests only |
| `npm run test:item` | Run Item tests only |
| `npm run test:po` | Run Purchase Order tests only |
| `npm run report` | Open HTML test report |

## Project Structure

```
erpnext-procurement-e2e/
├── src/
│   ├── config/            # Environment configuration
│   ├── data/
│   │   ├── factories/     # Test data factories (Faker.js)
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Date utilities
│   ├── fixtures/          # Playwright fixtures & auth setup
│   ├── pages/
│   │   ├── base.page.ts   # Base classes (ErpFormPage, ErpListPage)
│   │   └── *.page.ts      # Page objects for each doctype
│   └── selectors/         # Centralized DOM selectors
├── tests/
│   ├── master-data/       # Supplier, Item specs
│   ├── transactions/      # MR, RFQ, SQ, PO, PR, PI specs
│   └── e2e/               # Full procure-to-pay flow
├── playwright.config.ts
└── .env.example
```

## Architecture

- **Page Object Model** — Base classes (`ErpFormPage`, `ErpListPage`) handle common Frappe form operations (save, submit, cancel, amend)
- **Centralized Selectors** — All DOM selectors in `src/selectors/` — no hardcoded selectors in pages or tests
- **Data Factories** — Faker.js generates unique test data for each run
- **Auth via storageState** — Login once, reuse session across all tests
- **Sequential Execution** — Single worker, ordered tests (shared ERPNext database)
- **Chromium Only** — Optimized for ERPNext's Frappe UI

## Prerequisites

- Node.js (LTS)
- ERPNext instance running (local or remote)
- Administrator access to ERPNext

## Environment Setup

Copy `.env.example` to `.env` and update:

```env
BASE_URL=http://127.0.0.1:8006
ERP_USERNAME=Administrator
ERP_PASSWORD=your_password_here
COMPANY_NAME=Your Company
COMPANY_ABBR=YC
DEFAULT_CURRENCY=INR
DEFAULT_WAREHOUSE=Stores - YC
```

## CI/CD

GitHub Actions workflow runs on push to `main` and on pull requests. See `.github/workflows/` for configuration.

## Tech Stack

- [Playwright](https://playwright.dev/) — Browser automation
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Faker.js](https://fakerjs.dev/) — Test data generation
- [dotenv](https://github.com/motdotla/dotenv) — Environment configuration
