import { RymiClient } from '../client';

/**
 * Confirm a shared-test-line destination. This never touches login: a confirmed
 * number only lets Rymi's test lines ring it, and it is not consent to future calls.
 *
 * Two methods. `start` returns a WhatsApp link: the phone confirms by sending
 * `message_text`. `requestCode` sends a code to the phone: a person types it at
 * `entry_url` while signed in to Studio. No secret key can submit a code.
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

export interface PhoneConfirmationCodeRequest {
    sent: boolean;
    confirmed: boolean;
    phone: string;
    phone_masked?: string;
    channel?: 'whatsapp';
    expires_in?: number;
    resend_after?: number;
    max_attempts?: number;
    entry_url?: string;
}

export interface PhoneConfirmationPendingCode {
    status: 'awaiting_entry';
    channel: 'whatsapp';
    expires_in: number;
    attempts_left: number;
    resend_after: number;
    entry_url: string;
}

export interface PhoneConfirmationStatus {
    confirmed: boolean;
    /** Present while a code is waiting to be entered. */
    code?: PhoneConfirmationPendingCode;
}

export class PhoneConfirmationResource {
    constructor(private client: RymiClient) {}

    /** Open a WhatsApp confirmation for `phone`, or report that it is already confirmed. */
    public async start(data: { phone: string }): Promise<PhoneConfirmationStart> {
        return this.client.post<PhoneConfirmationStart>('/phone-confirmation/start', data);
    }

    /** Send a code to `phone` on WhatsApp. Secret keys only. The code is never returned. */
    public async requestCode(data: { phone: string }): Promise<PhoneConfirmationCodeRequest> {
        return this.client.post<PhoneConfirmationCodeRequest>('/phone-confirmation/request-code', data);
    }

    /** Whether this account has confirmed `phone` for shared test lines, and any code still waiting. */
    public async status(phone: string): Promise<PhoneConfirmationStatus> {
        return this.client.get<PhoneConfirmationStatus>(`/phone-confirmation/status?phone=${encodeURIComponent(phone)}`);
    }
}
