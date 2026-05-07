package com.lumastay.automation.tests.providers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.testng.annotations.DataProvider;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

public class TestDataProvider {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * Provides { destination, checkIn, checkOut } rows from valid_searches.json.
     * Used by SearchTest for data-driven destination coverage.
     */
    @DataProvider(name = "validSearches")
    public static Object[][] validSearches() throws IOException {
        return toObjectArray("testdata/valid_searches.json",
                m -> new Object[]{ m.get("destination"), m.get("checkIn"), m.get("checkOut") });
    }

    /**
     * Provides { email, password, expectedError } rows from invalid_logins.json.
     * Used by LoginTest for negative credential scenarios.
     */
    @DataProvider(name = "invalidLogins")
    public static Object[][] invalidLogins() throws IOException {
        return toObjectArray("testdata/invalid_logins.json",
                m -> new Object[]{ m.get("email"), m.get("password"), m.get("expectedError") });
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    @FunctionalInterface
    private interface RowMapper {
        Object[] map(Map<String, String> row);
    }

    private static Object[][] toObjectArray(String path, RowMapper mapper) throws IOException {
        List<Map<String, String>> rows = loadJson(path);
        return rows.stream().map(mapper::map).toArray(Object[][]::new);
    }

    private static List<Map<String, String>> loadJson(String path) throws IOException {
        try (InputStream is = TestDataProvider.class.getClassLoader().getResourceAsStream(path)) {
            if (is == null) throw new IOException("Test data file not found: " + path);
            return MAPPER.readValue(is, new TypeReference<>() {});
        }
    }
}
