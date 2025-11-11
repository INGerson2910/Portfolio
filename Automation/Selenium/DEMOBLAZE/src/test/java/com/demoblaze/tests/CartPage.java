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

    public boolean isProductInCart(String productName) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            // Esperar hasta que el producto esté presente en el carrito
            return wait.until(driver -> {
                List<WebElement> productos = driver.findElements(By.cssSelector("#tbodyid .success td:nth-child(2)"));
                return productos.stream()
                        .anyMatch(e -> e.getText().trim().equalsIgnoreCase(productName));
            });
        } catch (TimeoutException e) {
            return false; // No se encontró el producto a tiempo
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

    public boolean validateProductDetails(String productName, String price, int expectedQuantity){
        List<WebElement> rows = driver.findElements(By.cssSelector("#tbodyid > tr"));
        int counter = 0;

        for(WebElement row : rows){
            String productText = row.findElement(By.xpath("./td[2]")).getText().trim();
            String priceText = row.findElement(By.xpath("./td[3]")).getText().trim();

            if(productText.equals(productName) && priceText.equals(price)){
                counter ++;
            }
        }
        return counter == expectedQuantity;
    }

}
