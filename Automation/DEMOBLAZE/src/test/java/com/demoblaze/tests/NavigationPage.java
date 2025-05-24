package com.demoblaze.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

public class NavigationPage {
    private WebDriver driver;
    WebDriverWait wait;

    private By categoryList = By.cssSelector(".list-group a");

    public NavigationPage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public List<String> getCategoryNames() {
        List<WebElement> categories = driver.findElements(categoryList);
        return categories.stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
    }

    public void clickCategory(String categoryName) {
        List<WebElement> categories = driver.findElements(categoryList);
        for (WebElement category : categories) {
            if (category.getText().equalsIgnoreCase(categoryName)) {
                category.click();
                break;
            }
        }
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void clickOnProductByName(String productName) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        boolean found = false;

        while (!found) {
            // Esperar a que los productos estén visibles
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("tbodyid")));

            // Obtener todos los productos actuales
            List<WebElement> productLinks = driver.findElements(By.xpath("//a[contains(@class,'hrefch')]"));

            for (WebElement link : productLinks) {
                String text = link.getText().trim();
                if (text.equalsIgnoreCase(productName.trim())) {
                    wait.until(ExpectedConditions.elementToBeClickable(link)).click();
                    found = true;
                    break;
                }
            }

            // Si no se encontró y hay botón "Next", navegar a la siguiente página
            if (!found) {
                List<WebElement> nextButtons = driver.findElements(By.id("next2"));
                if (!nextButtons.isEmpty() && nextButtons.get(0).isDisplayed()) {
                    WebElement nextButton = nextButtons.get(0);

                    // Guardar el primer producto antes de avanzar
                    String firstProductBefore = "";
                    if (!productLinks.isEmpty()) {
                        firstProductBefore = productLinks.get(0).getText().trim();
                    }

                    nextButton.click();

                    // Esperar a que el primer producto cambie (lo que indica que los productos se actualizaron)
                    if (!firstProductBefore.isEmpty()) {
                        wait.until(ExpectedConditions.not(ExpectedConditions.textToBePresentInElementLocated(
                                By.xpath("//a[contains(@class,'hrefch')]"), firstProductBefore
                        )));
                    } else {
                        // Si no había productos, simplemente esperar a que aparezca uno nuevo
                        wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(
                                By.xpath("//a[contains(@class,'hrefch')]"), 0
                        ));
                    }
                } else {
                    throw new NoSuchElementException("X Producto '" + productName + "' no encontrado en ninguna página.");
                }
            }
        }
    }


    public void goToCart(){
        WebElement cartLink = wait.until(ExpectedConditions.elementToBeClickable(By.id("cartur")));
        cartLink.click();
    }


}
