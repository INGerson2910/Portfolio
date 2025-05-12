package com.demoblaze.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RegisterPage {
    private WebDriver driver;

    private By signupButton = By.id("signin2");
    private By usernameInput = By.id("sign-username");
    private By passwordInput = By.id("sign-password");
    private By signupConfirm = By.xpath("//button[text()='Sign up']");

    public RegisterPage(WebDriver driver) {
        this.driver = driver;
    }

    public void openSignupForm() {
        driver.findElement(signupButton).click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
        }
    }

    public void enterCredentials(String username, String password) {
        driver.findElement(usernameInput).sendKeys(username);
        driver.findElement(passwordInput).sendKeys(password);
    }

    public void submitForm() {
        driver.findElement(signupConfirm).click();
    }
}
