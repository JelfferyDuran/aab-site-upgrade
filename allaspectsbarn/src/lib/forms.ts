const DEFAULT_FORMSPREE_ENDPOINT = "https://formspree.io/f/xpwdqkrl";

/**
 * Public form submission endpoint used by the contact and newsletter forms.
 * Override per environment without editing components.
 */
export const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || DEFAULT_FORMSPREE_ENDPOINT;
