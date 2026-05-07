package com.lumastay.automation.pages;

import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ConfirmationPage extends BasePage {

    private final By statusText          = testId("confirmation_status_text");
    private final By locatorText         = testId("confirmation_locator");
    private final By reservationIdText   = testId("confirmation_reservation_id");
    private final By goToReservationsBtn = testId("go_to_reservations_button");

    public ConfirmationPage(WebDriver driver) {
        super(driver);
    }

    @Step("Wait for booking confirmation to appear")
    public ConfirmationPage waitForConfirmation() {
        waitForVisible(statusText);
        return this;
    }

    @Step("Get confirmation locator code")
    public String getLocator() {
        return getText(locatorText);
    }

    @Step("Get reservation ID")
    public String getReservationId() {
        return getText(reservationIdText).replace("ID:", "").trim();
    }

    @Step("Verify booking status is confirmed")
    public boolean isConfirmed() {
        String status = getText(statusText);
        return status.contains("confirmada") || status.contains("confirmed");
    }

    @Step("Navigate to My Reservations")
    public ReservationsPage clickMyReservations() {
        click(goToReservationsBtn);
        return new ReservationsPage(driver);
    }
}
