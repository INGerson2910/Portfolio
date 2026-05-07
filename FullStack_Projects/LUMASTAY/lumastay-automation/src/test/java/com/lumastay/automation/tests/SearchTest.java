package com.lumastay.automation.tests;

import com.lumastay.automation.pages.ResultsPage;
import com.lumastay.automation.pages.SearchPage;
import com.lumastay.automation.tests.providers.TestDataProvider;
import io.qameta.allure.*;
import org.testng.Assert;
import org.testng.annotations.Test;

@Epic("Search")
@Feature("Hotel Search")
public class SearchTest extends BaseTest {

    @Test(groups = {"smoke"})
    @Story("Basic search returns results")
    @Description("Verify that clicking Search with default criteria returns at least one hotel")
    @Severity(SeverityLevel.BLOCKER)
    public void testSearchReturnsResults() {
        SearchPage searchPage = performLogin();
        searchPage.clickSearch();

        ResultsPage resultsPage = new ResultsPage(driver);
        resultsPage.waitForResults();

        Assert.assertTrue(resultsPage.getHotelCount() > 0,
                "At least one hotel should be returned for the default search");
    }

    @Test(groups = {"regression"})
    @Story("Sort by lowest price")
    @Description("Verify that selecting 'Lowest price' re-renders results without errors")
    @Severity(SeverityLevel.NORMAL)
    public void testSortByPriceAscending() {
        SearchPage searchPage = performLogin();
        searchPage.clickSearch();

        ResultsPage resultsPage = new ResultsPage(driver);
        resultsPage.waitForResults();
        resultsPage.setSortBy("price_asc");

        Assert.assertTrue(resultsPage.getHotelCount() > 0,
                "Results should still be visible after sorting by price ascending");
    }

    @Test(groups = {"regression"})
    @Story("Sort by highest price")
    @Description("Verify that selecting 'Highest price' re-renders results without errors")
    @Severity(SeverityLevel.NORMAL)
    public void testSortByPriceDescending() {
        SearchPage searchPage = performLogin();
        searchPage.clickSearch();

        ResultsPage resultsPage = new ResultsPage(driver);
        resultsPage.waitForResults();
        resultsPage.setSortBy("price_desc");

        Assert.assertTrue(resultsPage.getHotelCount() > 0,
                "Results should still be visible after sorting by price descending");
    }

    @Test(groups = {"regression"})
    @Story("Sort by top rated")
    @Description("Verify that selecting 'Top rated' re-renders results without errors")
    @Severity(SeverityLevel.NORMAL)
    public void testSortByRatingDescending() {
        SearchPage searchPage = performLogin();
        searchPage.clickSearch();

        ResultsPage resultsPage = new ResultsPage(driver);
        resultsPage.waitForResults();
        resultsPage.setSortBy("rating_desc");

        Assert.assertTrue(resultsPage.getHotelCount() > 0,
                "Results should still be visible after sorting by rating");
    }

    @Test(groups = {"regression"})
    @Story("Filter by property type")
    @Description("Verify that the Hotel property type filter reduces or maintains results")
    @Severity(SeverityLevel.NORMAL)
    public void testFilterByPropertyType() {
        SearchPage searchPage = performLogin();
        searchPage.clickSearch();

        ResultsPage resultsPage = new ResultsPage(driver);
        resultsPage.waitForResults();
        int totalBefore = resultsPage.getHotelCount();

        resultsPage.openFilters()
                   .filterByPropertyType("Hotel")
                   .applyFilters();

        int totalAfter = resultsPage.getHotelCount();
        Assert.assertTrue(totalAfter <= totalBefore,
                "Filtering by type should not produce more results than the unfiltered set");
    }

    @Test(dataProvider = "validSearches", dataProviderClass = TestDataProvider.class,
          groups = {"regression"})
    @Story("Multiple destinations — data-driven")
    @Description("Verify that search completes without errors for all seeded destinations")
    @Severity(SeverityLevel.NORMAL)
    public void testSearchWithMultipleDestinations(String destination, String checkIn, String checkOut) {
        SearchPage searchPage = performLogin();
        searchPage.selectDestination(destination);
        searchPage.setCheckIn(checkIn);
        searchPage.setCheckOut(checkOut);
        searchPage.clickSearch();

        // Some destinations may return 0 hotels — we only assert the app stays functional
        Assert.assertFalse(driver.getCurrentUrl().isEmpty(),
                "App should remain responsive after searching: " + destination);
    }

    @Test(groups = {"regression"})
    @Story("Adults stepper increment and decrement")
    @Description("Verify the adults counter increases by 1 and decreases by 1 correctly")
    @Severity(SeverityLevel.MINOR)
    public void testAdultsStepper() {
        SearchPage searchPage = performLogin();

        searchPage.increaseAdults(1);  // default 2 → 3
        Assert.assertEquals(searchPage.getAdultsCount(), "3",
                "Adults count should be 3 after one increment");

        searchPage.decreaseAdults(1);  // 3 → 2
        Assert.assertEquals(searchPage.getAdultsCount(), "2",
                "Adults count should return to 2 after one decrement");
    }
}
