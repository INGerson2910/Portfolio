import { test, expect } from '@playwright/test';
import type { DestinationResponse } from '../../src/types/lumastay.types';

test('GET /destinations returns a list of destinations', async ({ request }) => {
  const response = await request.get('/api/v1/destinations');

  expect(response.status()).toBe(200);

  const body = await response.json() as DestinationResponse;

  expect(body.destinations.length).toBeGreaterThan(0);
  
  const firstDestination = body.destinations[0];
  expect(firstDestination).toHaveProperty('city');
  expect(firstDestination).toHaveProperty('country');
  expect(firstDestination).toHaveProperty('hotelCount');
});
