package com.demoblaze.tests;

import com.demoblaze.pages.LoginPage;
import com.demoblaze.tests.BaseTest;
import dataproviders.LoginDataProvider;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import io.qameta.allure.testng.AllureTestNg;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

import java.time.Duration;

@Epic("Demoblaze")
@Feature("Login")
@Story("User login")
@Severity(SeverityLevel.CRITICAL)
@Listeners(AllureTestNg.class)
public class LoginTests extends BaseTest{

    private static final Logger log = LoggerFactory.getLogger(LoginTests.class);

    @Test(dataProvider = "validCredentials", dataProviderClass = LoginDataProvider.class,
    description = "TC04 - Validate that login with correct credentials works.")
    public void testLoginWithValidCredentials(String username, String password){
        LoginPage loginPage = new LoginPage(driver);
        loginPage.openLoginForm();
        loginPage.enterCredentials(username, password);
        loginPage.submitLogin();

        new WebDriverWait(driver, Duration.ofSeconds(5))
                .until(ExpectedConditions.alertIsPresent());

        Alert alert = driver.switchTo().alert();
        String alertText = alert.getText();

        Assert.assertFalse(alertText.contains("Wrong"), "Expected login to be successful.");
    }

    @Test(dataProvider = "invalidCredentials", dataProviderClass = LoginDataProvider.class,
    description = "TC05 - Validate error message shown when login with incorrect credentials.")
    public void testLoginWithInvalidCredentials(String username, String password) throws InterruptedException {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.openLoginForm();
        loginPage.enterCredentials(username, password);
        loginPage.submitLogin();

        new WebDriverWait(driver, Duration.ofSeconds(5))
                .until(ExpectedConditions.alertIsPresent());

        Alert alert = driver.switchTo().alert();
        String alertText = alert.getText();
        alert.accept();

        Assert.assertTrue(alertText.contains("Wrong"), "Expected error alert for invalid login.");
    }

    @Test(description = "TC06 - Validate if the user is blocked after five failed login attempts.")
    public void testLoginBlockedAfterMultipleFailures(){
        LoginPage loginPage = new LoginPage(driver);
        loginPage.openLoginForm();

        for(int i=0; i<5; i++){
            loginPage.enterCredentials("gelemeco2910@gmail.com", "wrongPassword");
            loginPage.submitLogin();

            new WebDriverWait(driver, Duration.ofSeconds(5))
                    .until(ExpectedConditions.alertIsPresent());

            Alert alert = driver.switchTo().alert();
            alert.accept();
        }

        // Sixth attempt
        loginPage.enterCredentials("gelemeco2910@gmail.com", "wrongPassword");
        loginPage.submitLogin();

        new WebDriverWait(driver, Duration.ofSeconds(5))
                .until(ExpectedConditions.alertIsPresent());
        Alert alert = driver.switchTo().alert();
        String alertText = alert.getText();
        alert.accept();

        Assert.fail("X The system did not block the user after five failed login attempts.");
    }
}