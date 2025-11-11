# DEMOBLAZE Automation Project

This project contains automated tests for [demoblaze.com](https://www.demoblaze.com), developed using Java, Selenium WebDriver, TestNG, and Allure for reporting.

##  Project Structure

```
DEDMOBLAZE/
├── src/
├── pom.xml
├── allure-results/
└── README.md
```

##  Technologies Used

- Java 17+
- Selenium WebDriver
- TestNG
- Maven
- Allure Reports

---

## ▶ How to Run the Tests

### 1. Clone the Repository

```bash
git clone https://github.com/INGerson2910/Portfolio.git
cd Portfolio/Automation/DEMOBLAZE
```

### 2. Run Tests with Maven

```bash
mvn clean test
```

This command will compile the project and execute all test cases defined in the TestNG framework.

---

### 3. Generate Allure Report (Optional)

```bash
allure serve allure-results
```

> Make sure you have Allure CLI installed.  
> [Installation Guide](https://docs.qameta.io/allure/#_installing_a_commandline)

---

## Test Coverage Overview

- **Login Tests**: Successful and unsuccessful login validations.
- **Signup Tests**: Alerts for empty fields and successful user registration.
- **Cart Tests**: Add items to cart, remove items, and verify total price.

---

## Author

**Gerson Medina**  
[LinkedIn](https://www.linkedin.com/in/ingerson2910/)
