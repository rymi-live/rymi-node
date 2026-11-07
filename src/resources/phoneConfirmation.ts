import { RymiClient } from '../client';

/**
 * Message-only confirmation for a shared-test-line destination.
 * `start` does not confirm the number. The phone confirms it by sending
 * `message_text` to Rymi on WhatsApp. `status` only reads that result.
 */
export interface PhoneConfirmationStart {
    confirmed: boolean;
    phone: string;
    wa_url?: string;
    message_text?: string;
    expires_in?: number;
    otp_template?: boolean;
    turnstile_site_key?: string;
}

export interface PhoneConfirmationStatus {
    confirmed: boolean;
}

export class PhoneConfirmationResource {
    constructor(private client: RymiClient) {}

    /** Open a confirmation request for `phone`, or report that it is already confirmed. */
    public async start(data: { phone: string }): Promise<PhoneConfirmationStart> {
        return this.client.post<PhoneConfirmationStart>('/phone-confirmation/start', data);
    }

    /** Whether this account has confirmed `phone` for shared test lines. */
    public async status(phone: string): Promise<PhoneConfirmationStatus> {
        return this.client.get<PhoneConfirmationStatus>(`/phone-confirmation/status?phone=${encodeURIComponent(phone)}`);
    }
}
