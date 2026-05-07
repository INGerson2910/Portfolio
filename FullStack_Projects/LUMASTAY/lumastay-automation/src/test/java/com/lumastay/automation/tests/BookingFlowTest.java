package com.lumastay.automation.tests;

import com.lumastay.automation.model.BuyerData;
import com.lumastay.automation.pages.*;
import io.qameta.allure.*;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Epic("Booking")
@Feature("End-to-End Reservation Flow")
public class BookingFlowTest extends BaseTest {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /** Reusable helper: login → search → pick first hotel → first room → arrive at checkout. */
    private CheckoutPage reachCheckout(String checkIn, String checkOut) {
        SearchPage searchPage = performLogin();
        searchPage.setCheckIn(checkIn);
        searchPage.setCheckOut(checkOut);
        searchPage.clickSearch();

        ResultsPage resultsPage = new ResultsPage(driver);
        resultsPage.waitForResults();
        HotelDetailPage detailPage = resultsPage.selectFirstHotel();

        detailPage.waitForRooms();
        return detailPage.selectFirstRoom();
    }

    @Test(groups = {"smoke", "e2e"})
    @Story("Complete booking flow")
    @Description("E2E: login → search → hotel detail → checkout → payment → confirmation")
    @Severity(SeverityLevel.BLOCKER)
    public void testCompleteBookingFlow() {
        String checkIn  = LocalDate.now().plusDays(30).format(DATE_FMT);
        String checkOut = LocalDate.now().plusDays(33).format(DATE_FMT);

        CheckoutPage checkoutPage = reachCheckout(checkIn, checkOut);
        checkoutPage.waitForCheckout();

        String totalAmount = checkoutPage.getTotalAmount();
        Assert.assertFalse(totalAmount.isBlank(),
                "Total amount must be displayed in checkout before paying");

        checkoutPage.fillAllDetails(BuyerData.builder().build());

        ConfirmationPage confirmationPage = checkoutPage.clickPayNow();
        confirmationPage.waitForConfirmation();

        Assert.assertTrue(confirmationPage.isConfirmed(),
                "Booking status must be 'confirmed' after successful payment");
        Assert.assertFalse(confirmationPage.getLocator().isBlank(),
                "Confirmation locator code must not be empty");
    }

    @Test(groups = {"regression"})
    @Story("Checkout form validation — empty fields")
    @Description("Verify that clicking Pay Now with empty form fields shows a validation error")
    @Severity(SeverityLevel.CRITICAL)
    public void testCheckoutFormValidationOnEmptyFields() {
        String checkIn  = LocalDate.now().plusDays(30).format(DATE_FMT);
        String checkOut = LocalDate.now().plusDays(33).format(DATE_FMT);

        CheckoutPage checkoutPage = reachCheckout(checkIn, checkOut);
        checkoutPage.waitForCheckout();

        // Click Pay Now without filling any field
        checkoutPage.clickPayNow();

        Assert.assertTrue(checkoutPage.isErrorDisplayed(),
                "A validation error message should appear for empty required fields");
    }

    @Test(groups = {"regression"})
    @Story("Checkout form validation — invalid card number")
    @Description("Verify that a card number with fewer than 16 digits shows a format error")
    @Severity(SeverityLevel.NORMAL)
    public void testCheckoutInvalidCardNumberFormat() {
        String checkIn  = LocalDate.now().plusDays(30).format(DATE_FMT);
        String checkOut = LocalDate.now().plusDays(33).format(DATE_FMT);

        CheckoutPage checkoutPage = reachCheckout(checkIn, checkOut);
        checkoutPage.waitForCheckout();

        // Fill all required fields but use an invalid card number
        checkoutPage.fillAllDetails(
                BuyerData.builder().cardNumber("1234").build()
        );
        checkoutPage.clickPayNow();

        Assert.assertTrue(checkoutPage.isErrorDisplayed(),
                "Error should appear when card number has fewer than 16 digits");
    }

    @Test(groups = {"regression"})
    @Story("Checkout displays correct total amount")
    @Description("Verify that the total amount is a non-empty value visible before payment")
    @Severity(SeverityLevel.NORMAL)
    public void testCheckoutDisplaysTotalAmount() {
        String checkIn  = LocalDate.now().plusDays(30).format(DATE_FMT);
        String checkOut = LocalDate.now().plusDays(33).format(DATE_FMT);

        CheckoutPage checkoutPage = reachCheckout(checkIn, checkOut);
        checkoutPage.waitForCheckout();

        String total = checkoutPage.getTotalAmount();
        Assert.assertFalse(total.isBlank(),
                "Total amount element should be visible and non-empty in checkout");
    }
}
