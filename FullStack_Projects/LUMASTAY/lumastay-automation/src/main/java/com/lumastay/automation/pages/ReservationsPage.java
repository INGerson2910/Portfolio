package com.lumastay.automation.pages;

import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class ReservationsPage extends BasePage {

    private final By reservationCards = testIdStartsWith("reservation_card_");
    private final By cancelButtons    = testIdStartsWith("cancel_reservation_");
    private final By cancelledLabels  = testIdStartsWith("cancelled_label_");

    public ReservationsPage(WebDriver driver) {
        super(driver);
    }

    @Step("Wait for reservations list to load")
    public ReservationsPage waitForReservations() {
        waitForVisible(reservationCards);
        return this;
    }

    @Step("Get total number of reservations")
    public int getReservationCount() {
        return driver.findElements(reservationCards).size();
    }

    @Step("Cancel first active reservation")
    public ReservationsPage cancelFirstActiveReservation() {
        List<WebElement> buttons = driver.findElements(cancelButtons);
        if (buttons.isEmpty()) {
            throw new IllegalStateException("No active reservations available to cancel");
        }
        buttons.get(0).click();
        return this;
    }

    @Step("Wait for cancellation to reflect in UI")
    public ReservationsPage waitForCancellation() {
        waitForVisible(cancelledLabels);
        return this;
    }

    public String getReservationStatus(String reservationId) {
        return getText(testId("reservation_status_" + reservationId));
    }

    public boolean isCancelledLabelVisible(String reservationId) {
        return isDisplayed(testId("cancelled_label_" + reservationId));
    }

    public boolean hasActiveCancellableReservations() {
        return !driver.findElements(cancelButtons).isEmpty();
    }

    public boolean hasCancelledReservations() {
        return !driver.findElements(cancelledLabels).isEmpty();
    }
}
