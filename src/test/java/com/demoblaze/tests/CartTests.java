package com.demoblaze.tests;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class CartTests extends BaseTest{
    @Test(description = "Verificar que al hacer clic en \"Añadir al carrito\", el producto se agregue correctamente.")
    public void testAgregarProductoAlCarrito(){
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        CartPage cartPage = new CartPage(driver);

        navigationPage.clickOnProductByName("Sony vaio i7");
        productDetailPage.clickAddToCart();
        navigationPage.goToCart();
        cartPage.isProductInCart("Sony vaio i7");
    }
}
