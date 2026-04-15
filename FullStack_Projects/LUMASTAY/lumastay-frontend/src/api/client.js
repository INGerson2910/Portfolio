const API_BASE_URL = 'http://192.168.3.8:4000/api/v1';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Request failed');
  }

  return data;
}

export async function loginQa() {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'qa@lumastay.app',
      password: 'Password123!'
    })
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