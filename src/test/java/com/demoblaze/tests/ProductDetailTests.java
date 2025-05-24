package com.demoblaze.tests;

import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import io.qameta.allure.testng.AllureTestNg;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

@Epic("Demoblaze")
@Feature("Detail page")
@Story("Product detail")
@Severity(SeverityLevel.CRITICAL)
@Listeners({AllureTestNg.class})
public class ProductDetailTests extends BaseTest{
    @Test(description = "TC12 - Verify that name, description, enlarged image and price are shown when a product is selected.")
    public void testVisibleProductDetails(){
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);

        navigationPage.clickOnProductByName("Nexus 6");

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("name")));

        String name = productDetailPage.getProductName();
        String description = productDetailPage.getProductDescription();
        String price = productDetailPage.getProductPrice();
        boolean visibleImage = productDetailPage.isImageDisplayed();

        Assert.assertFalse(name.trim().isEmpty(), "X Product name is empty.");
        Assert.assertFalse(description.trim().isEmpty(), "X Product description is empty.");
        Assert.assertFalse(price.trim().isEmpty(), "X Product price is empty.");
        Assert.assertTrue(visibleImage, "X Product image is not shown.");
    }

    @Test(description = "TC13 - Validate 'Add to cart' button in the detail page.")
    public void testAddToCartButtonVisible(){
        NavigationPage navigationPage = new NavigationPage(driver);
        navigationPage.clickOnProductByName("Samsung galaxy s6");

        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        boolean visible = productDetailPage.isAddToCartButtonVisible();

        Assert.assertTrue(visible, "X 'Add to cart' button is not visible in the product view.");
    }
}
