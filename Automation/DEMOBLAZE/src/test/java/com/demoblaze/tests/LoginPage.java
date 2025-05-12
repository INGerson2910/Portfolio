package com.demoblaze.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {
    private WebDriver driver;

    private By loginButton = By.id("login2");
    private By usernameInput = By.id("loginusername");
    private By passwordInput = By.id("loginpassword");
    private By confirmLoginButton = By.xpath("//button[text()='Log in']");
    private By welcomeUser = By.id("nameofuser");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public void openLoginForm() {
        driver.findElement(loginButton).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(ExpectedConditions.visibilityOfElementLocated(usernameInput));

    }

    public void login(String username, String password) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(ExpectedConditions.elementToBeClickable(usernameInput));

        driver.findElement(usernameInput).clear();
        driver.findElement(usernameInput).sendKeys(username);

        wait.until(ExpectedConditions.elementToBeClickable(passwordInput));
        driver.findElement(passwordInput).clear();
        driver.findElement(passwordInput).sendKeys(password);

        wait.until(ExpectedConditions.elementToBeClickable(confirmLoginButton));
        driver.findElement(confirmLoginButton).click();

    }

    public boolean isLoginSuccessful() {
        try {
            Thread.sleep(3000);
            return driver.findElement(welcomeUser).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
