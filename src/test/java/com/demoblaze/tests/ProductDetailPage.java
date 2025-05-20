package com.demoblaze.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class ProductDetailPage {
    WebDriver driver;

    public ProductDetailPage(WebDriver driver){
        this.driver = driver;
    }

    public String getProductName(){
        return driver.findElement(By.className("name")).getText();
    }

    public String getProductDescription(){
        return driver.findElement(By.className("description")).getText();
    }

    public String getProductPrice(){
        return driver.findElement(By.className("price-container")).getText();
    }

    public boolean isImageDisplayed() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            return wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div#imgp img"))).isDisplayed();
        } catch (TimeoutException e) {
            System.out.println("X Imagen no visible a tiempo.");
            return false;
        }
    }

    public boolean isAddToCartButtonVisible(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement button = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("a.btn.btn-success.btn-lg")));
        return button.isDisplayed();
    }

    public void clickAddToCart(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("a.btn.btn-success.btn-lg")));
        btn.click();

        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
    }


}
