package com.lumastay.automation.tests;

import com.lumastay.automation.config.ConfigManager;
import com.lumastay.automation.config.DriverFactory;
import com.lumastay.automation.listeners.TestListener;
import com.lumastay.automation.pages.LoginPage;
import com.lumastay.automation.pages.SearchPage;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Listeners;

@Listeners(TestListener.class)
public abstract class BaseTest {

    protected WebDriver    driver;
    protected ConfigManager config;

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        config = ConfigManager.get();
        driver = DriverFactory.createDriver();
        driver.get(config.getBaseUrl());
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        DriverFactory.quitDriver();
    }

    /** Logs in with the default demo credentials from config.properties. */
    protected SearchPage performLogin() {
        return performLogin(config.getUsername(), config.getPassword());
    }

    /** Logs in with explicit credentials and waits for the search page to be ready. */
    protected SearchPage performLogin(String email, String password) {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login(email, password);
        return new SearchPage(driver).waitForPage();
    }
}
