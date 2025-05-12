package com.demoblaze.tests;

import org.openqa.selenium.Alert;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;


public class LoginTests extends BaseTest {
    @Test
    public void testLoginExitoso() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.openLoginForm();
        loginPage.login("gelemc2910@outlook.com", "1234");

        Assert.assertTrue(loginPage.isLoginSuccessful(), "El usuario no pudo iniciar sesión con credenciales válidas.");
    }

    @Test
    public void testLoginConCredencialesIncorrectas() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.openLoginForm();
        loginPage.login("gelemeco2910@gmail.com", "gTr9&kSml#7");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        try {
            Alert alert = wait.until(ExpectedConditions.alertIsPresent());
            String alertText = alert.getText();
            alert.accept();

            Assert.assertTrue(alertText.contains("Wrong password") || alertText.contains("User does not exist"), "El mensaje de error esperado no fue mostrado. Texto recibido: " + alertText);
        } catch (Exception e) {
            Assert.fail("No se encontró ninguna alerta de error tras intento de login fallido.");
        }

    }

    @Test
    public void testBloqueoTrasCincoIntentosFallidos() {
        LoginPage loginPage = new LoginPage(driver);
        boolean fueBloqueado = false;
        String usuario = "gelemeco2910@gmail.com";
        String contrasenaIncorrecta = "gTr9&kSml#7";

        for (int i = 1; i <= 5; i++) {
            driver.get("https://www.demoblaze.com");
            loginPage.openLoginForm();
            loginPage.login(usuario, contrasenaIncorrecta);

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            try {
                Alert alert = wait.until(ExpectedConditions.alertIsPresent());
                String mensaje = alert.getText();
                alert.accept();

                if (mensaje.toLowerCase().contains("blocked") || mensaje.toLowerCase().contains("demasiados")) {
                    fueBloqueado = true;
                    break;
                }
            } catch (Exception e) {
                Assert.fail("No se encontró alerta en el intento #" + i);
            }
        }

        // El sistema actualmente NO bloquea, así que esta prueba debe FALLAR intencionalmente
        Assert.assertTrue(fueBloqueado, "Fallo intencional: el sistema no bloqueó al usuario tras 5 intentos fallidos.");
    }

}
