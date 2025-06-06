package com.demoblaze.tests;

import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import io.qameta.allure.testng.AllureTestNg;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Epic("Demoblaze")
@Feature("Browsing")
@Story("Product browsing")
@Severity(SeverityLevel.CRITICAL)
@Listeners({AllureTestNg.class})
public class NavigationTests extends BaseTest {
    @Test(description = "CP07 - Validate that the categories 'Laptops', 'Phones' and 'Monitors' are shown in the site.")
    public void testVisibleCategories() {
        NavigationPage navigationPage = new NavigationPage(driver);

        List<String> categorias = navigationPage.getCategoryNames();

        Assert.assertTrue(categorias.contains("Laptops"), "X La categoría 'Laptops' no está visible.");
        Assert.assertTrue(categorias.contains("Phones"), "X La categoría 'Phones' no está visible.");
        Assert.assertTrue(categorias.contains("Monitors"), "X La categoría 'Monitors' no está visible.");
    }

    @Test(description = "TC08 - Validate that only products from the selected category are shown.")
    public void testOnlyProductsFromCategory() {
        NavigationPage navigationPage = new NavigationPage(driver);
        navigationPage.clickCategory("Phones");

        List<WebElement> products = driver.findElements(By.cssSelector(".card-title"));
        List<String> productNames = products.stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());

        Assert.assertFalse(productNames.isEmpty(), "X No products shown after selecting 'Phones' category...");

        String[] keyWordsPhones = {
                "samsung", "iphone", "nokia", "sony", "htc", "phone", "xperia", "lg", "lumia", "motorola", "nexus"
        };

        for (String productName : productNames) {
            boolean belongsToCategory = false;
            for (String word : keyWordsPhones) {
                if (productName.toLowerCase().contains(word)) {
                    belongsToCategory = true;
                    break;
                }
            }
            Assert.assertTrue(belongsToCategory,
                    "X Invalid product in 'Phones': '" + productName + "'");
        }
    }


    @Test(description = "TC09 - Verify that each product detail shows image, name and price.")
    public void testVisibleInfoByProduct() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#tbodyid .col-lg-4.col-md-6.mb-4"))
        );

        List<WebElement> products = driver.findElements(By.cssSelector("#tbodyid .col-lg-4.col-md-6.mb-4"));

        Assert.assertFalse(products.isEmpty(), "X No products found in the home page.");

        for (WebElement product : products) {
            WebElement image = product.findElement(By.cssSelector("img.card-img-top.img-fluid"));
            WebElement name = product.findElement(By.cssSelector(".card-title a"));
            WebElement price = product.findElement(By.tagName("h5"));

            Assert.assertTrue(image.isDisplayed(), "X Product image is not visible.");
            Assert.assertFalse(name.getText().trim().isEmpty(), "X Product name is empty.");
            Assert.assertFalse(price.getText().trim().isEmpty(), "X Product price is empty.");
        }
    }

    @Test(description = "TC10 - Validate that no products are shown from empty categories.")
    public void testEmptyCategory(){
        NavigationPage navigationPage = new NavigationPage(driver);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("tbodyid")));

        List<WebElement> products = driver.findElements(By.cssSelector("#tbodyid .card-block"));

        boolean existentProducts = !products.isEmpty();

        if(existentProducts){
            System.out.println("This environment does not have any real empty category.");
            Assert.fail("0 products expected, but some were found.");
        }
        else{
            System.out.println("No products found, expected behavior.");
            Assert.assertTrue(true);
        }
    }

    @Test(description = "TC11 - Validate dynamic browsing between categories and reloading is not needed.")
    public void testDynamicBrowsingBetweenCategories(){
        NavigationPage navigationPage = new NavigationPage(driver);

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("tbodyid")));

        String sessionBefore = driver.manage().getCookieNamed("connect.sid") != null
                ? driver.manage().getCookieNamed("connect.sid").getValue()
                : driver.getWindowHandle();

        navigationPage.clickCategory("Laptops");;
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("tbodyid")));
        navigationPage.clickCategory("Monitors");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("tbodyid")));

        String sessionAfter = driver.manage().getCookieNamed("connect.sid") != null
                ? driver.manage().getCookieNamed("connect.sid").getValue()
                : driver.getWindowHandle();

        Assert.assertEquals(sessionBefore, sessionAfter, "X Page was reloaded when changing category.");
    }
}
