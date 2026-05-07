package com.lumastay.automation.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigManager {

    private static final Logger log = LoggerFactory.getLogger(ConfigManager.class);
    private static final String CONFIG_FILE = "config.properties";

    private static volatile ConfigManager instance;
    private final Properties props = new Properties();

    private ConfigManager() {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(CONFIG_FILE)) {
            if (is == null) {
                throw new RuntimeException(CONFIG_FILE + " not found on classpath");
            }
            props.load(is);
            log.info("Configuration loaded from {}", CONFIG_FILE);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load configuration", e);
        }
    }

    public static ConfigManager get() {
        if (instance == null) {
            synchronized (ConfigManager.class) {
                if (instance == null) instance = new ConfigManager();
            }
        }
        return instance;
    }

    /** System property overrides file value — useful for CLI: -Dbase.url=http://staging */
    public String getBaseUrl() {
        return System.getProperty("base.url", props.getProperty("base.url"));
    }

    public String getBrowser() {
        return System.getProperty("browser", props.getProperty("browser", "chrome")).toLowerCase();
    }

    /** Auto-enables headless when the CI environment variable is set to "true". */
    public boolean isHeadless() {
        if ("true".equalsIgnoreCase(System.getenv("CI"))) return true;
        return Boolean.parseBoolean(
                System.getProperty("headless", props.getProperty("headless", "false")));
    }

    public int getExplicitWait() {
        return Integer.parseInt(props.getProperty("explicit.wait", "15"));
    }

    public String getUsername() {
        return props.getProperty("username");
    }

    public String getPassword() {
        return props.getProperty("password");
    }
}
