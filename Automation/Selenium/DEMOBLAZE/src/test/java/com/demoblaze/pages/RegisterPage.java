package com.demoblaze.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RegisterPage {

    private WebDriver driver;

    private By signUpModalButton = By.id("signin2");
    private By usernameField = By.id("sign-username");
    private By passwordField = By.id("sign-password");
    private By signUpSubmitButton = By.xpath("//button[text()='Sign up']");

    public RegisterPage(WebDriver driver) {
        this.driver = driver;
    }

    public void openSignUpForm() {
        driver.findElement(signUpModalButton).click();
        try {
            Thread.sleep(1000); // wait for modal to load
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public void enterCredentials(String username, String password) {
        driver.findElement(usernameField).sendKeys(username);
        driver.findElement(passwordField).sendKeys(password);
    }

    public void submitForm() {
        driver.findElement(signUpSubmitButton).click();
    }
}
