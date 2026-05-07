package com.ingerson2910.lumastay.base;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class DriverFactory {
    // The central and secure point: our virtual "locker" for each thread of execution
    private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();

    private DriverFactory() {
    }

    // Open Chrome
    public static void initDriver() {
        // Validate that the current thread does not have already an open browser
        if (driverThreadLocal.get() == null) {
            // Automatic management of Chrome binary with WebDriverManagement integration
            WebDriverManager.chromedriver().setup();

            ChromeOptions options = new ChromeOptions();
            options.addArguments("--start-maximized");

            // Save the instance into the secure container for threads
            driverThreadLocal.set(new ChromeDriver(options));
        }
    }

    // Allows to retrieve driver from other sides
    public static WebDriver getDriver() {
        // Returns exactly the Chrome instance belonging to the calling thread
        return driverThreadLocal.get();
    }

    // Allows to close driver
    public static void quitDriver() {
        if (driverThreadLocal.get() != null) {
            driverThreadLocal.get().quit(); // Kills the process of the browser and the driver in the OS
            driverThreadLocal.remove(); // Destroys the object inside Java to avoid memory leaks
        }
    }
}
