package dataproviders;

import org.testng.annotations.DataProvider;
import utils.FakerUtils;

public class RegisterDataProvider {

    @DataProvider(name = "validAndInvalidEmails")
    public static Object[][] validAndInvalidEmails() {
        return new Object[][]{
                {FakerUtils.generateValidEmail(), true},                   // Valid
                {FakerUtils.generateUsername(), false},                                   // Missing @ and domain
                {FakerUtils.generateUsername() + "@domain", false},                                    // Missing .com
                {"@"+FakerUtils.generateDomain()+"gmail.com", false},                                     // Missing username
                {FakerUtils.generateUsername()+"@gmail", false},                                     // Incomplete domain
                {FakerUtils.generateUsername()+"@domain..com", false},                               // Invalid format
                {FakerUtils.generateUsername()+".name+test@gmail.com", true},                        // Valid with symbol +
                {"", false}                                                // Empty
        };
    }
}
