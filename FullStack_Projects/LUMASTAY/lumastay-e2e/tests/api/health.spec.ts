import { test, expect } from '@playwright/test';

test('TC-API-008: GET /health returns the documented healthy response without authorization', {
    annotation: { type: 'test-case-id', description: 'TC-API-008' },
}, async ({ request }) => {
    const response = await request.get('/health');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    await expect(response.json()).resolves.toEqual({
        status: 'ok',
        service: 'lumastay-backend',
    });
});