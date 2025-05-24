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
            // Wait until product added is present in the cart
            return wait.until(driver -> {
                List<WebElement> productos = driver.findElements(By.cssSelector("#tbodyid .success td:nth-child(2)"));
                return productos.stream()
                        .anyMatch(e -> e.getText().trim().equalsIgnoreCase(productName));
            });
        } catch (TimeoutException e) {
            return false; // Product was not found in time
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
        List<WebElement> rows = driver.findElements(By.cssSelector("tr.success"));
        for(WebElement row : rows){
            String name = row.findElement(By.cssSelector("td:nth-child(4) a")).getText();
            if(name.equalsIgnoreCase(productName)){
                row.findElement(By.cssSelector("td:nth-child(4) a")).click();
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

    public void waitForProductInCart(String productName){
        new WebDriverWait(driver, Duration.ofSeconds(5)).until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//td[text()='" + productName + "']")));
    }

    public void deleteProductByName(String productName){
        WebElement deleteLink = driver.findElement(By.xpath("//tr[td[contains(text(), 'Nexus 6')]]//a[text()='Delete']"));
        deleteLink.click();
    }

    public void waitForProductToBeRemoved(String productName){
        new WebDriverWait(driver, Duration.ofSeconds(5)).until(ExpectedConditions.invisibilityOfElementLocated(By.xpath("//td[text()='" + productName + "']")));
    }

    public boolean isProductAbsent(String productName){
        return driver.findElements(By.xpath("//td[text()='" + productName + "']")).isEmpty();
    }

    public int getCartTotal() {
        String totalText = driver.findElement(By.id("totalp")).getText().trim();

        // If empty, assume 0
        if (totalText.isEmpty()) {
            return 0;
        }

        return Integer.parseInt(totalText);
    }


}
