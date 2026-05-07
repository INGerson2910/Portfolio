package com.lumastay.automation.pages;

import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class ResultsPage extends BasePage {

    private final By firstHotelButton   = testIdStartsWith("select_hotel_");
    private final By sortBySelect       = testId("sort_by_select");
    private final By filtersButton      = testId("filters_button");
    private final By propertyTypeFilter = testId("property_type_filter");
    private final By amenityFilter      = testId("amenity_filter");
    private final By minRatingFilter    = testId("min_rating_filter");
    private final By applyFiltersButton = testId("apply_filters_button");
    private final By backButton         = testId("back_button");

    public ResultsPage(WebDriver driver) {
        super(driver);
    }

    @Step("Wait for hotel results to load")
    public ResultsPage waitForResults() {
        waitForVisible(firstHotelButton);
        return this;
    }

    @Step("Get number of hotels displayed")
    public int getHotelCount() {
        List<WebElement> hotels = driver.findElements(testIdStartsWith("select_hotel_"));
        return hotels.size();
    }

    @Step("Select first available hotel")
    public HotelDetailPage selectFirstHotel() {
        click(firstHotelButton);
        return new HotelDetailPage(driver);
    }

    @Step("Sort results by: {sortValue}")
    public ResultsPage setSortBy(String sortValue) {
        selectByValue(sortBySelect, sortValue);
        return this;
    }

    @Step("Open filters panel")
    public ResultsPage openFilters() {
        click(filtersButton);
        waitForVisible(applyFiltersButton);
        return this;
    }

    @Step("Filter by property type: {type}")
    public ResultsPage filterByPropertyType(String type) {
        selectByValue(propertyTypeFilter, type);
        return this;
    }

    @Step("Filter by amenity: {amenity}")
    public ResultsPage filterByAmenity(String amenity) {
        selectByValue(amenityFilter, amenity);
        return this;
    }

    @Step("Filter by minimum rating: {rating}")
    public ResultsPage filterByMinRating(String rating) {
        selectByValue(minRatingFilter, rating);
        return this;
    }

    @Step("Apply active filters")
    public ResultsPage applyFilters() {
        click(applyFiltersButton);
        return this;
    }

    public boolean isNoHotelsMessageVisible() {
        String src = driver.getPageSource();
        return src.contains("No encontramos hoteles") || src.contains("could not find hotels");
    }

    @Step("Go back to search")
    public SearchPage goBack() {
        click(backButton);
        return new SearchPage(driver);
    }
}
