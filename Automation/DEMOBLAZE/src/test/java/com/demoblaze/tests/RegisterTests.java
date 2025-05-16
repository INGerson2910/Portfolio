package com.demoblaze.tests;

import com.demoblaze.pages.RegisterPage;
import dataproviders.RegisterDataProvider;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import io.qameta.allure.testng.AllureTestNg;
import org.openqa.selenium.Alert;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;
import utils.FakerUtils;

import java.time.Duration;

@Epic("Demoblaze")
@Feature("Registration")
@Story("User registration")
@Severity(SeverityLevel.CRITICAL)
@Listeners(AllureTestNg.class)
public class RegisterTests extends BaseTest {
    @Test(dataProvider = "invalidRegistrationData", dataProviderClass = dataproviders.RegisterDataProvider.class, description = "TC01 - Verify required fields for user registration.")
    public void testRequiredFields(String username, String password){
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.openSignUpForm();
        registerPage.enterCredentials(username, password);
        registerPage.submitForm();
        Alert alert = driver.switchTo().alert();
        String alertText = alert.getText();
        alert.accept();

        Assert.assertTrue(alertText.contains("Please fill out Username and Password"), "Expected error message for empty fields.");
    }

    @Test(dataProvider = "validAndInvalidEmails", dataProviderClass = RegisterDataProvider.class,
            description = "CP02 - Verify that only valid emails are accepted.")
    public void testEmailFormat(String email, boolean expectedValid) {
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.openSignUpForm();
        registerPage.enterCredentials(email, "Password@123");
        registerPage.submitForm();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String alertText = alert.getText();
        alert.accept();

        boolean systemAccepted = alertText.contains("Sign up successful.");

        if (!expectedValid && systemAccepted) {
            Assert.fail("X The system accepted an invalid email: " + email);
        }

        if (expectedValid) {
            Assert.assertTrue(systemAccepted, "X The system rejected a valid email: " + email);
        }
    }

}