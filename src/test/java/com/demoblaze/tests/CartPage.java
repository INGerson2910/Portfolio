package com.demoblaze.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class CartPage {
    private WebDriver driver;

    public CartPage(WebDriver driver){
        this.driver = driver;
    }

    public boolean isProductInCart(String productName){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        try{
            WebElement table = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("tbodyid")));

            List<WebElement> rows = table.findElements(By.tagName("tr"));
            for(WebElement row : rows){
                if(row.getText().contains(productName)){
                    return true;
                }
            }
            return false;
        }
        catch(TimeoutException e){
            return false;
        }
    }

    public String getPriceOfProduct(String productName){
        List<WebElement> filas = driver.findElements(By.cssSelector("tr.success"));
        for(WebElement fila : filas){
            String nombre = fila.findElement(By.cssSelector("td:nth-child(2)")).getText();
            if(nombre.equalsIgnoreCase(productName)){
                return fila.findElement(By.cssSelector("td:nth-child(3)")).getText();
            }
        }
        return null;
    }

    public void removeProduct(String productName){
        List<WebElement> filas = driver.findElements(By.cssSelector("tr.success"));
        for(WebElement fila : filas){
            String nombre = fila.findElement(By.cssSelector("td:nth-child(4) a")).getText();
            if(nombre.equalsIgnoreCase(productName)){
                fila.findElement(By.cssSelector("td:nth-child(4) a")).click();
                break;
            }
        }
    }

    public boolean isCartEmpty(){
        return driver.findElements(By.cssSelector("tr.success")).isEmpty();
    }
}
