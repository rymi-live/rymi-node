export interface ClientOptions {
    /**
     * The Rymi secret API key (`rymi_...`)
     */
    apiKey?: string;
    
    /**
     * The base URL for the API. Defaults to `https://api.rymi.live/v1`
     */
    baseURL?: string;

    /**
     * Custom fetch implementation. Lets embedders route requests without a
     * network socket (e.g. Fastify app.inject). Defaults to global fetch.
     */
    fetch?: typeof globalThis.fetch;
}

export class RymiError extends Error {
    public status?: number;
    public code?: string;

    constructor(message: string, status?: number, code?: string) {
        super(message);
        this.name = 'RymiError';
        this.status = status;
        this.code = code;
    }
}

export class RymiClient {
    private apiKey: string;
    private baseURL: string;
    private fetchImpl: typeof globalThis.fetch;

    constructor(options?: ClientOptions) {
        // Prefer explicit option, then fallback to environment variable
        const key = options?.apiKey || (typeof process !== 'undefined' ? process.env.RYMI_API_KEY : undefined);

        if (!key) {
            throw new Error('The Rymi API Key must be set either by passing `apiKey` to the client or setting the `RYMI_API_KEY` environment variable.');
        }

        this.apiKey = key;
        this.baseURL = options?.baseURL || 'https://api.rymi.live/v1';
        this.fetchImpl = options?.fetch ?? globalThis.fetch;

        // Remove trailing slashes
        if (this.baseURL.endsWith('/')) {
            this.baseURL = this.baseURL.slice(0, -1);
        }
    }

    private async request<T>(method: string, path: string, body?: any): Promise<T> {
        const url = `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
        
        const headers: Record<string, string> = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
            'User-Agent': 'rymi-node/1.0.0'
        };

        const init: RequestInit = {
            method,
            headers
        };

        if (body) {
            headers['Content-Type'] = 'application/json';
            init.body = JSON.stringify(body);
        }

        try {
            const response = await this.fetchImpl(url, init);
            const isJson = response.headers.get('content-type')?.includes('application/json');
            
            const data = isJson ? await response.json() : await response.text();

            if (!response.ok) {
                const message = (data && typeof data === 'object' && 'error' in data) ? (data as any).error : 
                               (typeof data === 'string' ? data : response.statusText);
                throw new RymiError(message, response.status, (data && typeof data === 'object' && 'code' in data) ? (data as any).code : undefined);
            }

            return data as T;
        } catch (error) {
            if (error instanceof RymiError) {
                throw error;
            }
            throw new RymiError(`Network Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public get<T>(path: string): Promise<T> {
        return this.request<T>('GET', path);
    }

    public post<T>(path: string, body?: any): Promise<T> {
        return this.request<T>('POST', path, body);
    }

    public put<T>(path: string, body?: any): Promise<T> {
        return this.request<T>('PUT', path, body);
    }

    public patch<T>(path: string, body?: any): Promise<T> {
        return this.request<T>('PATCH', path, body);
    }

    public delete<T>(path: string): Promise<T> {
        return this.request<T>('DELETE', path);
    }
}
