package utils;

import com.github.javafaker.Faker;

import java.util.Random;

public class FakerUtils {

    private static final Faker faker = new Faker();
    private static final Random random = new Random();

    public static String generateUsername() {
        return faker.name().username() + System.currentTimeMillis();
    }

    public static String generateDomain(){
        return faker.internet().domainWord();
    }

    public static String generateValidEmail() {
        String username = faker.name().username().replaceAll("[^a-zA-Z0-9]", "");
        return username + "@gmail.com";
    }

    public static String generateInvalidEmail() {
        String[] invalidPatterns = {
                "plainaddress", "@missinguser.com", "missingdomain@", "user@.com",
                "user@com", "user@@domain.com", "user@domain..com"
        };
        return invalidPatterns[random.nextInt(invalidPatterns.length)];
    }

    public static String generateSecurePassword() {
        String upper = faker.letterify("A");
        String lower = faker.letterify("a");
        String number = String.valueOf(faker.number().digit());
        String symbol = "!@#$%^&*()_+{}[]".charAt(random.nextInt(16)) + "";
        String remaining = faker.lorem().characters(4, true, true);
        return upper + lower + number + symbol + remaining;
    }

    public static String generateWeakPassword() {
        String[] weak = {
                "123456", "password", "abc123", "qwerty", "111111",
                faker.letterify("weak"), "short", faker.number().digits(4)
        };
        return weak[random.nextInt(weak.length)];
    }
}
