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
@Feature("Carrito")
@Story("Gestión del carrito")
@Severity(SeverityLevel.CRITICAL)
@Listeners({AllureTestNg.class})
public class CartTests extends BaseTest{
    @Test(description = "CP14 - Verificar que al hacer clic en \"Añadir al carrito\", el producto se agregue correctamente.")
    public void testAgregarProductoAlCarrito(){
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        CartPage cartPage = new CartPage(driver);

        navigationPage.clickOnProductByName("Sony vaio i7");
        productDetailPage.clickAddToCart();
        navigationPage.goToCart();
        cartPage.isProductInCart("Sony vaio i7");
    }

    @Test(description = "CP15 - Validar que exista una opción clara para regresar a la lista de productos desde la página de detalle.")
    public void testRegresarAListaDesdeDetalle(){
        NavigationPage navigationPage = new NavigationPage(driver);

        // Paso 1: Ir a la vista de detalle de un producto
        navigationPage.clickOnProductByName("Samsung galaxy s6");

        // Paso 2: Hacer clic en el logo de la tienda
        WebElement linkToHome = wait.until(ExpectedConditions.elementToBeClickable(By.id("nava")));
        linkToHome.click();

        // Paso 3: Validar que volvemos a la lista de productos
        WebElement listaProductos = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("tbodyid")));
        Assert.assertTrue(listaProductos.isDisplayed(), "X No se redirigió correctamente a la lista de productos.");
    }

    @Test(description = "CP16 - Verificar que se pueda añadir un producto al carrito desde la página de detalles.")
    public void testAgregarDesdeDetalle(){
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        CartPage cartPage = new CartPage(driver);

        // Ir al producto
        navigationPage.clickOnProductByName("Sony vaio i7");

        // Hacer clic en "Añadir al carrito"
        productDetailPage.clickAddToCart();

        // Ir al carrito y validar presencia del producto
        navigationPage.goToCart();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        Assert.assertTrue(cartPage.isProductInCart("Sony vaio i7"), "El producto no se encuentra en el carrito.");
    }

    @Test(description = "CP17 - Validar que el carrito muestre el nombre, precio y cantidad de los productos añadidos.")
    public void testValidarCantidadEnCarrito() {
        NavigationPage navigationPage = new NavigationPage(driver);
        ProductDetailPage productDetailPage = new ProductDetailPage(driver);
        CartPage cartPage = new CartPage(driver);

        String producto = "Nexus 6";
        String precio = "650";

        // Agregar el mismo producto dos veces
        navigationPage.clickOnProductByName(producto);
        productDetailPage.clickAddToCart();

        WebElement linkToHome = wait.until(ExpectedConditions.elementToBeClickable(By.id("nava")));
        linkToHome.click();

        navigationPage.clickOnProductByName(producto);
        productDetailPage.clickAddToCart();

        navigationPage.goToCart();

        // Validar que se muestra cantidad 2 para el producto (esto debería fallar si no hay columna "Cantidad")
        Assert.assertTrue(cartPage.validateProductDetails(producto, precio, 2),
                "X No se muestra la cantidad correcta (2) para el producto añadido dos veces.");
    }


}
