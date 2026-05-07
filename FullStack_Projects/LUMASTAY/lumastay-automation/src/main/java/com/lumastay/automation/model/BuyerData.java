package com.lumastay.automation.model;

/**
 * Immutable value object for checkout form data.
 * Use BuyerData.builder().build() for a ready-to-use default instance.
 */
public class BuyerData {

    private final String reservationHolder;
    private final String buyerName;
    private final String email;
    private final String phone;
    private final String street;
    private final String city;
    private final String state;
    private final String postalCode;
    private final String country;
    private final String cardholderName;
    private final String cardNumber;
    private final String expiryMonth;
    private final String expiryYear;
    private final String cvv;

    private BuyerData(Builder b) {
        this.reservationHolder = b.reservationHolder;
        this.buyerName         = b.buyerName;
        this.email             = b.email;
        this.phone             = b.phone;
        this.street            = b.street;
        this.city              = b.city;
        this.state             = b.state;
        this.postalCode        = b.postalCode;
        this.country           = b.country;
        this.cardholderName    = b.cardholderName;
        this.cardNumber        = b.cardNumber;
        this.expiryMonth       = b.expiryMonth;
        this.expiryYear        = b.expiryYear;
        this.cvv               = b.cvv;
    }

    public String getReservationHolder() { return reservationHolder; }
    public String getBuyerName()         { return buyerName; }
    public String getEmail()             { return email; }
    public String getPhone()             { return phone; }
    public String getStreet()            { return street; }
    public String getCity()              { return city; }
    public String getState()             { return state; }
    public String getPostalCode()        { return postalCode; }
    public String getCountry()           { return country; }
    public String getCardholderName()    { return cardholderName; }
    public String getCardNumber()        { return cardNumber; }
    public String getExpiryMonth()       { return expiryMonth; }
    public String getExpiryYear()        { return expiryYear; }
    public String getCvv()               { return cvv; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        // Sensible defaults so tests can call .build() with no extra setup
        private String reservationHolder = "Juan Pérez";
        private String buyerName         = "Juan Pérez";
        private String email             = "qa@lumastay.app";
        private String phone             = "5512345678";
        private String street            = "Av. Insurgentes 123";
        private String city              = "Ciudad de México";
        private String state             = "CDMX";
        private String postalCode        = "06600";
        private String country           = "México";
        private String cardholderName    = "JUAN PEREZ";
        private String cardNumber        = "4111111111111111";
        private String expiryMonth       = "12";
        private String expiryYear        = "2027";
        private String cvv               = "123";

        public Builder reservationHolder(String v) { this.reservationHolder = v; return this; }
        public Builder buyerName(String v)         { this.buyerName = v;         return this; }
        public Builder email(String v)             { this.email = v;             return this; }
        public Builder phone(String v)             { this.phone = v;             return this; }
        public Builder street(String v)            { this.street = v;            return this; }
        public Builder city(String v)              { this.city = v;              return this; }
        public Builder state(String v)             { this.state = v;             return this; }
        public Builder postalCode(String v)        { this.postalCode = v;        return this; }
        public Builder country(String v)           { this.country = v;           return this; }
        public Builder cardholderName(String v)    { this.cardholderName = v;    return this; }
        public Builder cardNumber(String v)        { this.cardNumber = v;        return this; }
        public Builder expiryMonth(String v)       { this.expiryMonth = v;       return this; }
        public Builder expiryYear(String v)        { this.expiryYear = v;        return this; }
        public Builder cvv(String v)               { this.cvv = v;               return this; }

        public BuyerData build() { return new BuyerData(this); }
    }
}
