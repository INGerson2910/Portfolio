import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// ---------------------------------------------------------------------------
// AJUSTA ESTOS VALORES A TU SUT (Node.js/Express + PostgreSQL)
// ---------------------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const USER_EMAIL = __ENV.TEST_EMAIL || 'test@example.com';
const USER_PASSWORD = __ENV.TEST_PASSWORD || 'Password123!';
// Endpoints reales del backend
const LOGIN_PATH = '/api/v1/auth/login';
const LIST_PATH = '/api/v1/destinations';

const loginDuration = new Trend('login_duration');
const listDuration = new Trend('list_duration');
const businessErrors = new Rate('business_errors');

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      tags: { scenario: 'smoke' },
    },
    load: {
      executor: 'ramping-vus',
      startTime: '35s',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '20s', target: 0 },
      ],
      tags: { scenario: 'load' },
    },
  },
  // Los thresholds son lo que convierte esto en una prueba con criterio
  // de aceptacion, no en un generador de trafico. k6 sale con codigo 99
  // si alguno falla, lo que hace que el pipeline falle.
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    login_duration: ['p(95)<1000'],
    list_duration: ['p(95)<600'],
    business_errors: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

function login() {
  const res = http.post(
    `${BASE_URL}${LOGIN_PATH}`,
    JSON.stringify({ email: USER_EMAIL, password: USER_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'POST /auth/login' } }
  );

  loginDuration.add(res.timings.duration);

  const ok = check(res, {
    'login responde 200': (r) => r.status === 200,
    'login devuelve token JWT': (r) => {
      try {
        const t = r.json('token') || r.json('accessToken');
        return typeof t === 'string' && t.split('.').length === 3;
      } catch {
        return false;
      }
    },
  });

  businessErrors.add(!ok);
  if (!ok) return null;

  return res.json('token') || res.json('accessToken');
}

export default function () {
  let token;

  group('autenticacion', () => {
    token = login();
  });

  if (!token) {
    sleep(1);
    return;
  }

  group('consulta autenticada', () => {
    const res = http.get(`${BASE_URL}${LIST_PATH}`, {
      headers: { Authorization: `Bearer ${token}` },
      tags: { name: 'GET /products' },
    });

    listDuration.add(res.timings.duration);

    const ok = check(res, {
      'listado responde 200': (r) => r.status === 200,
      'listado devuelve arreglo': (r) => {
        try {
          const body = r.json();
          return Array.isArray(body) || Array.isArray(body.data);
        } catch {
          return false;
        }
      },
    });

    businessErrors.add(!ok);
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'k6-summary.json': JSON.stringify(data, null, 2),
    stdout: '\n',
  };
}
