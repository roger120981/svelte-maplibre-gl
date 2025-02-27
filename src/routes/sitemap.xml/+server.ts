import { toc as docsToc } from '$content/docs/toc.js';
import { toc as exampleToc } from '$content/examples/toc.js';
import { toc as componentToc } from '$content/components/toc.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	const urls: string[] = [];
	const origin = new URL(request.url).origin;

	urls.push(origin + '/');

	urls.push(origin + '/examples/');
	for (const section of exampleToc) {
		for (const [path] of Object.entries(section.items)) {
			urls.push(origin + path);
		}
	}

	urls.push(origin + '/docs/components/');
	for (const section of componentToc) {
		for (const [path] of Object.entries(section.items)) {
			urls.push(origin + path);
		}
	}
	for (const section of docsToc) {
		for (const [path] of Object.entries(section.items)) {
			urls.push(origin + path);
		}
	}

	return new Response(
		`
<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  ${urls.map((url) => `<url><loc>${url}</loc></url>`).join('\n')}
</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
};
