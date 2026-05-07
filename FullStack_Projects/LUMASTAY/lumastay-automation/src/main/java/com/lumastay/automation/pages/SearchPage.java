package com.lumastay.automation.pages;

import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class SearchPage extends BasePage {

    private final By destinationCombobox = testId("destination_combobox");
    private final By checkInInput        = testId("checkin_input");
    private final By checkOutInput       = testId("checkout_input");
    private final By adultsIncrease      = testId("adults_increase");
    private final By adultsDecrease      = testId("adults_decrease");
    private final By childrenIncrease    = testId("children_increase");
    private final By childrenDecrease    = testId("children_decrease");
    private final By roomsIncrease       = testId("rooms_increase");
    private final By roomsDecrease       = testId("rooms_decrease");
    private final By adultsStepper       = testId("adults_stepper");
    private final By searchButton        = testId("search_hotels_button");
    private final By errorMessage        = By.cssSelector(".error-message");

    public SearchPage(WebDriver driver) {
        super(driver);
    }

    @Step("Wait for search page to be ready")
    public SearchPage waitForPage() {
        waitForVisible(searchButton);
        return this;
    }

    @Step("Select destination: {city}")
    public SearchPage selectDestination(String city) {
        selectByValue(destinationCombobox, city);
        return this;
    }

    @Step("Set check-in date: {date}")
    public SearchPage setCheckIn(String date) {
        type(checkInInput, date);
        return this;
    }

    @Step("Set check-out date: {date}")
    public SearchPage setCheckOut(String date) {
        type(checkOutInput, date);
        return this;
    }

    @Step("Increase adults count by {times}")
    public SearchPage increaseAdults(int times) {
        for (int i = 0; i < times; i++) click(adultsIncrease);
        return this;
    }

    @Step("Decrease adults count by {times}")
    public SearchPage decreaseAdults(int times) {
        for (int i = 0; i < times; i++) click(adultsDecrease);
        return this;
    }

    @Step("Increase children count by {times}")
    public SearchPage increaseChildren(int times) {
        for (int i = 0; i < times; i++) click(childrenIncrease);
        return this;
    }

    @Step("Decrease children count by {times}")
    public SearchPage decreaseChildren(int times) {
        for (int i = 0; i < times; i++) click(childrenDecrease);
        return this;
    }

    @Step("Increase rooms count by {times}")
    public SearchPage increaseRooms(int times) {
        for (int i = 0; i < times; i++) click(roomsIncrease);
        return this;
    }

    public String getAdultsCount() {
        WebElement stepper = driver.findElement(adultsStepper);
        return stepper.findElement(By.cssSelector(".stepper-value")).getText();
    }

    @Step("Click Search Hotels button")
    public void clickSearch() {
        click(searchButton);
    }

    public boolean isErrorDisplayed() {
        return isDisplayed(errorMessage);
    }

    public String getErrorMessage() {
        waitForVisible(errorMessage);
        return getText(errorMessage);
    }
}
