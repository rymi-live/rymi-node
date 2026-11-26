import { afterEach, describe, expect, it, vi } from 'vitest';
import { Rymi } from '../src/index';

describe('Rymi browser warning', () => {
    afterEach(() => {
        delete (globalThis as any).window;
        delete (globalThis as any).document;
        vi.restoreAllMocks();
    });

    it('does not warn when window is not defined', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        new Rymi({ apiKey: 'rymi_test' });
        expect(warnSpy).not.toHaveBeenCalled();
    });

    it('warns once when running in a browser without dangerouslyAllowBrowser', () => {
        (globalThis as any).window = {};
        (globalThis as any).document = {};
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        new Rymi({ apiKey: 'rymi_test' });

        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy.mock.calls[0][0]).toContain('browser');
    });

    it('does not warn when dangerouslyAllowBrowser is true', () => {
        (globalThis as any).window = {};
        (globalThis as any).document = {};
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        new Rymi({ apiKey: 'rymi_test', dangerouslyAllowBrowser: true });

        expect(warnSpy).not.toHaveBeenCalled();
    });
});
