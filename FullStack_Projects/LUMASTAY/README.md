# LumaStay

LumaStay is a full-stack hotel booking application built as a QA-focused portfolio project.  
It simulates a Booking-like flow end to end, covering hotel search, availability, checkout, reservation confirmation, reservation management, and cancellation.

The project was designed not only as a development exercise, but as a realistic environment for practicing:

- API testing
- web testing
- mobile web testing
- end-to-end validation
- exploratory testing
- test case design
- automation-ready UI validation

---

## Overview

LumaStay includes:

- a backend REST API built with Node.js and Express
- a PostgreSQL database with realistic hotel, room, and inventory data
- Dockerized database setup
- Swagger documentation for API exploration and testing
- a React + Vite frontend
- responsive UI for desktop and mobile access
- language selection: Spanish / English
- currency selection: MXN / USD / EUR
- a complete reservation flow

Main functional flow:

1. Search destinations
2. View hotel results
3. Review room availability
4. Enter checkout and buyer information
5. Confirm reservation
6. View reservations
7. Cancel reservation

---

## Features

### Search and Discovery
- destination selector
- check-in and check-out
- adults / children / rooms
- results sorted by price or rating
- property and room details

### Booking Flow
- room availability by hotel
- checkout summary
- buyer information
- billing address
- card details input
- reservation confirmation

### Reservation Management
- list reservations
- view status
- cancel reservation
- inventory restoration on cancellation

### Internationalization / Localization
- Spanish and English UI
- currency display in MXN, USD, and EUR

### QA-Oriented Design
- realistic mock booking flow
- predictable test data
- demo login
- API documentation
- reusable environment for manual and automated testing

---

## Tech Stack

### Frontend
- React
- Vite
- Lucide React
- CSS

### Backend
- Node.js
- Express
- Zod
- JWT
- Swagger UI Express
- bcryptjs
- PostgreSQL driver (`pg`)

### Database / Infrastructure
- PostgreSQL
- Docker
- Docker Compose

### QA / Testing Value
- API-first architecture
- Swagger / OpenAPI
- realistic seed data
- `data-testid` usage in UI
- deterministic demo credentials
- reproducible environment for testing
- mobile validation via local network

---

## Project Structure

```text
FullStack_Projects/
└─ LUMASTAY/
   ├─ README.md
   ├─ lumastay-backend/
   │  ├─ package.json
   │  ├─ docker-compose.yml
   │  ├─ .env.example
   │  └─ src/
   │     ├─ app.js
   │     ├─ server.js
   │     ├─ config/
   │     ├─ db/
   │     ├─ middleware/
   │     ├─ routes/
   │     ├─ utils/
   │     ├─ validators/
   │     └─ openapi.js
   └─ lumastay-frontend/
      ├─ package.json
      ├─ vite.config.js
      ├─ index.html
      └─ src/
         ├─ main.jsx
         ├─ App.jsx
         ├─ styles.css
         ├─ api/
         │  └─ client.js
         └─ components/
            ├─ Controls.jsx
            └─ Header.jsx
```

---

## Setup

### Backend

```bash
cd FullStack_Projects/LUMASTAY/lumastay-backend
npm install
```

Copy `.env.example` to `.env` and use values like:

```env
PORT=4000
JWT_SECRET=dev_secret
DATABASE_URL=postgres://postgres:postgres@localhost:5432/lumastay
CORS_ORIGIN=http://localhost:5173
TAX_RATE=0.16
```

Start PostgreSQL with Docker:

```bash
docker compose up -d postgres
```

Wait until PostgreSQL is ready:

```bash
docker exec -it lumastay-postgres sh -c "until pg_isready -U postgres -d lumastay; do sleep 2; done"
```

Load the database schema:

```powershell
Get-Content src/db/schema.sql | docker exec -i lumastay-postgres psql -U postgres -d lumastay
```

Seed demo data:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

### Frontend

```bash
cd FullStack_Projects/LUMASTAY/lumastay-frontend
npm install
npm run dev
```

Default local frontend URL:

```text
http://localhost:5173
```

---

## Environment Variables

### Backend
- `PORT`
- `JWT_SECRET`
- `DATABASE_URL`
- `CORS_ORIGIN`
- `TAX_RATE`

---

## Demo Credentials

```text
Email: qa@lumastay.app
Password: Password123!
```

---

## API Documentation

Once the backend is running:

```text
http://localhost:4000/api-docs
```

Health endpoint:

```text
http://localhost:4000/health
```

---

## Main Endpoints

### Authentication
- `POST /api/v1/auth/login`

### Search
- `GET /api/v1/destinations`
- `POST /api/v1/search`
- `GET /api/v1/hotels/:hotelId/availability`

### Reservations
- `POST /api/v1/reservations`
- `GET /api/v1/reservations`
- `GET /api/v1/reservations/:reservationId`
- `POST /api/v1/reservations/:reservationId/cancel`

---

## Seed Data

The backend includes realistic seeded demo data such as:

- multiple countries
- multiple cities
- different hotel types
- multiple room types
- 180 days of inventory
- multiple currencies in backend data
- realistic pricing and availability patterns

Covered countries include:

- Mexico
- Spain
- Argentina
- Colombia
- Peru
- Chile
- United States
- France
- Italy
- Portugal
- England
- Germany
- China
- Canada
- Japan

---

## QA Use Cases

This project can be used to practice:

### Manual Testing
- smoke testing
- regression testing
- exploratory testing
- negative testing
- responsive validation
- checkout validation
- reservation lifecycle validation

### API Testing
- endpoint validation
- authentication testing
- payload validation
- schema validation
- status code assertions
- reservation and cancellation flow

### Web UI Testing
- search flow
- filters and sorting
- room selection
- checkout form validation
- reservation confirmation
- cancellation flow

### Mobile Web Testing
- responsive behavior
- local network testing
- backend / frontend connectivity from mobile browser

### Automation Readiness
- structured flows
- deterministic QA login
- reusable data
- stable selectors via `data-testid`

---

## Example Test Scenarios

- Search hotels for a valid destination and date range
- Search with children and verify capacity logic
- Open hotel detail and check room availability
- Complete checkout with valid buyer and card data
- Confirm reservation and validate locator
- View created reservation in "My Reservations"
- Cancel reservation and verify status change
- Validate reservation decline and pending scenarios
- Verify Swagger endpoints against actual backend behavior

---

## Future Improvements

- hotel image galleries
- hotel reviews
- hotel policies
- saved favorites
- multi-room booking enhancements
- stronger payment validation
- company billing flow
- Postman collection
- Playwright / Cypress E2E automation
- CI pipeline
- reporting dashboard for QA runs

---

## Why This Project Matters for QA

LumaStay is more than a demo UI.  
It is a realistic testable environment where backend, frontend, database, and booking logic interact in a way that mirrors real-world product validation work.

It demonstrates the ability to:

- understand end-to-end product behavior
- validate APIs and UI together
- design data-aware test scenarios
- simulate realistic user booking flows
- build testable software with QA in mind

---

## Author

**Gerson Medina**  
QA-focused portfolio project

GitHub: [INGerson2910](https://github.com/INGerson2910)
