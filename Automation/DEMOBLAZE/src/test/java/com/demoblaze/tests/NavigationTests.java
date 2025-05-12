package com.demoblaze.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

public class NavigationTests extends BaseTest {
    @Test(description = "Caso 7 - Validar que el sitio muestre las categorías 'Laptops', 'Phones' y 'Monitors'")
    public void testCategoriasVisibles() {
        NavigationPage navigationPage = new NavigationPage(driver);

        List<String> categorias = navigationPage.getCategoryNames();

        Assert.assertTrue(categorias.contains("Laptops"), "X La categoría 'Laptops' no está visible.");
        Assert.assertTrue(categorias.contains("Phones"), "X La categoría 'Phones' no está visible.");
        Assert.assertTrue(categorias.contains("Monitors"), "X La categoría 'Monitors' no está visible.");
    }

    @Test(description = "Caso 8 - Validar que al seleccionar una categoría solo se muestren productos de esa categoría")
    public void testSoloProductosDeCategoriaPhones() {
        NavigationPage navigationPage = new NavigationPage(driver);
        navigationPage.clickCategory("Phones");

        List<WebElement> productos = driver.findElements(By.cssSelector(".card-title"));
        List<String> nombresProductos = productos.stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());

        Assert.assertFalse(nombresProductos.isEmpty(), "X No se mostraron productos tras hacer clic en 'Phones'.");

        // Lista de palabras clave que indican un producto de tipo Phone
        String[] palabrasClavePhones = {
                "samsung", "iphone", "nokia", "sony", "htc", "phone", "xperia", "lg", "lumia", "motorola", "nexus"
        };

        for (String nombre : nombresProductos) {
            boolean perteneceACategoria = false;
            for (String palabra : palabrasClavePhones) {
                if (nombre.toLowerCase().contains(palabra)) {
                    perteneceACategoria = true;
                    break;
                }
            }
            Assert.assertTrue(perteneceACategoria,
                    "X Producto inválido en categoría 'Phones': '" + nombre + "'");
        }
    }


    @Test(description = "Caso 9 - Verificar que cada producto muestre imagen, nombre y precio")
    public void testInformacionVisiblePorProducto() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Esperar hasta que al menos un producto esté visible
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#tbodyid .col-lg-4.col-md-6.mb-4"))
        );

        List<WebElement> productos = driver.findElements(By.cssSelector("#tbodyid .col-lg-4.col-md-6.mb-4"));

        Assert.assertFalse(productos.isEmpty(), "X No se encontraron productos en la página principal.");

        for (WebElement producto : productos) {
            WebElement imagen = producto.findElement(By.cssSelector("img.card-img-top.img-fluid"));
            WebElement nombre = producto.findElement(By.cssSelector(".card-title a"));
            WebElement precio = producto.findElement(By.tagName("h5"));

            Assert.assertTrue(imagen.isDisplayed(), "X La imagen del producto no es visible.");
            Assert.assertFalse(nombre.getText().trim().isEmpty(), "X El nombre del producto está vacío.");
            Assert.assertFalse(precio.getText().trim().isEmpty(), "X El precio del producto está vacío.");
        }
    }

    @Test(description = "CP10 - Validar que el sistema no muestre productos si la categoría está vacía.")
    public void testCategoriaVacia(){
        NavigationPage navigationPage = new NavigationPage(driver);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("tbodyid")));

        List<WebElement> productos = driver.findElements(By.cssSelector("#tbodyid .card-block"));

        boolean hayProductos = !productos.isEmpty();

        if(hayProductos){
            System.out.println("Este entorno no tiene una categoría vacía real.");
            Assert.fail("Se esperaban 0 productos, pero se encontraron algunos");
        }
        else{
            System.out.println("No se encontraron productos, comportamiento esperado.");
            Assert.assertTrue(true);
        }
    }

    @Test(description = "CP11 - Validar que la navegación entre categorías sea dinámica sin recargar toda la página.")
    public void testNavegacionDinamicaEntreCategorias(){
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

        Assert.assertEquals(sessionBefore, sessionAfter, "X La página se recargó completamente al cambiar de categoría.");
    }
}
