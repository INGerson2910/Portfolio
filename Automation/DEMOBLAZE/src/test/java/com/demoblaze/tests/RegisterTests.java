package com.demoblaze.tests;

import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import io.qameta.allure.testng.AllureTestNg;
import org.openqa.selenium.Alert;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

import java.time.Duration;

@Epic("Demoblaze")
@Feature("Login")
@Story("Registro de usuario")
@Severity(SeverityLevel.CRITICAL)
@Listeners({AllureTestNg.class})
public class RegisterTests extends BaseTest {


    @Test(description = "CP01 - Validar que todos los campos sean obligatorios en el registro de usuario.")
    public void testCamposObligatoriosVacios() {
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.openSignupForm();
        registerPage.enterCredentials("", "");
        registerPage.submitForm();

        Alert alert = driver.switchTo().alert();
        String alertText = alert.getText();
        alert.accept();

        Assert.assertTrue(alertText.contains("Please fill out Username and Password"), "Se esperaba mensaje de error por campos vacíos.");
    }

    @Test(description = "CP02 - Verificar que el correo electrónico tenga un formato válido.")
    public void testFormatoUsuarioInvalido() {
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.openSignupForm();

        String usuario = "usuario@dominio1";
        String contrasena = "Password@123";

        registerPage.enterCredentials(usuario, contrasena);
        registerPage.submitForm();

        Alert alert = driver.switchTo().alert();
        String alertText = alert.getText();

        boolean esEmailValido = usuario.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");

        if (!esEmailValido) {
            Assert.assertFalse(alertText.contains("Sign up successful."), "ERROR: El sistema permitió registrar un usuario con correo inválido: " + usuario);
        } else {
            Assert.assertTrue(alertText.contains("Sign up successful."), "No se pudo registrar un usuario con correo válido.");
        }
    }

    @Test(description = "CP03 - Validar que la contraseña cumpla con las reglas de complejidad.")
    public void testContrasenaInvalida() {
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.openSignupForm();

        String usuario = "usuarioTest1" + System.currentTimeMillis();
        String contrasena = "1234"; // Muy débil: menos de 8 caracteres, sin mayúscula, sin símbolo

        registerPage.enterCredentials(usuario, contrasena);
        registerPage.submitForm();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        try {
            Alert alert = wait.until(ExpectedConditions.alertIsPresent());
            String alertText = alert.getText();
            alert.accept();

            boolean esContrasenaSegura = contrasena.length() >= 8 &&
                    contrasena.matches(".*[A-Z].*") &&
                    contrasena.matches(".*[a-z].*") &&
                    contrasena.matches(".*[0-9].*") &&
                    contrasena.matches(".*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-].*");

            if (!esContrasenaSegura) {
                Assert.assertFalse(alertText.contains("Sign up successful."),
                        "ERROR: El sistema aceptó una contraseña insegura: " + contrasena);
                Assert.fail("Fallo intencional: el sistema no validó la complejidad de contraseña.");
            } else {
                Assert.assertTrue(alertText.contains("Sign up successful."),
                        "No se pudo registrar con contraseña válida.");
            }
        } catch (Exception e) {
            Assert.fail("No se encontró ninguna alerta para la prueba de contraseña.");
        }
    }

}
