import { RymiClient } from '../client';

export interface AgentTemplateSummary {
    id?: string;
    slug?: string;
    label?: string;
    description?: string;
    icon?: string;
    color?: string;
    defaults?: Record<string, any>;
    [key: string]: any;
}

export class TemplatesResource {
    constructor(private client: RymiClient) {}

    /**
     * List published agent templates available to the current tenant. Use a
     * template's `defaults` as the starting config for create_agent.
     */
    public async list(): Promise<{ templates: AgentTemplateSummary[]; source?: string }> {
        return this.client.get('/agent-templates');
    }
}
