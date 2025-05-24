package com.demoblaze.tests;

import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import io.qameta.allure.testng.AllureTestNg;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

import java.time.Duration;

@Epic("Demoblaze")
@Feature("Cart")
@Story("Cart management")
@Severity(SeverityLevel.CRITICAL)
@Listeners({AllureTestNg.class})
public class CartTests extends BaseTest{
    @Test(description = "TC14 - Verify that a product is added to the cart when clicking 'Add to cart' button.")
    public void testAddProductToCart(){
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        CartPage cartPage = new CartPage(driver);

        navigationPage.clickOnProductByName("Sony vaio i7");
        productDetailPage.clickAddToCart();
        navigationPage.goToCart();
        cartPage.isProductInCart("Sony vaio i7");
    }

    @Test(description = "TC15 - Validate a clear option to back home page from the detail page.")
    public void testBackToListFromDetail(){
        NavigationPage navigationPage = new NavigationPage(driver);

        // Step 1: Go to a product detail view
        navigationPage.clickOnProductByName("Samsung galaxy s6");

        // Step 2: Click on the store logo
        WebElement linkToHome = wait.until(ExpectedConditions.elementToBeClickable(By.id("nava")));
        linkToHome.click();

        // Step 3: Validate that we are back to the product list
        WebElement listaProductos = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("tbodyid")));
        Assert.assertTrue(listaProductos.isDisplayed(), "X No return to the product list.");
    }

    @Test(description = "TC16 - Verify that a product can be added to the cart from its detail page.")
    public void testAddFromDetail(){
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        CartPage cartPage = new CartPage(driver);

        // Go to the product
        navigationPage.clickOnProductByName("Sony vaio i7");

        // Click 'Add to cart'
        productDetailPage.clickAddToCart();

        // Go to the cart and validate if the product added is present
        navigationPage.goToCart();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        Assert.assertTrue(cartPage.isProductInCart("Sony vaio i7"), "Product is not in the cart.");
    }

    @Test(description = "TC17 - Validate that product details are shown in the cart.")
    public void testValidateQuantityInCart() {
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        CartPage cartPage = new CartPage(driver);

        String product = "Nexus 6";
        String price = "650";

        // Add the same product twice
        navigationPage.clickOnProductByName(product);
        productDetailPage.clickAddToCart();

        WebElement linkToHome = wait.until(ExpectedConditions.elementToBeClickable(By.id("nava")));
        linkToHome.click();

        navigationPage.clickOnProductByName(product);
        productDetailPage.clickAddToCart();

        navigationPage.goToCart();

        // Validate that 2 quantity is shown for the product (this should fail if no 'Quantity' column exists)
        Assert.assertTrue(cartPage.validateProductDetails(product, price, 2),
                "X Correct quantity (2) is not shown for the product added twice.");
    }

    @Test(description = "TC18 - Validate product deletion from the cart.")
    public void testRemoveProductFromCart(){
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        CartPage cartPage = new CartPage(driver);

        // Add product to the cart
        navigationPage.clickOnProductByName("Nexus 6");
        productDetailPage.clickAddToCart();

        // Go to the cart
        navigationPage.goToCart();

        // Wait the product to appear in the cart
        cartPage.waitForProductInCart("Nexus 6");

        // Get total before removing
        int totalBefore = cartPage.getCartTotal();

        // Remove product
        cartPage.deleteProductByName("Nexus 6");

        // Wait the product to disappear from the cart
        cartPage.waitForProductToBeRemoved("Nexus 6");

        // Get total after removing
        new WebDriverWait(driver, Duration.ofSeconds(5)).until(ExpectedConditions.presenceOfElementLocated(By.id("totalp")));
        int totalAfter = cartPage.getCartTotal();

        // Validate if the product was removed and total was updated
        Assert.assertTrue(cartPage.isProductAbsent("Nexus 6"), "X The product is still present in the cart.");
        Assert.assertTrue(totalAfter < totalBefore, "X The cart total did not update correctly after removal.");
    }



}
