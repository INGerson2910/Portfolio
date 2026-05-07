package com.lumastay.automation.tests;

import com.lumastay.automation.model.BuyerData;
import com.lumastay.automation.pages.*;
import io.qameta.allure.*;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Epic("Reservations")
@Feature("Reservation Management")
public class ReservationsTest extends BaseTest {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /** Creates a real booking and returns the ConfirmationPage. */
    private ConfirmationPage createBooking(int daysFromNow) {
        String checkIn  = LocalDate.now().plusDays(daysFromNow).format(DATE_FMT);
        String checkOut = LocalDate.now().plusDays(daysFromNow + 3).format(DATE_FMT);

        SearchPage searchPage = performLogin();
        searchPage.setCheckIn(checkIn);
        searchPage.setCheckOut(checkOut);
        searchPage.clickSearch();

        ResultsPage resultsPage = new ResultsPage(driver);
        resultsPage.waitForResults();
        HotelDetailPage detailPage = resultsPage.selectFirstHotel();

        detailPage.waitForRooms();
        CheckoutPage checkoutPage = detailPage.selectFirstRoom();
        checkoutPage.waitForCheckout();
        checkoutPage.fillAllDetails(BuyerData.builder().build());

        return checkoutPage.clickPayNow();
    }

    @Test(groups = {"smoke"})
    @Story("View reservation after booking")
    @Description("Verify that a newly confirmed reservation appears in the My Reservations list")
    @Severity(SeverityLevel.CRITICAL)
    public void testViewReservationAfterBooking() {
        ConfirmationPage confirmationPage = createBooking(45);
        confirmationPage.waitForConfirmation();

        Assert.assertTrue(confirmationPage.isConfirmed(),
                "Booking must be confirmed before verifying reservations list");

        ReservationsPage reservationsPage = confirmationPage.clickMyReservations();
        reservationsPage.waitForReservations();

        Assert.assertTrue(reservationsPage.getReservationCount() > 0,
                "At least one reservation should appear after a successful booking");
    }

    @Test(groups = {"e2e"})
    @Story("Cancel reservation")
    @Description("E2E: book a room then cancel — verify the cancelled status label appears")
    @Severity(SeverityLevel.CRITICAL)
    public void testCancelReservation() {
        ConfirmationPage confirmationPage = createBooking(60);
        confirmationPage.waitForConfirmation();

        ReservationsPage reservationsPage = confirmationPage.clickMyReservations();
        reservationsPage.waitForReservations();

        Assert.assertTrue(reservationsPage.hasActiveCancellableReservations(),
                "Should have at least one active reservation available to cancel");

        reservationsPage.cancelFirstActiveReservation();
        reservationsPage.waitForCancellation();

        Assert.assertTrue(reservationsPage.hasCancelledReservations(),
                "Cancelled label should appear after the reservation is cancelled");
    }
}
