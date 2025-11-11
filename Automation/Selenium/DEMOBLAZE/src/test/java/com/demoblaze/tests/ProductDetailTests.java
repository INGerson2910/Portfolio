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
@Feature("Página de detalle")
@Story("Detalle de productos")
@Severity(SeverityLevel.CRITICAL)
@Listeners({AllureTestNg.class})
public class ProductDetailTests extends BaseTest{
    @Test(description = "CP12 - Verificar que al seleccionar un producto se muestre su nombre, descripción, precio e imagen ampliada.")
    public void testDetalleProductoVisible(){
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);

        navigationPage.clickOnProductByName("Nexus 6");

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("name")));

        String nombre = productDetailPage.getProductName();
        String descripcion = productDetailPage.getProductDescription();
        String precio = productDetailPage.getProductPrice();
        boolean imagenVisible = productDetailPage.isImageDisplayed();

        Assert.assertFalse(nombre.trim().isEmpty(), "X El nombre del producto está vacío.");
        Assert.assertFalse(descripcion.trim().isEmpty(), "X La descripción del producto está vacía.");
        Assert.assertFalse(precio.trim().isEmpty(), "X El precio del producto está vacío.");
        Assert.assertTrue(imagenVisible, "X La imagen del producto no se muestra.");
    }

    @Test(description = "CP13 - Validar que la página de detalle incluya el botón 'Add to cart'.")
    public void testBotonAddToCartVisible(){
        NavigationPage navigationPage = new NavigationPage(driver);
        navigationPage.clickOnProductByName("Samsung galaxy s6");

        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        boolean visible = productDetailPage.isAddToCartButtonVisible();

        Assert.assertTrue(visible, "X El botón 'Add to cart' no está visible en la vista del producto");
    }
}
