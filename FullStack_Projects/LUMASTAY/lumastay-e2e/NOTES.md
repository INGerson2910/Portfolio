# LumaStay E2E Decisions

## Projects and Execution

The `chromium` project runs browser tests and ignores `tests/api/**`. The `api` project matches only `tests/api/**/*.spec.ts`. Thus an API test belongs to one project and runs once; `fullyParallel` changes concurrency, not the number of projects. CI retries can still rerun failed tests.

The root `use.baseURL` is the frontend URL from `E2E_BASE_URL` (default `http://localhost:5173`). The API project overrides it with `API_BASE_URL` (default `http://localhost:4000`). Chromium inherits the root setting instead of repeating it. `/health` is registered at the backend root, before the `/api/v1` router, so its path is `/health`, not `/api/v1/health`. Destinations is under `/api/v1/destinations`.

The config does not start services. The HTML reporter uses `open: 'never'` so CI does not launch a browser; `npm run report` opens the saved report on demand. Environment variables are read directly from the process; dotenv loading is intentionally not configured here.

## Monorepo and P3 CI

The tests live beside the backend and frontend in the Portfolio monorepo so API, UI, and test changes can be reviewed together without coordinating a second checkout or repository version. In P3, set the E2E job's default `working-directory` to `FullStack_Projects/LUMASTAY/lumastay-e2e`. Path filters are relative to the Portfolio repository root and should include `FullStack_Projects/LUMASTAY/lumastay-e2e/**` plus backend contract dependencies such as `FullStack_Projects/LUMASTAY/lumastay-backend/src/**`, `FullStack_Projects/LUMASTAY/lumastay-backend/docker-compose.yml`, `FullStack_Projects/LUMASTAY/lumastay-backend/src/db/schema.sql`, and `FullStack_Projects/LUMASTAY/lumastay-backend/src/db/seed.js`.

The API workflow must start PostgreSQL using the Compose file in the sibling `lumastay-backend` directory, wait for readiness, apply schema and seed data, then start the backend before running `npm run test:api`. Browser tests additionally need the sibling Vite frontend. Use `npm ci` in the E2E working directory to install from the lockfile.

## Dependencies and Scripts

`@playwright/test` is declared as `^1.63.0` to allow compatible 1.x updates; the lockfile records the resolved version, and `npm ci` keeps CI installs reproducible. An exact pin would make dependency upgrades explicit in `package.json`; use it if the lab requires no compatible updates without a manifest change.

- `npm test` runs the Playwright suite.
- `npm run test:api` runs only the API project.
- `npm run report` serves the last HTML report.

## Assertion and Contract Decisions

- `expect(response.status()).toBe(200)` checks the exact contract status. `toBeOK()` accepts any 2xx response, so it is weaker here; using both is redundant.
- Health uses `toEqual` for the complete documented body: `{ status: 'ok', service: 'lumastay-backend' }`. The implementation and OpenAPI contract do not define `uptime`; do not assert it unless the API contract is intentionally extended.
- Destination rows validate non-empty `city` and `country`, integer `hotelCount >= 1`, and uniqueness of the city-country pair. A city alone is not a unique key because the same city name may exist in different countries.
- The ordering check compares the returned city sequence with a sorted copy using `localeCompare(..., 'es')`. PostgreSQL `ORDER BY city ASC` follows database collation, which can differ across operating systems or database images; keep CI's database environment consistent and revisit the comparison if locale-sensitive data changes.
- TC-API-010 requires at least two destinations. A one-element list equals its sorted copy regardless of ordering, so it cannot exercise the ordering contract.
- Fixed case IDs use declarative `test(title, { annotation: { type: 'test-case-id', description: 'TC-API-...' } }, fn)` metadata. Playwright collects this annotation before execution, so it remains available if a test is skipped or fails before its body runs.

## Failure Probes

Temporary probes were reverted after checking diagnostics: a wrong health service value showed the exact expected/received JSON difference; expecting zero destinations reported `Expected: 0, Received: 26`; reversing TC-API-010's sort showed both received and expected city sequences.

## Schema Setup in Bash

From `lumastay-backend`, apply the schema with:

```bash
cat src/db/schema.sql | docker exec -i lumastay-postgres psql -U postgres -d lumastay
```

Then run `npm run seed` and start the backend. The schema drops and recreates tables, so do not apply it to a database whose data must be preserved.