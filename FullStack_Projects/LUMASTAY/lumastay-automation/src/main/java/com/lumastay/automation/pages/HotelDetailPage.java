package com.lumastay.automation.pages;

import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class HotelDetailPage extends BasePage {

    private final By backButton = testId("back_button");

    // Room cards rendered inside .results-list; checkout buttons have no testid in the current UI
    private final By roomCards       = By.cssSelector(".results-list .card-body");
    private final By checkoutButtons = By.xpath(
            "//div[contains(@class,'results-list')]//button[contains(@class,'primary-button')]");

    public HotelDetailPage(WebDriver driver) {
        super(driver);
    }

    @Step("Wait for room availability to load")
    public HotelDetailPage waitForRooms() {
        waitForVisible(checkoutButtons);
        return this;
    }

    @Step("Get number of available rooms")
    public int getRoomCount() {
        List<WebElement> rooms = driver.findElements(roomCards);
        return rooms.size();
    }

    @Step("Select first available room")
    public CheckoutPage selectFirstRoom() {
        click(checkoutButtons);
        return new CheckoutPage(driver);
    }

    @Step("Go back to results")
    public ResultsPage goBack() {
        click(backButton);
        return new ResultsPage(driver);
    }
}
