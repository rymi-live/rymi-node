import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rymi, apiErrorBody } from '../src/index';

global.fetch = vi.fn();
function mockJson(body: any, status = 200) {
    (global.fetch as any).mockResolvedValueOnce({
        ok: status < 400,
        status,
        statusText: 'Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => body,
    });
}

describe('PhoneConfirmationResource', () => {
    beforeEach(() => vi.clearAllMocks());

    it('start() POSTs the phone', async () => {
        mockJson({ confirmed: false, phone: '+919876543210', wa_url: 'https://wa.me/1', message_text: 'Confirm', expires_in: 600 });
        const rymi = new Rymi({ apiKey: 'rymi_test' });
        await rymi.phoneConfirmation.start({ phone: '+919876543210' });
        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.rymi.live/v1/phone-confirmation/start',
            expect.objectContaining({ method: 'POST', body: JSON.stringify({ phone: '+919876543210' }) }),
        );
    });

    it('status() GETs the encoded phone', async () => {
        mockJson({ confirmed: true });
        const rymi = new Rymi({ apiKey: 'rymi_test' });
        await expect(rymi.phoneConfirmation.status('+919876543210')).resolves.toEqual({ confirmed: true });
        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.rymi.live/v1/phone-confirmation/status?phone=%2B919876543210',
            expect.objectContaining({ method: 'GET' }),
        );
    });
});

describe('apiErrorBody', () => {
    it('prefers message over the HTTP reason in error', () => {
        expect(apiErrorBody({
            error: 'Conflict',
            message: 'Someone is already confirming this number. Try again in 10 minutes.',
            code: 'in_progress',
        }, 'Error')).toEqual({
            message: 'Someone is already confirming this number. Try again in 10 minutes.',
            code: 'in_progress',
        });
    });

    it('keeps error when the body has no message', () => {
        expect(apiErrorBody({ error: 'Agent not found', code: 'not_found' }, 'Error')).toEqual({
            message: 'Agent not found',
            code: 'not_found',
        });
    });
});
