DROP TABLE IF EXISTS reservation_events CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS inventories CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hotels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  zone TEXT,
  address TEXT,
  property_type TEXT NOT NULL DEFAULT 'Hotel',
  description TEXT,
  stars INT,
  rating NUMERIC(2,1),
  review_count INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  image_url TEXT,
  amenities TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE room_types (
  id TEXT PRIMARY KEY,
  hotel_id TEXT NOT NULL REFERENCES hotels(id),
  name TEXT NOT NULL,
  bed_type TEXT NOT NULL DEFAULT 'King',
  board_plan TEXT NOT NULL DEFAULT 'Solo habitación',
  cancellation_policy TEXT NOT NULL DEFAULT 'Flexible',
  capacity_adults INT NOT NULL DEFAULT 2,
  capacity_children INT NOT NULL DEFAULT 0,
  base_rate NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MXN',
  rate_plan_code TEXT NOT NULL DEFAULT 'FLEX'
);

CREATE TABLE inventories (
  id BIGSERIAL PRIMARY KEY,
  room_type_id TEXT NOT NULL REFERENCES room_types(id),
  inventory_date DATE NOT NULL,
  available_units INT NOT NULL,
  rate_override NUMERIC(12,2),
  UNIQUE(room_type_id, inventory_date)
);

CREATE TABLE reservations (
  id TEXT PRIMARY KEY,
  locator TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  hotel_id TEXT NOT NULL REFERENCES hotels(id),
  room_type_id TEXT NOT NULL REFERENCES room_types(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INT NOT NULL DEFAULT 1,
  children INT NOT NULL DEFAULT 0,
  rooms INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL,
  rate_plan_code TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  taxes NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MXN',
  refund_amount NUMERIC(12,2),
  reservation_holder TEXT,
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  billing_street TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_postal_code TEXT,
  billing_country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  reservation_id TEXT NOT NULL REFERENCES reservations(id),
  amount NUMERIC(12,2) NOT NULL,
  provider TEXT NOT NULL DEFAULT 'sandbox',
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reservation_events (
  id BIGSERIAL PRIMARY KEY,
  reservation_id TEXT NOT NULL REFERENCES reservations(id),
  event_type TEXT NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_hotels_status_city ON hotels(status, city);
CREATE INDEX idx_inventory_room_date ON inventories(room_type_id, inventory_date);
CREATE INDEX idx_reservations_user ON reservations(user_id);