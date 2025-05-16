package utils;

public class ValidationUtils {

    private static final String EMAIL_REGEX =
            "^(?!.*[.]{2})(?!.*[-]{2})(?![.-])[a-zA-Z0-9._-]+(?<![.-])@[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+$";

    public static boolean isValidEmail(String email) {
        return email != null && email.matches(EMAIL_REGEX);
    }

    public static boolean isSecurePassword(String password) {
        return password != null &&
                password.length() >= 8 &&
                password.matches(".*[A-Z].*") &&
                password.matches(".*[a-z].*") &&
                password.matches(".*\\d.*") &&
                password.matches(".*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?].*");
    }
}
