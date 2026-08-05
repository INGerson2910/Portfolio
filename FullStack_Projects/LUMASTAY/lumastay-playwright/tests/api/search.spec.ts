import { test, expect } from '@playwright/test';
import type { SearchResponse } from '@models/lumastay.types';

test.describe('API', () => {
        test('POST /search returns available hotels for a destination', async ({ request }) =>{
        const searchResponse = await request.post('/api/v1/search', {
            data: {
                destination: "Buenos Aires",
                checkIn: "2026-09-15",
                checkOut: "2026-09-18",
                adults: 2
            }
        });

            expect(searchResponse.status()).toBe(200);
            const body = await searchResponse.json() as SearchResponse;
            expect(body.results.length).toBeGreaterThan(0);

            for(const hotel of body.results){
                expect(hotel.city).toBe("Buenos Aires");
            }

            for(const hotel of body.results){
                expect(hotel.available).toBe(true);
            }

            for(const hotel of body.results){
                const rate = Number(hotel.minRate)
                expect(rate).toBeGreaterThan(0);
            }
    });

    test('POST /search returns 400 when destination is missing', async ({ request }) => {
        const searchResponse = await request.post('/api/v1/search', {
            data: {
                checkIn: "2026-09-15",
                checkOut: "2026-09-18",
                adults: 2
            }
        });

        expect(searchResponse.status()).toBe(400);

        });

    test('POST /search returns 400 when checkOut is before checkIn', async ({ request }) => {
        const searchResponse = await request.post('/api/v1/search', {
            data: {
                destination: "Buenos Aires",
                checkIn: "2026-09-18",
                checkOut: "2026-09-15",
                adults: 2
            }
        });
        expect(searchResponse.status()).toBe(400)
    });


    test('POST /search returns 200 with empty results for unknown destination', async ({request}) => {
        const searchResponse = await request.post('/api/v1/search', {
            data: {
                destination: "Gotham City",
                checkIn: "2026-09-15",
                checkOut: "2026-09-18",
                adults: 2
            }
        });
        const body = (await searchResponse.json()) as SearchResponse;
        expect(searchResponse.status()).toBe(200)
        expect(body.results).toHaveLength(0);
    });

    test('POST /search returns 400 for an empty payload', async ({request}) => {
        const searchResponse = await request.post('/api/v1/search', {
            data: {}
        });
        expect(searchResponse.status()).toBe(400);
    });

})