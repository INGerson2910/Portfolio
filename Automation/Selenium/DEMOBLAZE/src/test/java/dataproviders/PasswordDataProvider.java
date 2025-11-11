package dataproviders;

import org.testng.annotations.DataProvider;

public class PasswordDataProvider {
    @DataProvider(name = "weakAndStrongPasswords")
    public static  Object[][] weakAndStrongPasswords(){
        return new Object[][] {
                {"1234", false},
                {"key123", false},
                {"KEY123", false},
                {"key$%&", false},
                {"Key123", false},
                {"Key$123", true}
        };
    }
}
