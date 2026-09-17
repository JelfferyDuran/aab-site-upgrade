const FALLBACK_SITE_URL = "https://allaspectsbarn.vercel.app";

/**
 * Canonical public origin for metadata, schema, sitemap, and robots.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment when the custom
 * domain is ready (for example: https://allaspectsbarn.com). Keeping the
 * fallback makes local/dev builds deterministic while avoiding duplicate
 * hard-coded origins across the app.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(
  /\/+$/,
  "",
);
