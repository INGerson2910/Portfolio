package dataproviders;

import org.testng.annotations.DataProvider;

public class LoginDataProvider {
    @DataProvider(name = "validCredentials")
    public static Object[][] validCredentials(){
        return new Object[][]{
                {"gelemc2910@gmail.com", "gTr$k8mfi7"}
        };
    }

    @DataProvider(name = "invalidCredentials")
    public static Object[][] invalidCredentials(){
        return new Object[][]{
                {"gelemeco2910@gmail.com", "wrongPassword"},
                {"wronguser@gmail.com", "gTr$k8mfi7"},
                {"", ""},
                {"gelemeco2910@gmail.com", ""},
                {"", "gTr$k8mfi7"}
        };
    }
}
