const FALLBACK_SITE_URL = "https://allaspectsbarn.vercel.app";

/**
 * Canonical public origin for metadata, schema, sitemap, robots, and links.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment when the custom
 * domain is ready (for example: https://allaspectsbarn.com). The fallback
 * keeps local/dev builds deterministic while avoiding duplicated origins.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(
  /\/+$/,
  "",
);

/**
 * Single source of truth for stable public business identity.
 * Keep frequently changing editorial copy out of this object; this is for
 * facts that are reused across metadata, schema, navigation, footer, and CTAs.
 */
export const SITE = {
  name: "All Aspects at the Barn",
  shortName: "All Aspects Barn",
  email: "allaspectsrecycled@gmail.com",
  phone: {
    display: "(570) 583-2305",
    e164: "+15705832305",
    href: "tel:+15705832305",
  },
  address: {
    street: "1584 S Delaware Road",
    locality: "Mount Bethel",
    region: "PA",
    postalCode: "18343",
    country: "US",
    display: "1584 S Delaware Road, Mount Bethel, PA 18343",
  },
  geo: {
    latitude: 40.8852894,
    longitude: -75.1235791,
  },
  social: {
    facebook: "https://www.facebook.com/allaspectsrepurposed/",
    instagram: "https://www.instagram.com/allaspectsrestoredrecycled/",
    linkedin: "https://www.linkedin.com/company/all-aspects-at-the-barn/",
  },
  hours: {
    schema: ["Tu-Sa 08:00-17:00", "Su 09:00-17:00"],
    display: "Tuesday–Saturday 8am–5pm, Sunday 9am–5pm, closed Monday",
  },
} as const;
