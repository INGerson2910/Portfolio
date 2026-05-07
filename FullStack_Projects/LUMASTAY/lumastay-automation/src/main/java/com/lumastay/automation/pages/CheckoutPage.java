package com.lumastay.automation.pages;

import com.lumastay.automation.model.BuyerData;
import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CheckoutPage extends BasePage {

    private final By checkoutSummary        = testId("checkout_summary");
    private final By reservationHolderInput = testId("reservation_holder_input");
    private final By buyerNameInput         = testId("buyer_name_input");
    private final By buyerEmailInput        = testId("buyer_email_input");
    private final By buyerPhoneInput        = testId("buyer_phone_input");
    private final By billingStreetInput     = testId("billing_street_input");
    private final By billingCityInput       = testId("billing_city_input");
    private final By billingStateInput      = testId("billing_state_input");
    private final By billingPostalCodeInput = testId("billing_postal_code_input");
    private final By billingCountryInput    = testId("billing_country_input");
    private final By cardholderNameInput    = testId("cardholder_name_input");
    private final By cardNumberInput        = testId("card_number_input");
    private final By expiryMonthInput       = testId("expiry_month_input");
    private final By expiryYearInput        = testId("expiry_year_input");
    private final By cvvInput               = testId("cvv_input");
    private final By payNowButton           = testId("pay_now_button");
    private final By totalAmount            = testId("checkout_total_amount");
    private final By errorMessage           = By.cssSelector(".error-message");
    private final By backButton             = testId("back_button");

    public CheckoutPage(WebDriver driver) {
        super(driver);
    }

    @Step("Wait for checkout page to load")
    public CheckoutPage waitForCheckout() {
        waitForVisible(checkoutSummary);
        return this;
    }

    @Step("Fill reservation holder: {value}")
    public CheckoutPage fillReservationHolder(String value) {
        type(reservationHolderInput, value);
        return this;
    }

    @Step("Fill buyer name: {value}")
    public CheckoutPage fillBuyerName(String value) {
        type(buyerNameInput, value);
        return this;
    }

    @Step("Fill buyer email: {value}")
    public CheckoutPage fillEmail(String value) {
        type(buyerEmailInput, value);
        return this;
    }

    @Step("Fill phone: {value}")
    public CheckoutPage fillPhone(String value) {
        type(buyerPhoneInput, value);
        return this;
    }

    @Step("Fill billing address")
    public CheckoutPage fillBillingAddress(String street, String city, String state, String postal, String country) {
        type(billingStreetInput,     street);
        type(billingCityInput,       city);
        type(billingStateInput,      state);
        type(billingPostalCodeInput, postal);
        type(billingCountryInput,    country);
        return this;
    }

    @Step("Fill card details")
    public CheckoutPage fillCardDetails(String name, String number, String month, String year, String cvv) {
        type(cardholderNameInput, name);
        type(cardNumberInput,     number);
        type(expiryMonthInput,    month);
        type(expiryYearInput,     year);
        type(cvvInput,            cvv);
        return this;
    }

    @Step("Fill all buyer and payment details")
    public CheckoutPage fillAllDetails(BuyerData data) {
        fillReservationHolder(data.getReservationHolder());
        fillBuyerName(data.getBuyerName());
        fillEmail(data.getEmail());
        fillPhone(data.getPhone());
        fillBillingAddress(
                data.getStreet(), data.getCity(), data.getState(),
                data.getPostalCode(), data.getCountry());
        fillCardDetails(
                data.getCardholderName(), data.getCardNumber(),
                data.getExpiryMonth(), data.getExpiryYear(), data.getCvv());
        return this;
    }

    @Step("Click Pay Now")
    public ConfirmationPage clickPayNow() {
        click(payNowButton);
        return new ConfirmationPage(driver);
    }

    @Step("Get total amount displayed")
    public String getTotalAmount() {
        return getText(totalAmount);
    }

    public boolean isErrorDisplayed() {
        return isDisplayed(errorMessage);
    }

    @Step("Get validation error message")
    public String getErrorMessage() {
        waitForVisible(errorMessage);
        return getText(errorMessage);
    }

    @Step("Go back to hotel detail")
    public HotelDetailPage goBack() {
        click(backButton);
        return new HotelDetailPage(driver);
    }
}
