# E2E Testing with Playwright

This directory contains end-to-end tests for the IPAM Frontend application using Playwright.

## Structure

```
tests/e2e/
├── fixtures/          # Test fixtures and setup
│   └── auth.ts       # Authentication fixture
├── pages/            # Page Object Models
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── RegionsPage.ts
│   ├── RegionFormPage.ts
│   ├── HostsPage.ts
│   └── index.ts
├── utils/            # Helper utilities
│   └── helpers.ts
└── tests/            # Test files
    ├── auth.spec.ts
    ├── regions.spec.ts
    ├── hosts.spec.ts
    └── search.spec.ts
```

## Running Tests

### Run all tests
```bash
bun run test:e2e
```

### Run tests in UI mode (interactive)
```bash
bun run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
bun run test:e2e:headed
```

### Debug tests
```bash
bun run test:e2e:debug
```

### View test report
```bash
bun run test:e2e:report
```

### Run specific test file
```bash
bunx playwright test tests/e2e/auth.spec.ts
```

### Run tests in specific browser
```bash
bunx playwright test --project=chromium
bunx playwright test --project=firefox
bunx playwright test --project=webkit
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    // ... test steps
  });
});
```

### Using Authenticated Fixture

```typescript
import { test, expect } from '../fixtures/auth';

test.describe('Protected Feature', () => {
  test('should access protected page', async ({ authenticatedPage }) => {
    // authenticatedPage is already logged in
    await authenticatedPage.goto('/dashboard/regions');
    // ... test steps
  });
});
```

### Page Object Model Pattern

```typescript
import { RegionsPage } from '../pages';

test('should create region', async ({ authenticatedPage }) => {
  const regionsPage = new RegionsPage(authenticatedPage);
  await regionsPage.goto();
  await regionsPage.clickCreate();
  // ... continue with form
});
```

## Best Practices

1. **Use Page Object Models**: Encapsulate page interactions in POM classes
2. **Use data-testid attributes**: For stable selectors
3. **Wait for elements**: Use `waitFor` methods instead of arbitrary timeouts
4. **Clean up**: Reset state between tests
5. **Mock API when needed**: Use route mocking for edge cases
6. **Take screenshots**: On failures for debugging
7. **Use fixtures**: For common setup like authentication

## Configuration

The Playwright configuration is in `playwright.config.ts` at the project root.

Key settings:
- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 on CI, 0 locally
- **Parallel**: Yes (except on CI)
- **Web Server**: Automatically starts dev server before tests

## CI/CD Integration

Tests run automatically on CI with:
- Retry on failure (2 retries)
- GitHub Actions reporter
- Trace collection on first retry
- Screenshots and videos on failure

## Debugging

### Visual Debugging
```bash
bun run test:e2e:debug
```

### Trace Viewer
After a test run with failures:
```bash
bunx playwright show-trace trace.zip
```

### Codegen (Generate tests)
```bash
bunx playwright codegen http://localhost:3000
```

## Environment Variables

- `PLAYWRIGHT_BASE_URL`: Base URL for tests (default: `http://localhost:3000`)
- `CI`: Set to `true` on CI environments

## Test Data

Test users and data are defined in `fixtures/auth.ts`. Update these as needed for your test environment.
