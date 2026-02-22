This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

This project uses **Jest** and **React Testing Library** for automated testing.

### Test Structure

Tests live in `__tests__/`, mirroring the source layout:

- `__tests__/lib/` — Unit tests for utility functions
- `__tests__/components/` — Component integration tests
- `__tests__/hooks/` — Custom hook tests

### Running Tests

```bash
# Smoke tests (fast, critical paths only — ~10s)
npm run test:smoke

# Full regression suite (all tests — ~30s)
npm run test:regression

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Smoke vs Regression

- **Smoke** (`test:smoke`): 8-12 fast tests covering core availability logic, tab navigation, data fetching, and page rendering. Run on every commit.
- **Regression** (`test:regression`): Full suite (~50+ tests) including all edge cases, loading states, boundary conditions, and component interactions. Run before merging PRs.

### Writing New Tests

- Use stable selectors: `getByRole`, `getByText`, `getByLabelText`
- Tag critical-path tests with `@smoke` in the `describe` block name
- Leaflet components are mocked via `__mocks__/react-leaflet.tsx`

### CI/CD

GitHub Actions (`.github/workflows/test.yml`) runs:
1. Smoke tests on every push/PR to main
2. Full regression + coverage if smoke passes
3. Build verification in parallel

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
