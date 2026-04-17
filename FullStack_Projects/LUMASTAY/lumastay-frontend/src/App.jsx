import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Coffee,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Wifi,
  Waves,
  XCircle
} from 'lucide-react';
import {
  BackButton,
  DatePickerField,
  DestinationCombobox,
  LocaleSelector,
  Stepper
} from './components/Controls.jsx';
import { Header } from './components/Header.jsx';
import {
  cancelReservation,
  createReservation,
  fetchAvailability,
  fetchDestinations,
  fetchReservations,
  loginUser,
  registerUser,
  searchHotels
} from './api/client.js';

const copy = {
  es: {
    screens: {
      search: 'Búsqueda',
      results: 'Resultados',
      detail: 'Detalle',
      checkout: 'Checkout',
      confirmation: 'Confirmación',
      reservations: 'Mis reservas'
    },
    loginTitle: 'Iniciar sesión',
    registerTitle: 'Crear cuenta',
    login: 'Entrar',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    goToRegister: 'Crear una cuenta',
    goToLogin: 'Ya tengo cuenta',
    password: 'Contraseña',
    fullName: 'Nombre completo',
    loginRequired: 'Debes iniciar sesión para continuar.',
    heroEyebrow: 'Hoteles reales desde la API',
    heroTitle: 'Busca, compara y reserva',
    destination: 'Destino',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    adults: 'Adultos',
    children: 'Niños',
    rooms: 'Habitaciones',
    searchHotels: 'Buscar hoteles',
    filters: 'Filtros',
    sortBy: 'Ordenar por',
    noHotels: 'No encontramos hoteles disponibles para esos criterios.',
    viewRooms: 'Ver habitaciones',
    hotel: 'Hotel',
    room: 'Habitación',
    dates: 'Fechas',
    guests: 'Huéspedes',
    nights: 'noches',
    taxes: 'Impuestos',
    total: 'Total',
    selectedRoomFallback: 'No hay una habitación seleccionada.',
    checkoutTitle: 'Revisa y confirma tu reserva',
    cancellationPolicyBackend: 'política calculada por backend al cancelar.',
    reservationHolderSection: 'Titular de la reservación',
    buyerDataSection: 'Datos del comprador',
    billingAddressSection: 'Domicilio de facturación',
    paymentDataSection: 'Datos de la tarjeta',
    reservationHolder: 'Nombre del titular de la reservación',
    buyerName: 'Nombre completo del comprador',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    street: 'Calle y número',
    city: 'Ciudad',
    state: 'Estado / Provincia',
    postalCode: 'Código postal',
    country: 'País',
    cardholderName: 'Nombre en la tarjeta',
    cardNumber: 'Número de tarjeta',
    expiryMonth: 'Mes',
    expiryYear: 'Año',
    cvv: 'CVV',
    payNow: 'Pagar ahora',
    processing: 'Procesando...',
    approved: 'Reserva confirmada',
    pending: 'Pago pendiente',
    failed: 'Pago rechazado',
    myReservations: 'Mis reservas',
    cancel: 'Cancelar reserva',
    cancelled: 'Reserva cancelada',
    validationReservationHolder: 'Ingresa el titular de la reservación.',
    validationBuyerName: 'Ingresa el nombre del comprador.',
    validationEmail: 'Ingresa el correo electrónico.',
    validationPhone: 'Ingresa el teléfono.',
    validationStreet: 'Ingresa la calle y número.',
    validationCity: 'Ingresa la ciudad.',
    validationState: 'Ingresa el estado o provincia.',
    validationPostalCode: 'Ingresa el código postal.',
    validationCountry: 'Ingresa el país.',
    validationCardholder: 'Ingresa el nombre en la tarjeta.',
    validationCardNumber: 'Ingresa el número de tarjeta.',
    validationExpiryMonth: 'Ingresa el mes de expiración.',
    validationExpiryYear: 'Ingresa el año de expiración.',
    validationCvv: 'Ingresa el CVV.',
    validationCardNumberFormat: 'El número de tarjeta debe tener 16 dígitos.',
    validationCvvFormat: 'El CVV debe tener 3 o 4 dígitos.',
    priceAsc: 'Precio menor',
    priceDesc: 'Precio mayor',
    ratingDesc: 'Mejor puntuación',
    footer: 'Frontend conectado a API · datos realistas · flujo Booking-like · data-testid para QA automation',
    applyFilters: 'Aplicar filtros',
    hideFilters: 'Ocultar filtros',
    minRating: 'Rating mínimo',
    minPrice: 'Precio mínimo',
    maxPrice: 'Precio máximo',
    propertyType: 'Tipo de propiedad',
    amenity: 'Amenidad',
    all: 'Todos',
    hotelType: 'Hotel',
    resortType: 'Resort',
    businessType: 'Business hotel',
    apartHotelType: 'Apart-hotel',
    wifiAmenity: 'Wi-Fi',
    breakfastAmenity: 'Desayuno',
    beachAmenity: 'Playa',
    poolAmenity: 'Alberca',
  
  },
  en: {
    screens: {
      search: 'Search',
      results: 'Results',
      detail: 'Detail',
      checkout: 'Checkout',
      confirmation: 'Confirmation',
      reservations: 'My reservations'
    },
    loginTitle: 'Sign in',
    registerTitle: 'Create account',
    login: 'Login',
    register: 'Register',
    logout: 'Log out',
    goToRegister: 'Create an account',
    goToLogin: 'I already have an account',
    password: 'Password',
    fullName: 'Full name',
    loginRequired: 'You must sign in to continue.',
    heroEyebrow: 'Real hotels from the API',
    heroTitle: 'Search, compare and book',
    destination: 'Destination',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    adults: 'Adults',
    children: 'Children',
    rooms: 'Rooms',
    searchHotels: 'Search hotels',
    filters: 'Filters',
    sortBy: 'Sort by',
    noHotels: 'We could not find hotels for those criteria.',
    viewRooms: 'View rooms',
    hotel: 'Hotel',
    room: 'Room',
    dates: 'Dates',
    guests: 'Guests',
    nights: 'nights',
    taxes: 'Taxes',
    total: 'Total',
    selectedRoomFallback: 'No room selected.',
    checkoutTitle: 'Review and confirm your booking',
    cancellationPolicyBackend: 'policy calculated by backend during cancellation.',
    reservationHolderSection: 'Reservation holder',
    buyerDataSection: 'Buyer details',
    billingAddressSection: 'Billing address',
    paymentDataSection: 'Card details',
    reservationHolder: 'Reservation holder full name',
    buyerName: 'Buyer full name',
    email: 'Email address',
    phone: 'Phone number',
    street: 'Street and number',
    city: 'City',
    state: 'State / Province',
    postalCode: 'Postal code',
    country: 'Country',
    cardholderName: 'Name on card',
    cardNumber: 'Card number',
    expiryMonth: 'Month',
    expiryYear: 'Year',
    cvv: 'CVV',
    payNow: 'Pay now',
    processing: 'Processing...',
    approved: 'Booking confirmed',
    pending: 'Payment pending',
    failed: 'Payment declined',
    myReservations: 'My reservations',
    cancel: 'Cancel reservation',
    cancelled: 'Reservation cancelled',
    validationReservationHolder: 'Enter the reservation holder.',
    validationBuyerName: 'Enter the buyer name.',
    validationEmail: 'Enter the email address.',
    validationPhone: 'Enter the phone number.',
    validationStreet: 'Enter the street and number.',
    validationCity: 'Enter the city.',
    validationState: 'Enter the state or province.',
    validationPostalCode: 'Enter the postal code.',
    validationCountry: 'Enter the country.',
    validationCardholder: 'Enter the name on card.',
    validationCardNumber: 'Enter the card number.',
    validationExpiryMonth: 'Enter the expiry month.',
    validationExpiryYear: 'Enter the expiry year.',
    validationCvv: 'Enter the CVV.',
    validationCardNumberFormat: 'Card number must have 16 digits.',
    validationCvvFormat: 'CVV must have 3 or 4 digits.',
    priceAsc: 'Lowest price',
    priceDesc: 'Highest price',
    ratingDesc: 'Top rated',
    footer: 'Frontend connected to API · realistic data · Booking-like flow · data-testid for QA automation',
    applyFilters: 'Apply filters',
    hideFilters: 'Hide filters',
    minRating: 'Minimum rating',
    minPrice: 'Minimum price',
    maxPrice: 'Maximum price',
    propertyType: 'Property type',
    amenity: 'Amenity',
    all: 'All',
    hotelType: 'Hotel',
    resortType: 'Resort',
    businessType: 'Business hotel',
    apartHotelType: 'Apart-hotel',
    wifiAmenity: 'Wi-Fi',
    breakfastAmenity: 'Breakfast',
    beachAmenity: 'Beach',
    poolAmenity: 'Pool',
  }
};

function formatMoney(amount, currency, language) {
  const uiCurrency = ['MXN', 'USD', 'EUR'].includes(currency) ? currency : 'USD';
  const locale = language === 'es' ? 'es-MX' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: uiCurrency,
    maximumFractionDigits: 0
  }).format(Number(amount || 0));
}

function nightsBetween(checkIn, checkOut) {
  return Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
}

function Shell({ children }) {
  return <div className="shell">{children}</div>;
}

function Card({ children, className = '', ...props }) {
  return (
    <section className={`card ${className}`.trim()} {...props}>
      {children}
    </section>
  );
}

function Amenities({ amenities = [] }) {
  const iconMap = {
    'Wi-Fi': <Wifi size={14} />,
    Desayuno: <Coffee size={14} />,
    Playa: <Waves size={14} />
  };

  return (
    <div className="amenities">
      {amenities.map((item) => (
        <span key={item} className="amenity-chip">
          {iconMap[item] || <ShieldCheck size={14} />}
          {item}
        </span>
      ))}
    </div>
  );
}

function AuthCard({ title, children }) {
  return (
    <Shell>
      <Card className="card-body auth-card">
        <h2>{title}</h2>
        {children}
      </Card>
    </Shell>
  );
}

function LoginView({ t, onLogin, onGoRegister, error }) {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  return (
    <AuthCard title={t.loginTitle}>
      <div className="form-stack">
        <input
          className="control"
          placeholder={t.email}
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          data-testid="login_email_input"
        />

        <input
          className="control"
          type="password"
          placeholder={t.password}
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          data-testid="login_password_input"
        />
      </div>

      {error ? <p className="error-message">{error}</p> : null}

      <button
        className="primary-button"
        onClick={() => onLogin(form)}
        data-testid="login_button"
      >
        {t.login}
      </button>

      <button
        className="secondary-button auth-link-button"
        onClick={onGoRegister}
        type="button"
        data-testid="go_to_register_button"
      >
        {t.goToRegister}
      </button>
    </AuthCard>
  );
}

function RegisterView({ t, onRegister, onGoLogin, error }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  return (
    <AuthCard title={t.registerTitle}>
      <div className="form-stack">
        <input
          className="control"
          placeholder={t.fullName}
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          data-testid="register_name_input"
        />

        <input
          className="control"
          placeholder={t.email}
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          data-testid="register_email_input"
        />

        <input
          className="control"
          type="password"
          placeholder={t.password}
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          data-testid="register_password_input"
        />

        <input
          className="control"
          placeholder={t.phone}
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          data-testid="register_phone_input"
        />
      </div>

      {error ? <p className="error-message">{error}</p> : null}

      <button
        className="primary-button"
        onClick={() => onRegister(form)}
        data-testid="register_button"
      >
        {t.register}
      </button>

      <button
        className="secondary-button auth-link-button"
        onClick={onGoLogin}
        type="button"
        data-testid="go_to_login_button"
      >
        {t.goToLogin}
      </button>
    </AuthCard>
  );
}

function SearchView({ t, criteria, setCriteria, destinations, onSearch, error }) {
  const today = '2026-04-13';

  return (
    <Shell>
      <Card className="hero-card">
        <div className="hero-top">
          <p>{t.heroEyebrow}</p>
          <h2>{t.heroTitle}</h2>
        </div>

        <div className="card-body">
          <DestinationCombobox
            value={criteria.destination}
            destinations={destinations}
            onChange={(value) => setCriteria((prev) => ({ ...prev, destination: value }))}
            label={t.destination}
          />

          <div className="grid-2">
            <DatePickerField
              label={t.checkIn}
              value={criteria.checkIn}
              min={today}
              onChange={(value) => setCriteria((prev) => ({ ...prev, checkIn: value }))}
              testId="checkin_input"
            />

            <DatePickerField
              label={t.checkOut}
              value={criteria.checkOut}
              min={criteria.checkIn || today}
              onChange={(value) => setCriteria((prev) => ({ ...prev, checkOut: value }))}
              testId="checkout_input"
            />
          </div>

          <div className="grid-3">
            <Stepper
              label={t.adults}
              value={criteria.adults}
              onDecrease={() => setCriteria((prev) => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
              onIncrease={() => setCriteria((prev) => ({ ...prev, adults: prev.adults + 1 }))}
              testId="adults_stepper"
              decrementTestId="adults_decrease"
              incrementTestId="adults_increase"
            />

            <Stepper
              label={t.children}
              value={criteria.children}
              onDecrease={() => setCriteria((prev) => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
              onIncrease={() => setCriteria((prev) => ({ ...prev, children: prev.children + 1 }))}
              testId="children_stepper"
              decrementTestId="children_decrease"
              incrementTestId="children_increase"
            />

            <Stepper
              label={t.rooms}
              value={criteria.rooms}
              onDecrease={() => setCriteria((prev) => ({ ...prev, rooms: Math.max(1, prev.rooms - 1) }))}
              onIncrease={() => setCriteria((prev) => ({ ...prev, rooms: prev.rooms + 1 }))}
              testId="rooms_stepper"
              decrementTestId="rooms_decrease"
              incrementTestId="rooms_increase"
            />
          </div>

          {error ? <p className="error-message">{error}</p> : null}

          <button className="primary-button" data-testid="search_hotels_button"onClick={() => onSearch()}>
            {t.searchHotels}
          </button>
        </div>
      </Card>
    </Shell>
  );
}

function ResultsView({
  t,
  criteria,
  results,
  onBack,
  onSelectHotel,
  sortBy,
  setSortBy,
  currency,
  language,
  filters,
  setFilters,
  onApplyFilters
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Shell>
      <div className="toolbar">
        <BackButton onClick={onBack} />

        <div className="toolbar-right">
          <button
            type="button"
            className="secondary-button filter-toggle-button"
            onClick={() => setShowFilters((prev) => !prev)}
            data-testid="filters_button"
          >
            <SlidersHorizontal size={16} />
            {showFilters ? t.hideFilters : t.filters}
          </button>

          <label className="sort-control">
            <SlidersHorizontal size={16} />
            <span>{t.sortBy}</span>

            <select
              className="control"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                onApplyFilters(event.target.value);
              }}
              data-testid="sort_by_select"
            >
              <option value="price_asc">{t.priceAsc}</option>
              <option value="price_desc">{t.priceDesc}</option>
              <option value="rating_desc">{t.ratingDesc}</option>
            </select>
          </label>
        </div>
      </div>

      {showFilters ? (
        <Card className="card-body filters-panel">
          <div className="grid-3">
            <label>
              <span className="input-label">{t.minRating}</span>
              <select
                className="control"
                value={filters.minRating}
                onChange={(event) => setFilters((prev) => ({ ...prev, minRating: event.target.value }))}
                data-testid="min_rating_filter"
              >
                <option value="">{t.all}</option>
                <option value="8">8.0+</option>
                <option value="8.5">8.5+</option>
                <option value="9">9.0+</option>
              </select>
            </label>

            <label>
              <span className="input-label">{t.minPrice}</span>
              <input
                className="control"
                type="number"
                value={filters.minPrice}
                onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
                data-testid="min_price_filter"
              />
            </label>

            <label>
              <span className="input-label">{t.maxPrice}</span>
              <input
                className="control"
                type="number"
                value={filters.maxPrice}
                onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
                data-testid="max_price_filter"
              />
            </label>
          </div>

          <div className="grid-2 filters-second-row">
            <label>
              <span className="input-label">{t.propertyType}</span>
              <select
                className="control"
                value={filters.propertyType}
                onChange={(event) => setFilters((prev) => ({ ...prev, propertyType: event.target.value }))}
                data-testid="property_type_filter"
              >
                <option value="">{t.all}</option>
                <option value="Hotel">{t.hotelType}</option>
                <option value="Resort">{t.resortType}</option>
                <option value="Business hotel">{t.businessType}</option>
                <option value="Apart-hotel">{t.apartHotelType}</option>
              </select>
            </label>

            <label>
              <span className="input-label">{t.amenity}</span>
              <select
                className="control"
                value={filters.amenity}
                onChange={(event) => setFilters((prev) => ({ ...prev, amenity: event.target.value }))}
                data-testid="amenity_filter"
              >
                <option value="">{t.all}</option>
                <option value="Wi-Fi">{t.wifiAmenity}</option>
                <option value="Desayuno">{t.breakfastAmenity}</option>
                <option value="Playa">{t.beachAmenity}</option>
                <option value="Alberca">{t.poolAmenity}</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => onApplyFilters(sortBy)}
            data-testid="apply_filters_button"
          >
            {t.applyFilters}
          </button>
        </Card>
      ) : null}

      <p className="criteria-line">
        {criteria.destination} · {criteria.checkIn} a {criteria.checkOut} · {criteria.adults}{' '}
        {t.adults.toLowerCase()} · {criteria.children} {t.children.toLowerCase()} · {criteria.rooms}{' '}
        {t.rooms.toLowerCase()}
      </p>

      {results.length === 0 ? (
        <Card className="card-body">{t.noHotels}</Card>
      ) : (
        <div className="results-list">
          {results.map((hotel) => (
            <Card key={hotel.hotelId} className="result-card">
              <img src={hotel.imageUrl} alt={hotel.hotelName} className="hotel-image" />

              <div className="result-content">
                <div className="result-top">
                  <div>
                    <h3>{hotel.hotelName}</h3>
                    <p className="muted">
                      <MapPin size={14} /> {hotel.city}, {hotel.country}
                    </p>
                    <Amenities amenities={hotel.amenities} />
                  </div>

                  <div className="rating-box">
                    <span>
                      <Star size={14} /> {hotel.rating}
                    </span>
                  </div>
                </div>

                <p className="hotel-description">{hotel.description}</p>

                <div className="result-bottom">
                  <div>
                    <small>Desde</small>
                    <div className="price">{formatMoney(hotel.minRate, currency, language)}</div>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() => onSelectHotel(hotel)}
                    data-testid={`select_hotel_${hotel.hotelId}`}
                  >
                    {t.viewRooms}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Shell>
  );
}

function DetailView({ t, hotel, rooms, onBack, onSelectRoom, currency, language }) {
  if (!hotel) return null;

  return (
    <Shell>
      <BackButton onClick={onBack} />

      <Card className="result-card">
        <img src={hotel.imageUrl} alt={hotel.hotelName} className="hotel-image" />

        <div className="result-content">
          <h2>{hotel.hotelName}</h2>
          <p className="muted">
            <MapPin size={14} /> {hotel.city}, {hotel.country}
          </p>
          <Amenities amenities={hotel.amenities} />
          <p className="hotel-description">{hotel.description}</p>
        </div>
      </Card>

      <div className="results-list">
        {rooms.map((room) => (
          <Card key={room.roomTypeId} className="card-body">
            <h3>{room.name}</h3>
            <p>
              {room.bedType} · {room.boardPlan}
            </p>
            <p>{room.cancellationPolicy}</p>
            <p>
              {room.capacityAdults} {t.adults.toLowerCase()} · {room.capacityChildren}{' '}
              {t.children.toLowerCase()}
            </p>

            <div className="result-bottom">
              <div className="price">{formatMoney(room.nightlyRate, currency, language)}</div>

              <button className="primary-button" onClick={() => onSelectRoom(room)}>
                {t.screens.checkout}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

function CheckoutView({ setScreen, guests, checkIn, checkOut, hotel, room, token, onConfirmed, t, currency, language }) {
  const [paymentMethod] = useState('sandbox_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [buyer, setBuyer] = useState({
    reservationHolder: '',
    buyerName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  if (!hotel || !room) {
    return (
      <Shell>
        <Card className="card-body">{t.selectedRoomFallback}</Card>
      </Shell>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = Number(room.nightlyRate) * nights * guests.rooms;
  const taxes = Math.round(subtotal * 0.16 * 100) / 100;
  const total = subtotal + taxes;

  function updateBuyer(field, value) {
    setBuyer((prev) => ({ ...prev, [field]: value }));
  }

  function validateForm() {
    if (!buyer.reservationHolder.trim()) return t.validationReservationHolder;
    if (!buyer.buyerName.trim()) return t.validationBuyerName;
    if (!buyer.email.trim()) return t.validationEmail;
    if (!buyer.phone.trim()) return t.validationPhone;
    if (!buyer.street.trim()) return t.validationStreet;
    if (!buyer.city.trim()) return t.validationCity;
    if (!buyer.state.trim()) return t.validationState;
    if (!buyer.postalCode.trim()) return t.validationPostalCode;
    if (!buyer.country.trim()) return t.validationCountry;
    if (!buyer.cardholderName.trim()) return t.validationCardholder;
    if (!buyer.cardNumber.trim()) return t.validationCardNumber;
    if (!buyer.expiryMonth.trim()) return t.validationExpiryMonth;
    if (!buyer.expiryYear.trim()) return t.validationExpiryYear;
    if (!buyer.cvv.trim()) return t.validationCvv;
    if (!/^\d{16}$/.test(buyer.cardNumber.replace(/\s/g, ''))) return t.validationCardNumberFormat;
    if (!/^\d{3,4}$/.test(buyer.cvv)) return t.validationCvvFormat;
    return '';
  }

  async function pay() {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await createReservation(token, {
        hotelId: hotel.hotelId,
        roomTypeId: room.roomTypeId,
        checkIn,
        checkOut,
        adults: guests.adults,
        children: guests.children,
        rooms: guests.rooms,
        paymentMethod,
        buyer
      });

      onConfirmed(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <BackButton onClick={() => setScreen('detail')} label={t.screens.detail} />

      <Card data-testid="checkout_summary" className="card-body">
        <h2>{t.checkoutTitle}</h2>

        <div className="info-list">
          <p>
            <b>{t.hotel}:</b> {hotel.hotelName}
          </p>
          <p>
            <b>{t.room}:</b> {room.name}
          </p>
          <p>
            <b>{t.dates}:</b> {checkIn} – {checkOut}
          </p>
          <p>
            <b>{t.guests}:</b> {guests.adults} {t.adults.toLowerCase()}, {guests.children}{' '}
            {t.children.toLowerCase()}, {guests.rooms} {t.rooms.toLowerCase()}
          </p>
        </div>

        <div className="price-box">
          <div>
            <span>
              {nights} {t.nights}
            </span>
            <b>{formatMoney(subtotal, currency, language)}</b>
          </div>

          <div>
            <span>{t.taxes}</span>
            <b>{formatMoney(taxes, currency, language)}</b>
          </div>

          <div className="total">
            <span>{t.total}</span>
            <b data-testid="checkout_total_amount">{formatMoney(total, currency, language)}</b>
          </div>
        </div>

        <p data-testid="cancellation_policy_text" className="policy">
          {room.ratePlanCode}: {t.cancellationPolicyBackend}
        </p>

        <div className="checkout-section">
          <h3>{t.reservationHolderSection}</h3>
          <div className="form-stack">
            <input
              className="control"
              placeholder={t.reservationHolder}
              value={buyer.reservationHolder}
              onChange={(event) => updateBuyer('reservationHolder', event.target.value)}
              data-testid="reservation_holder_input"
            />
          </div>
        </div>

        <div className="checkout-section">
          <h3>{t.buyerDataSection}</h3>
          <div className="form-stack">
            <input
              className="control"
              placeholder={t.buyerName}
              value={buyer.buyerName}
              onChange={(event) => updateBuyer('buyerName', event.target.value)}
              data-testid="buyer_name_input"
            />

            <input
              className="control"
              placeholder={t.email}
              value={buyer.email}
              onChange={(event) => updateBuyer('email', event.target.value)}
              data-testid="buyer_email_input"
            />

            <input
              className="control"
              placeholder={t.phone}
              value={buyer.phone}
              onChange={(event) => updateBuyer('phone', event.target.value)}
              data-testid="buyer_phone_input"
            />
          </div>
        </div>

        <div className="checkout-section">
          <h3>{t.billingAddressSection}</h3>
          <div className="form-stack">
            <input
              className="control"
              placeholder={t.street}
              value={buyer.street}
              onChange={(event) => updateBuyer('street', event.target.value)}
              data-testid="billing_street_input"
            />

            <input
              className="control"
              placeholder={t.city}
              value={buyer.city}
              onChange={(event) => updateBuyer('city', event.target.value)}
              data-testid="billing_city_input"
            />

            <input
              className="control"
              placeholder={t.state}
              value={buyer.state}
              onChange={(event) => updateBuyer('state', event.target.value)}
              data-testid="billing_state_input"
            />

            <input
              className="control"
              placeholder={t.postalCode}
              value={buyer.postalCode}
              onChange={(event) => updateBuyer('postalCode', event.target.value)}
              data-testid="billing_postal_code_input"
            />

            <input
              className="control"
              placeholder={t.country}
              value={buyer.country}
              onChange={(event) => updateBuyer('country', event.target.value)}
              data-testid="billing_country_input"
            />
          </div>
        </div>

        <div className="checkout-section">
          <h3>{t.paymentDataSection}</h3>
          <div className="form-stack">
            <input
              className="control"
              placeholder={t.cardholderName}
              value={buyer.cardholderName}
              onChange={(event) => updateBuyer('cardholderName', event.target.value)}
              data-testid="cardholder_name_input"
            />

            <input
              className="control"
              placeholder={t.cardNumber}
              value={buyer.cardNumber}
              onChange={(event) => updateBuyer('cardNumber', event.target.value.replace(/[^\d\s]/g, ''))}
              maxLength={19}
              data-testid="card_number_input"
            />

            <div className="grid-3">
              <input
                className="control"
                placeholder={t.expiryMonth}
                value={buyer.expiryMonth}
                onChange={(event) => updateBuyer('expiryMonth', event.target.value.replace(/\D/g, ''))}
                maxLength={2}
                data-testid="expiry_month_input"
              />

              <input
                className="control"
                placeholder={t.expiryYear}
                value={buyer.expiryYear}
                onChange={(event) => updateBuyer('expiryYear', event.target.value.replace(/\D/g, ''))}
                maxLength={4}
                data-testid="expiry_year_input"
              />

              <input
                className="control"
                placeholder={t.cvv}
                value={buyer.cvv}
                onChange={(event) => updateBuyer('cvv', event.target.value.replace(/\D/g, ''))}
                maxLength={4}
                data-testid="cvv_input"
              />
            </div>
          </div>
        </div>

        {error ? <p className="error-message">{error}</p> : null}

        <button className="primary-button" data-testid="pay_now_button" onClick={pay} disabled={loading}>
          {loading ? t.processing : t.payNow}
        </button>
      </Card>
    </Shell>
  );
}

function ConfirmationView({ t, confirmation, onGoReservations }) {
  if (!confirmation) return null;

  const statusMap = {
    confirmed: { icon: <CheckCircle2 size={20} />, text: t.approved },
    pending: { icon: <ShieldCheck size={20} />, text: t.pending },
    failed: { icon: <XCircle size={20} />, text: t.failed }
  };

  const current = statusMap[confirmation.status] || statusMap.confirmed;

  return (
    <Shell>
      <Card className="card-body">
        <div className="confirmation-box">
          {current.icon}
          <h2>{current.text}</h2>
          <p>
            Locator: <b>{confirmation.locator}</b>
          </p>
          <p>ID: {confirmation.reservationId}</p>
        </div>

        <button className="primary-button" onClick={onGoReservations}>
          {t.myReservations}
        </button>
      </Card>
    </Shell>
  );
}

function ReservationsView({ t, reservations, onRefresh, token, currency, language }) {
  async function handleCancel(reservationId) {
    await cancelReservation(token, reservationId, 'Cambio de plan');
    await onRefresh();
  }

  return (
    <Shell>
      <Card className="card-body">
        <h2>{t.myReservations}</h2>
      </Card>

      <div className="results-list">
        {reservations.map((reservation) => (
          <Card key={reservation.reservationId} className="card-body">
            <h3>{reservation.hotelName}</h3>
            <p>{reservation.roomName}</p>
            <p>
              {reservation.checkIn} → {reservation.checkOut}
            </p>
            <p>{reservation.status}</p>
            <p>{formatMoney(reservation.totalAmount, currency || reservation.currency, language)}</p>

            {reservation.status !== 'cancelled' ? (
              <button className="secondary-button" onClick={() => handleCancel(reservation.reservationId)}>
                {t.cancel}
              </button>
            ) : (
              <p className="success-message">{t.cancelled}</p>
            )}
          </Card>
        ))}
      </div>
    </Shell>
  );
}

export default function App() {
  const [screen, setScreen] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? 'search' : 'login';
  });

  const [language, setLanguage] = useState('es');
  const [currency, setCurrency] = useState('MXN');

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const [authError, setAuthError] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [results, setResults] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [filters, setFilters] = useState({
  minRating: '',
  minPrice: '',
  maxPrice: '',
  propertyType: '',
  amenity: ''
});

  const [criteria, setCriteria] = useState({
    destination: '',
    checkIn: '2026-06-12',
    checkOut: '2026-06-15',
    adults: 2,
    children: 1,
    rooms: 1
  });

  const t = useMemo(() => copy[language], [language]);

  const enabledScreens = {
    search: Boolean(token),
    results: Boolean(token) && results.length >= 0,
    detail: Boolean(token) && Boolean(hotel),
    checkout: Boolean(token) && Boolean(selectedRoom),
    confirmation: Boolean(token) && Boolean(confirmation),
    reservations: Boolean(token)
  };

  useEffect(() => {
    if (!token) return;

    fetchDestinations()
      .then((data) => {
        setDestinations(data.destinations);

        if (data.destinations.length > 0) {
          setCriteria((prev) => ({
            ...prev,
            destination: prev.destination || data.destinations[0].city
          }));
        }
      })
      .catch((error) => {
        setSearchError(error.message);
      });
  }, [token]);

  useEffect(() => {
    if (screen === 'reservations' && token) {
      loadReservations();
    }
  }, [screen, token]);

  async function handleLogin(form) {
    try {
      setAuthError('');

      const data = await loginUser(form);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToken(data.token);
      setCurrentUser(data.user);
      setScreen('search');
    } catch (error) {
      setAuthError(error.message);
    }
  }

  async function handleRegister(form) {
    try {
      setAuthError('');

      const data = await registerUser(form);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToken(data.token);
      setCurrentUser(data.user);
      setScreen('search');
    } catch (error) {
      setAuthError(error.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken('');
    setCurrentUser(null);
    setReservations([]);
    setConfirmation(null);
    setSelectedRoom(null);
    setHotel(null);
    setRooms([]);
    setResults([]);
    setSearchError('');
    setAuthError('');
    setScreen('login');
  }

  async function handleSearch(customSortBy = sortBy) {
  try {
    setSearchError('');

    const safeSortBy =
      typeof customSortBy === 'string'
        ? customSortBy
        : sortBy;

    const payload = {
      ...criteria,
      sortBy: safeSortBy
    };

    if (filters.minRating) payload.minRating = Number(filters.minRating);
    if (filters.minPrice) payload.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) payload.maxPrice = Number(filters.maxPrice);
    if (filters.propertyType) payload.propertyType = filters.propertyType;
    if (filters.amenity) payload.amenity = filters.amenity;

    const data = await searchHotels(payload);

    setResults(data.results);
    setScreen('results');
  } catch (error) {
    setSearchError(error.message);
  }
}

  async function handleSelectHotel(selectedHotel) {
    try {
      setSearchError('');
      setHotel(selectedHotel);
      setSelectedRoom(null);
      setRooms([]);

      const data = await fetchAvailability(selectedHotel.hotelId, {
        checkIn: criteria.checkIn,
        checkOut: criteria.checkOut,
        adults: criteria.adults,
        children: criteria.children,
        rooms: criteria.rooms
      });

      setRooms(data.rooms);
      setScreen('detail');
    } catch (error) {
      setSearchError(error.message);
    }
  }

  async function loadReservations() {
    if (!token) return;

    const data = await fetchReservations(token);
    setReservations(data.reservations);
  }

  return (
    <div className="app">
      {token ? (
        <>
          <Header screen={screen} setScreen={setScreen} enabledScreens={enabledScreens} t={t} />

          <div className="topbar-actions">
            <LocaleSelector
              language={language}
              setLanguage={setLanguage}
              currency={currency}
              setCurrency={setCurrency}
            />

            <div className="session-box">
              {currentUser ? <span className="session-user">{currentUser.name}</span> : null}

              <button
                className="secondary-button logout-button"
                onClick={handleLogout}
                type="button"
                data-testid="logout_button"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="topbar-actions">
          <LocaleSelector
            language={language}
            setLanguage={setLanguage}
            currency={currency}
            setCurrency={setCurrency}
          />
        </div>
      )}

      {screen === 'login' && (
        <LoginView
          t={t}
          onLogin={handleLogin}
          onGoRegister={() => {
            setAuthError('');
            setScreen('register');
          }}
          error={authError}
        />
      )}

      {screen === 'register' && (
        <RegisterView
          t={t}
          onRegister={handleRegister}
          onGoLogin={() => {
            setAuthError('');
            setScreen('login');
          }}
          error={authError}
        />
      )}

      {token && screen === 'search' && (
        <SearchView
          t={t}
          criteria={criteria}
          setCriteria={setCriteria}
          destinations={destinations}
          onSearch={handleSearch}
          error={searchError}
        />
      )}

      {token && screen === 'results' && (
        <ResultsView
        t={t}
        criteria={criteria}
        results={results}
        onBack={() => setScreen('search')}
        onSelectHotel={handleSelectHotel}
        sortBy={sortBy}
        setSortBy={setSortBy}
        currency={currency}
        language={language}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleSearch}
      />
      )}

      {token && screen === 'detail' && (
        <DetailView
          t={t}
          hotel={hotel}
          rooms={rooms}
          onBack={() => setScreen('results')}
          onSelectRoom={(room) => {
            setSelectedRoom(room);
            setScreen('checkout');
          }}
          currency={currency}
          language={language}
        />
      )}

      {token && screen === 'checkout' && (
        <CheckoutView
          setScreen={setScreen}
          guests={criteria}
          checkIn={criteria.checkIn}
          checkOut={criteria.checkOut}
          hotel={hotel}
          room={selectedRoom}
          token={token}
          onConfirmed={(data) => {
            setConfirmation(data);
            setScreen('confirmation');
          }}
          t={t}
          currency={currency}
          language={language}
        />
      )}

      {token && screen === 'confirmation' && (
        <ConfirmationView
          t={t}
          confirmation={confirmation}
          onGoReservations={() => setScreen('reservations')}
        />
      )}

      {token && screen === 'reservations' && (
        <ReservationsView
          t={t}
          reservations={reservations}
          onRefresh={loadReservations}
          token={token}
          currency={currency}
          language={language}
        />
      )}

      <footer className="footer">{t.footer}</footer>
    </div>
  );
}