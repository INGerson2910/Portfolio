const API_BASE_URL = 'http://192.168.3.8:4000/api/v1';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const details = data?.error?.details;
    const firstDetail = Array.isArray(details) && details.length > 0
      ? details[0]?.message
      : null;

    throw new Error(firstDetail || data?.error?.message || 'Request failed');
  }

  return data;
}

export async function loginUser(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function fetchDestinations() {
  return request('/destinations');
}

export async function searchHotels(payload) {
  return request('/search', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function fetchAvailability(hotelId, criteria) {
  const query = new URLSearchParams(criteria).toString();
  return request(`/hotels/${hotelId}/availability?${query}`);
}

export async function createReservation(token, payload) {
  return request('/reservations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
}

export async function fetchReservations(token) {
  return request('/reservations', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function cancelReservation(token, reservationId, reason) {
  return request(`/reservations/${reservationId}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ reason })
  });
}