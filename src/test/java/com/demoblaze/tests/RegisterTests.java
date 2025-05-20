package com.demoblaze.tests;

import com.demoblaze.pages.RegisterPage;
import dataproviders.PasswordDataProvider;
import dataproviders.RegisterDataProvider;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import io.qameta.allure.testng.AllureTestNg;
import org.apache.commons.math3.analysis.function.Exp;
import org.openqa.selenium.Alert;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
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
    @Test(dataProvider = "invalidRegistrationData", dataProviderClass = dataproviders.RegisterDataProvider.class,
            description = "TC01 - Verify required fields for user registration.")
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
            description = "TC02 - Verify that only valid emails are accepted.")
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

        if ((!expectedValid && systemAccepted) || email.isEmpty()) {
            Assert.fail("X The system accepted an invalid email: " + email);
        }

        if (expectedValid) {
            Assert.assertTrue(systemAccepted, "X The system rejected a valid email: " + email);
        }
    }

    @Test(dataProvider = "weakAndStrongPasswords", dataProviderClass = PasswordDataProvider.class,
            description = "TC03 - Validate if password meet complexity rules.")
    public void testPasswordComplexity(String password, boolean expectedValid){
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.openSignUpForm();

        String email = FakerUtils.generateValidEmail();
        registerPage.enterCredentials(email, password);
        registerPage.submitForm();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(ExpectedConditions.alertIsPresent());

        Alert alert = driver.switchTo().alert();
        String alertText = alert.getText();

        if(!expectedValid){
            Assert.assertFalse(alertText.contains("Sign up successful"), "X The system incorrectly accepted a weak password: " + password);
        }
        else{
            Assert.assertTrue(alertText.contains("Sign up successful"), "X The system rejected a valid password: " + password);
        }
    }

}