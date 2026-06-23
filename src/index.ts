import { RymiClient, ClientOptions, RymiError } from './client';
import { AgentsResource } from './resources/agents';
import { CallsResource } from './resources/calls';
import { DncResource } from './resources/dnc';
import { NumbersResource } from './resources/numbers';
import { WebhooksResource } from './resources/webhooks';
import { KeysResource } from './resources/keys';
import { TelephonyResource } from './resources/telephony';
import { BillingResource } from './resources/billing';
import { TemplatesResource } from './resources/templates';

export class Rymi {
    private client: RymiClient;

    public agents: AgentsResource;
    public calls: CallsResource;
    public dnc: DncResource;
    public numbers: NumbersResource;
    public webhooks: WebhooksResource;
    public keys: KeysResource;
    public telephony: TelephonyResource;
    public billing: BillingResource;
    public templates: TemplatesResource;

    constructor(options?: ClientOptions) {
        this.client = new RymiClient(options);

        // Initialize API Sub-modules
        this.agents = new AgentsResource(this.client);
        this.calls = new CallsResource(this.client);
        this.dnc = new DncResource(this.client);
        this.numbers = new NumbersResource(this.client);
        this.webhooks = new WebhooksResource(this.client);
        this.keys = new KeysResource(this.client);
        this.telephony = new TelephonyResource(this.client);
        this.billing = new BillingResource(this.client);
        this.templates = new TemplatesResource(this.client);
    }
}

// Re-export common types
export * from './client';
export * from './resources/agents';
export * from './resources/calls';
export * from './resources/dnc';
export * from './resources/numbers';
export * from './resources/webhooks';
export * from './resources/keys';
export * from './resources/telephony';
export * from './resources/billing';
export * from './resources/templates';

// Re-export the curated public type surface (see @rymi/sdk-types).
export * from '@rymi/sdk-types';
export default Rymi;
