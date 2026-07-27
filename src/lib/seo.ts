/**
 * Central SEO configuration.
 *
 * IMPORTANT: Set SITE_URL to your real published domain.
 * If you attach a custom domain (e.g. dossierx.app), update it here
 * AND in public/robots.txt, public/sitemap.xml, and public/llms.txt.
 */
export const SITE_URL = "https://dossier-x.lovable.app";

export const SITE_NAME = "DOSSIER X";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SeoOptions {
  title: string;
  description: string;
  /** Path beginning with "/" used to build the canonical URL, e.g. "/archive" */
  path?: string;
  image?: string;
}

/**
 * Builds a complete head() payload for a route: unique title/description,
 * canonical link, and Open Graph / Twitter tags.
 *
 * Usage in a route:
 *   head: () => seo({ title: "...", description: "...", path: "/archive" })
 */
export function seo({ title, description, path, image = DEFAULT_OG_IMAGE }: SeoOptions) {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
