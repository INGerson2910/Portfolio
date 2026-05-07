package com.lumastay.automation.listeners;

import com.lumastay.automation.config.DriverFactory;
import com.lumastay.automation.utils.ScreenshotUtils;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class TestListener implements ITestListener {

    private static final Logger log = LoggerFactory.getLogger(TestListener.class);

    @Override
    public void onTestStart(ITestResult result) {
        log.info("▶ START  [{}.{}]",
                result.getTestClass().getName(),
                result.getMethod().getMethodName());
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        log.info("✔ PASS   [{}.{}]",
                result.getTestClass().getName(),
                result.getMethod().getMethodName());
    }

    @Override
    public void onTestFailure(ITestResult result) {
        log.error("✖ FAIL   [{}.{}] — {}",
                result.getTestClass().getName(),
                result.getMethod().getMethodName(),
                result.getThrowable().getMessage());

        // Attach screenshot to Allure so reviewers see exactly what failed
        WebDriver driver = DriverFactory.getDriver();
        if (driver != null) {
            ScreenshotUtils.attachToAllure(driver,
                    "FAIL_" + result.getMethod().getMethodName());
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        log.warn("⚠ SKIP   [{}.{}]",
                result.getTestClass().getName(),
                result.getMethod().getMethodName());
    }

    @Override
    public void onFinish(ITestContext context) {
        log.info("Suite '{}' finished — passed: {}, failed: {}, skipped: {}",
                context.getName(),
                context.getPassedTests().size(),
                context.getFailedTests().size(),
                context.getSkippedTests().size());
    }
}
