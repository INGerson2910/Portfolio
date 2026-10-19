import { test, expect } from '@playwright/test';

type Destination = {
    city: string;
    country: string;
    hotelCount: number;
};

test('TC-API-009: GET /api/v1/destinations returns unique documented destinations without authorization', {
    annotation: { type: 'test-case-id', description: 'TC-API-009' },
}, async ({ request }) => {
    const response = await request.get('/api/v1/destinations');

    expect(response.status()).toBe(200);

    const body = await response.json() as { destinations: Destination[] };
    expect(Array.isArray(body.destinations)).toBe(true);
    expect(body.destinations.length).toBeGreaterThanOrEqual(1);

    for (const [index, destination] of body.destinations.entries()) {
        const label = `TC-API-009 destination[${index}] (${destination.city}, ${destination.country})`;

        expect(typeof destination.city, `${label}: city must be a string`).toBe('string');
        expect(destination.city.trim().length, `${label}: city must not be empty`).toBeGreaterThan(0);
        expect(typeof destination.country, `${label}: country must be a string`).toBe('string');
        expect(destination.country.trim().length, `${label}: country must not be empty`).toBeGreaterThan(0);
        expect(Number.isInteger(destination.hotelCount), `${label}: hotelCount must be an integer`).toBe(true);
        expect(destination.hotelCount, `${label}: hotelCount must be at least 1`).toBeGreaterThanOrEqual(1);
    }

    const firstIndexByPair = new Map<string, number>();
    const duplicatePairs: string[] = [];
    body.destinations.forEach(({ city, country }, index) => {
        const pair = JSON.stringify([city, country]);
        const firstIndex = firstIndexByPair.get(pair);

        if (firstIndex !== undefined) {
            duplicatePairs.push(`(${city}, ${country}) at indexes ${firstIndex} and ${index}`);
        } else {
            firstIndexByPair.set(pair, index);
        }
    });

    expect(duplicatePairs, `TC-API-009 duplicate city-country pairs: ${duplicatePairs.join('; ')}`).toHaveLength(0);
});

test('TC-API-010: destinations are ordered by city ascending', {
    annotation: { type: 'test-case-id', description: 'TC-API-010' },
}, async ({ request }) => {
    const response = await request.get('/api/v1/destinations');
    expect(response.status()).toBe(200);

    const body = await response.json() as { destinations: Destination[] };
    expect(Array.isArray(body.destinations), 'TC-API-010 response must contain a destinations array').toBe(true);
    expect(body.destinations.length, 'TC-API-010 requires multiple destinations to verify sorting').toBeGreaterThanOrEqual(2);

    const actualCities = body.destinations.map(({ city }) => city);
    const expectedCities = [...actualCities].sort((left, right) => left.localeCompare(right, 'es'));

    expect(
        actualCities,
        `TC-API-010 expected cities in ascending order. Received: ${JSON.stringify(actualCities)}; expected: ${JSON.stringify(expectedCities)}`
    ).toEqual(expectedCities);
});