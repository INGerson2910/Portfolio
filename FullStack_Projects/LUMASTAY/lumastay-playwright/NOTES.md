## About playwright.config.ts

### 1. What does testDir do?
Tells where the tests live ('./tests')

### 2. What are the projects and why did the generator created three?
It must be one project for every browser, in this case, chromium for Chromre, firefox for Firefox and webkit for Safari.

### 3. What does "retries: process.env.CI ? 2 : 0" mean? Why is it different in CI from local?
process.env.CI checks whether the CI environment variable is set. If it is set (true), Playwright uses "retries: 2". On CI, test runs are often less stable due to container timing, network flakiness, or shared resources. Allowing 2 retries helps reduce false failures from transient issues. Locally, you usually want immediate feedback and no hidden retries, so it says at 0.

### 4. What does "trace: 'on-first-retry'" and how is it different from "'retain-on-failure'"?
"trace: 'on-first-retry'" means Playwright only records a trace when a test fails and is retried for the first time. It avoids tracing every run, so normal passing tests do not generate trace files. "'retain-on-failure'" records traces for any test that fails, even on its first attempt, and keeps those traces for debugging. "'on-first-retry'" only starts tracing if the test actually gets retried, so it is more coservative and saves disk/time when failures are rare. So on-first-retry is best when you want trace data only for flaky/retried failures, while retain-on-failure is best when you want traces for every failure immediately.


### Why toBeGreaterThan(0) and not toHaveLength(N)?
Because what we want is that the list is not empty. If what we wanted to validate was exactly 3 destinations, then we could use `expect(body.length).toBe(3);`. And if we wanted to validate 3 or more, we could use `expect(body.length).toBeGreaterThanOrEqual(3);`.