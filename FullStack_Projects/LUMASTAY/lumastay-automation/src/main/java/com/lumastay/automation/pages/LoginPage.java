package com.lumastay.automation.pages;

import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    private final By emailInput    = testId("login_email_input");
    private final By passwordInput = testId("login_password_input");
    private final By loginButton   = testId("login_button");
    private final By goToRegister  = testId("go_to_register_button");
    private final By errorMessage  = By.cssSelector(".error-message");
    private final By logoutButton  = testId("logout_button");
    private final By registerButton = testId("register_button");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    @Step("Verify login page is displayed")
    public boolean isDisplayed() {
        return isDisplayed(loginButton);
    }

    @Step("Enter email: {email}")
    public LoginPage enterEmail(String email) {
        type(emailInput, email);
        return this;
    }

    @Step("Enter password")
    public LoginPage enterPassword(String password) {
        type(passwordInput, password);
        return this;
    }

    @Step("Click login button")
    public void clickLogin() {
        click(loginButton);
    }

    @Step("Login with email: {email}")
    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickLogin();
    }

    @Step("Get error message text")
    public String getErrorMessage() {
        waitForVisible(errorMessage);
        return getText(errorMessage);
    }

    public boolean isErrorDisplayed() {
        return isDisplayed(errorMessage);
    }

    public boolean isLoggedIn() {
        return isDisplayed(logoutButton);
    }

    public boolean isRegisterFormDisplayed() {
        return isDisplayed(registerButton);
    }

    @Step("Click Go to Register link")
    public void clickGoToRegister() {
        click(goToRegister);
    }
}
