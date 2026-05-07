package com.lumastay.automation.tests;

import com.lumastay.automation.pages.LoginPage;
import com.lumastay.automation.tests.providers.TestDataProvider;
import io.qameta.allure.*;
import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("Authentication")
@Feature("Login")
public class LoginTest extends BaseTest {

    @Test(groups = {"smoke"})
    @Story("Valid login")
    @Description("Verify that a user can log in with valid demo credentials")
    @Severity(SeverityLevel.BLOCKER)
    public void testLoginWithValidCredentials() {
        LoginPage loginPage = new LoginPage(driver);

        Assert.assertTrue(loginPage.isDisplayed(),
                "Login page should be visible when the app loads");

        loginPage.login(config.getUsername(), config.getPassword());

        Assert.assertTrue(loginPage.isLoggedIn(),
                "Logout button should appear after successful login");
    }

    @Test(groups = {"smoke"})
    @Story("Logout")
    @Description("Verify that a logged-in user can log out and return to the login screen")
    @Severity(SeverityLevel.CRITICAL)
    public void testLogout() {
        performLogin();

        driver.findElement(By.cssSelector("[data-testid='logout_button']")).click();

        Assert.assertTrue(new LoginPage(driver).isDisplayed(),
                "Login page should be shown after logout");
    }

    @Test(dataProvider = "invalidLogins", dataProviderClass = TestDataProvider.class,
          groups = {"regression"})
    @Story("Invalid credentials")
    @Description("Verify that invalid credentials show an error and do not log the user in")
    @Severity(SeverityLevel.CRITICAL)
    public void testLoginWithInvalidCredentials(String email, String password, String expectedError) {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login(email, password);

        Assert.assertTrue(loginPage.isErrorDisplayed(),
                "Error message should be displayed for: email='" + email + "'");
        Assert.assertFalse(loginPage.isLoggedIn(),
                "User must NOT be logged in with invalid credentials");
    }

    @Test(groups = {"regression"})
    @Story("Empty form submission")
    @Description("Verify that clicking Login without entering any data shows a validation error")
    @Severity(SeverityLevel.NORMAL)
    public void testLoginWithEmptyFields() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.clickLogin();

        Assert.assertFalse(loginPage.isLoggedIn(),
                "Empty form should not authenticate the user");
    }

    @Test(groups = {"regression"})
    @Story("Navigation to Register screen")
    @Description("Verify that clicking Go to Register navigates to the registration form")
    @Severity(SeverityLevel.MINOR)
    public void testNavigateToRegister() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.clickGoToRegister();

        Assert.assertTrue(loginPage.isRegisterFormDisplayed(),
                "Register form should be visible after clicking Go to Register");
    }
}
