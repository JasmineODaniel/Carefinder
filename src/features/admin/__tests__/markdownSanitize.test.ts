import { describe, it, expect } from 'vitest';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window as unknown as Window & typeof globalThis);

function renderMarkdown(md: string): string {
  return purify.sanitize(String(marked.parse(md)));
}

describe('markdown sanitization', () => {
  it('renders bold text', () => {
    const html = renderMarkdown('**Hospital**');
    expect(html).toContain('<strong>Hospital</strong>');
  });

  it('renders headings', () => {
    const html = renderMarkdown('# About');
    expect(html).toContain('<h1>About</h1>');
  });

  it('strips script tags', () => {
    const html = renderMarkdown('<script>alert("xss")</script>');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('alert');
  });

  it('strips on* event attributes', () => {
    const html = renderMarkdown('<img src="x" onerror="alert(1)" />');
    expect(html).not.toContain('onerror');
  });

  it('preserves safe anchor links', () => {
    const html = renderMarkdown('[Visit](https://example.com)');
    expect(html).toContain('<a');
    expect(html).toContain('href="https://example.com"');
  });
});
