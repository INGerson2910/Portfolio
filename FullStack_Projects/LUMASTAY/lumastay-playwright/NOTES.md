## About playwright.config.ts

### 1. What does testDir do?
Tells where the tests live ('./tests')

### 2. What are the projects and why did the generator created three?
It must be one project for every browser, in this case, chromium for Chromre, firefox for Firefox and webkit for Safari.

### 3. What does "retries: process.env.CI ? 2 : 0" mean? Why is it different in CI from local?
process.env.CI checks whether the CI environment variable is set. If it is set (true), Playwright uses "retries: 2". On CI, test runs are often less stable due to container timing, network flakiness, or shared resources. Allowing 2 retries helps reduce false failures from transient issues. Locally, you usually want immediate feedback and no hidden retries, so it says at 0.

### 4. What does "trace: 'on-first-retry'" and how is it different from "'retain-on-failure'"?
`trace: 'on-first-retry'` means Playwright only records a trace when a test fails and is retried for the first time. It avoids tracing every run, so normal passing tests do not generate trace files. "'retain-on-failure'" records traces for any test that fails, even on its first attempt, and keeps those traces for debugging. "'on-first-retry'" only starts tracing if the test actually gets retried, so it is more coservative and saves disk/time when failures are rare. So on-first-retry is best when you want trace data only for flaky/retried failures, while retain-on-failure is best when you want traces for every failure immediately.


### Why toBeGreaterThan(0) and not toHaveLength(N)?
Because what we want is that the list is not empty. If what we wanted to validate was exactly 3 destinations, then we could use `expect(body.length).toBe(3);`. And if we wanted to validate 3 or more, we could use `expect(body.length).toBeGreaterThanOrEqual(3);`.

### What is a fixture?
A fixture is a system created and injected by Playwright that gives all the necessary elements (opening a browser, login, etc.) to enable a test to begin. Also a fixture cleans after the test run. The pattern is to prepare -> use(resource) -> clean. Everything after use() is always executed, even if the test fails. Playwright builds a fixture only if the test declares it into its parameters. If the test does not ask for request, fixture is not created never.

### Why fixture and not beforeEach?
Because beforeEach pays the cost of preparing in all tests of the block, whether needed or not. Fixture only in where is requested.

### Why must everything have await? What do we receive if we quit it from response.json()?
Without await, what we receive is a Promise. Given that the operation is asynchronous with or without await, await does two things: to pause the execution of the function until promise is resolved, and gets the value.

### Difference between response.status() and response.ok()?
Given that status() gives us the code and value of the response, and ok() is a boolean that only says if the response is in the range 200-299, it is recommended that in negative cases to use status(), so that we have the context of what and how failed.

### Why the browser is not opened, and then why did it run three times?
Firstly, we used request, not page, so that there is no browser. The cause why it ran three times is into playwright.config.ts, where `projects` object has three instances of browsers (in this case, chromium (Chrome), firefox (Firefox) and webkit (Safari)), so that Playwright executes all the tests in all projects. Our test does not touch the browser, then the three executions are identical byte to byte. It is paying three times the time for no additional coverage. If multiplied per 32 API tests, it will be pipeline minutes wasted in every push.