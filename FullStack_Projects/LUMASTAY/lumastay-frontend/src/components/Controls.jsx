import { ArrowLeft, CalendarDays, ChevronDown, Search } from 'lucide-react';

export function Field({ icon: Icon, label, value, testId }) {
  return (
    <div data-testid={testId} className="field">
      <div className="field-label">
        <Icon size={16} /> {label}
      </div>
      <div className="field-value">{value}</div>
    </div>
  );
}

export function Stepper({ label, value, onDecrease, onIncrease, testId, decrementTestId, incrementTestId }) {
  return (
    <div data-testid={testId} className="field">
      <div className="field-label">{label}</div>
      <div className="stepper">
        <button data-testid={decrementTestId} onClick={onDecrease} className="stepper-button" aria-label={`Disminuir ${label}`}>
          −
        </button>
        <div className="stepper-value">{value}</div>
        <button data-testid={incrementTestId} onClick={onIncrease} className="stepper-button" aria-label={`Incrementar ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}

export function DestinationCombobox({ value, destinations, onChange, label = 'Destino' }) {
  return (
    <label className="field">
      <div className="field-label">
        <Search size={16} /> {label}
      </div>
      <div className="select-wrapper">
        <select
          data-testid="destination_combobox"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="control"
        >
          {destinations.map((destination) => (
            <option key={`${destination.city}-${destination.country}`} value={destination.city}>
              {destination.city}, {destination.country}
            </option>
          ))}
        </select>
        <ChevronDown className="select-icon" size={18} />
      </div>
    </label>
  );
}

export function DatePickerField({ label, value, onChange, min, testId }) {
  return (
    <label className="field">
      <div className="field-label">
        <CalendarDays size={16} /> {label}
      </div>
      <input
        data-testid={testId}
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="control"
      />
    </label>
  );
}

export function BackButton({ onClick, label = 'Volver' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="back_button"
      className="back-button"
      aria-label={label}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}

export function LocaleSelector({ language, setLanguage, currency, setCurrency }) {
  return (
    <div className="locale-selector">
      <select
        data-testid="language_select"
        className="control"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>

      <select
        data-testid="currency_select"
        className="control"
        value={currency}
        onChange={(event) => setCurrency(event.target.value)}
      >
        <option value="MXN">MXN</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
    </div>
  );
}