import * as crypto from 'crypto';
import { RymiClient } from '../client';

export interface WebhookRecord {
    id: string;
    url: string;
    events: string[];
    alert_email?: string | null;
    created_at?: string;
}

function buildQuery(params: Record<string, any>) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) sp.set(k, String(v));
    }
    const q = sp.toString();
    return q ? `?${q}` : '';
}

export class WebhooksResource {
    constructor(private client: RymiClient) {}

    /** List registered webhook endpoints. The signing secret is never returned. */
    public async list(params: { limit?: number; offset?: number } = {}): Promise<{ webhooks: WebhookRecord[]; total: number; offset: number; limit: number }> {
        return this.client.get(`/webhooks${buildQuery(params)}`);
    }

    /** Register a webhook. `url` must be public https. `secret` must be 16–256 chars. */
    public async create(data: { url: string; events: string[]; secret: string; alert_email?: string }): Promise<{ status: 'registered' }> {
        return this.client.post('/webhooks', data);
    }

    /** Update a webhook. Only provided fields change. Pass `secret` to rotate it. */
    public async update(id: string, data: { url?: string; events?: string[]; secret?: string; alert_email?: string | null }): Promise<{ status: 'updated'; id: string }> {
        return this.client.patch(`/webhooks/${id}`, data);
    }

    /** Delete a webhook endpoint. */
    public async delete(id: string): Promise<{ status: 'deleted'; id: string }> {
        return this.client.delete(`/webhooks/${id}`);
    }
    /**
     * Verifies that a webhook received by your backend was genuinely dispatched by Rymi.
     * 
     * Rymi endpoints secure webhooks by computing an HMAC-SHA256 signature
     * of the raw JSON body concatenated with the timestamp, using your Webhook Secret.
     * 
     * @param payload The raw stringified JSON body of the webhook hook request.
     * @param signatureHeader The value of the `X-Rymi-Signature` header from the request.
     * @param timestampHeader The value of the `X-Rymi-Timestamp` header from the request.
     * @param webhookSecret Your project's unique Webhook Signing Secret (starts with `whsec_`)
     * @param toleranceMillis Allowed time difference in milliseconds to prevent replay attacks (default 5 mins)
     * 
     * @throws {Error} if the signature is invalid or if the timestamp exceeds the tolerance.
     */
    public verifySignature(
        payload: string,
        signatureHeader: string,
        timestampHeader: string,
        webhookSecret: string,
        toleranceMillis = 300000 // 5 minutes
    ): boolean {
        // 1. Check for Replay Attacks
        const timestamp = parseInt(timestampHeader, 10);
        if (isNaN(timestamp)) {
            throw new Error('Invalid Rymi-Timestamp header');
        }

        const now = Date.now();
        if (now - timestamp > toleranceMillis) {
            throw new Error('Webhook timestamp is too old. Possible replay attack.');
        }

        // 2. Prepare the verification string
        const signaturePayload = `${timestamp}.${payload}`;

        // 3. Compute the expected HMAC using the developer's Webhook Secret
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(signaturePayload, 'utf8')
            .digest('hex');

        // 4. Secure string comparison (constant-time to prevent timing attacks)
        try {
            const isValid = crypto.timingSafeEqual(
                Buffer.from(signatureHeader),
                Buffer.from(expectedSignature)
            );

            if (!isValid) {
                throw new Error('Invalid Webhook Signature. The secret might be incorrect.');
            }

            return true;
        } catch (err) {
            throw new Error('Invalid Webhook Signature. The secret might be incorrect.');
        }
    }
}
