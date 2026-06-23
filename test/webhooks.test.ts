import { describe, it, expect } from 'vitest';
import { Rymi } from '../src/index';

describe('Webhooks Verify', () => {
    const rymi = new Rymi({ apiKey: 'mock' });

    it('should successfully verify a valid webhook signature', () => {
        const secret = 'whsec_test_secret';
        const payload = JSON.stringify({ type: 'call.ended', call_id: 'call_123' });
        const timestamp = Date.now().toString();

        // Generate valid signature exactly as our verifier does
        const crypto = require('crypto');
        const signaturePayload = `${timestamp}.${payload}`;
        const signature = crypto
            .createHmac('sha256', secret)
            .update(signaturePayload, 'utf8')
            .digest('hex');

        const isValid = rymi.webhooks.verifySignature(payload, signature, timestamp, secret);
        expect(isValid).toBe(true);
    });

    it('should reject a webhook if the signature does not match', () => {
        const secret = 'whsec_test_secret';
        const payload = JSON.stringify({ type: 'call.ended', call_id: 'call_123' });
        const timestamp = Date.now().toString();

        expect(() => {
            rymi.webhooks.verifySignature(payload, 'invalid_signature_f231f', timestamp, secret);
        }).toThrow('Invalid Webhook Signature');
    });

    it('should reject a webhook if the timestamp is beyond the tolerance (replay attack)', () => {
        const secret = 'whsec_test_secret';
        const payload = JSON.stringify({ type: 'call.ended', call_id: 'call_123' });
        
        // Timestamp from 10 minutes ago
        const oldTimestamp = (Date.now() - 600000).toString();

        const crypto = require('crypto');
        const signaturePayload = `${oldTimestamp}.${payload}`;
        const signature = crypto
            .createHmac('sha256', secret)
            .update(signaturePayload, 'utf8')
            .digest('hex');

        expect(() => {
            rymi.webhooks.verifySignature(payload, signature, oldTimestamp, secret);
        }).toThrow('Possible replay attack');
    });
});
