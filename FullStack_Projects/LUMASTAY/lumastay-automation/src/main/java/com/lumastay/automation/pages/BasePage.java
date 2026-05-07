package com.lumastay.automation.pages;

import com.lumastay.automation.config.ConfigManager;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.List;

public abstract class BasePage {

    protected final WebDriver     driver;
    protected final WebDriverWait wait;

    private static final Logger log = LoggerFactory.getLogger(BasePage.class);

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver,
                Duration.ofSeconds(ConfigManager.get().getExplicitWait()));
    }

    // ── Locator helpers ────────────────────────────────────────────────────────

    protected By testId(String id) {
        return By.cssSelector("[data-testid='" + id + "']");
    }

    protected By testIdStartsWith(String prefix) {
        return By.cssSelector("[data-testid^='" + prefix + "']");
    }

    // ── Core interactions ──────────────────────────────────────────────────────

    protected void click(By locator) {
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
        log.debug("click  ← {}", locator);
    }

    protected void type(By locator, String text) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        el.clear();
        el.sendKeys(text);
        log.debug("type   ← '{}' into {}", text, locator);
    }

    protected String getText(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).getText();
    }

    protected String getAttribute(By locator, String attr) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).getAttribute(attr);
    }

    protected void selectByValue(By locator, String value) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        new Select(el).selectByValue(value);
        log.debug("select ← value='{}' on {}", value, locator);
    }

    protected void selectByVisibleText(By locator, String text) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        new Select(el).selectByVisibleText(text);
    }

    protected boolean isDisplayed(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (NoSuchElementException | StaleElementReferenceException e) {
            return false;
        }
    }

    protected void waitForVisible(By locator) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected void waitForInvisible(By locator) {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
    }

    protected void waitForClickable(By locator) {
        wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    protected List<WebElement> findAll(By locator) {
        wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(locator));
        return driver.findElements(locator);
    }
}
