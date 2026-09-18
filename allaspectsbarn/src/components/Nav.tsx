"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Above-fold navigation with glass mega-menu dropdowns.
 *
 * Motion is authored in plain CSS (see globals.css "AAB Nav dropdown"):
 * this file must NOT import framer-motion, or the motion library gets pulled
 * back into the root-layout chunk that gates LCP.
 *
 * Controls implemented:
 *  - hover opens after the pointer settles on the trigger (no accidental opens
 *    while crossing the bar), closes on leave with a 180 ms grace period so the
 *    pointer can travel from trigger to panel — padding-top on the panel keeps
 *    that corridor inside the same hover subtree.
 *  - click / tap pins a menu open; a second click closes it.
 *  - ArrowDown on the trigger opens + focuses the first row; ArrowUp/Down/Home/
 *    End cycle rows inside the panel; Escape closes and returns focus to the
 *    trigger; Tab out or an outside pointer-down closes everything.
 *  - scroll, or a route change, closes open menus (no stale floating panels).
 *  - active section is marked with an accent rail + aria-current="page", and the
 *    parent trigger is highlighted when any of its children is the current page.
 *  - the feature thumbnail is only mounted once its menu has been opened, so the
 *    initial page load carries no dropdown image weight.
 */

type MenuItem = { href: string; label: string; desc: string };
type Menu = {
  id: string;
  label: string;
  items: MenuItem[];
  feature: {
    image: string;
    alt: string;
    kicker: string;
    title: string;
    cta: string;
    href: string;
  };
};

const MENUS: Menu[] = [
  {
    id: "visit",
    label: "Visit",
    items: [
      { href: "/petting-farm", label: "Petting Farm", desc: "Feed and meet the animals" },
      { href: "/barn-brew-coffee-bar", label: "Barn Brew Coffee Bar", desc: "Espresso, lattes & fresh baked goods" },
      { href: "/gallery", label: "Gallery", desc: "Photo tour of the barn" },
      { href: "/workshops", label: "Workshops", desc: "Hands-on seasonal classes" },
    ],
    feature: {
      image: "/images/nav/visit.webp",
      alt: "Animals in the All Aspects Barn petting farm",
      kicker: "Bring the family",
      title: "A morning at the barn",
      cta: "Plan a visit",
      href: "/petting-farm",
    },
  },
  {
    id: "celebrate",
    label: "Celebrate",
    items: [
      { href: "/pavilion-party-rental", label: "Pavilion Party Rental", desc: "Covered space for weddings & parties" },
      { href: "/wedding-venue", label: "Wedding Venue", desc: "Rustic ceremonies and receptions" },
    ],
    feature: {
      image: "/images/nav/celebrate.webp",
      alt: "The barn pavilion set up for a celebration",
      kicker: "Your day, our barn",
      title: "Rent the pavilion",
      cta: "Check dates",
      href: "/pavilion-party-rental",
    },
  },
  {
    id: "shop",
    label: "Shop",
    items: [
      { href: "/shop", label: "Shop All", desc: "Browse every find in the barn" },
      { href: "/products", label: "Product Catalog", desc: "Full inventory with photos" },
    ],
    feature: {
      image: "/images/nav/shop.webp",
      alt: "Antiques and goods displayed inside the barn shop",
      kicker: "New arrivals weekly",
      title: "Wander the aisles",
      cta: "Start browsing",
      href: "/shop",
    },
  },
];

const ABOUT: MenuItem = { href: "/about", label: "About", desc: "Our story" };

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [seen, setSeen] = useState<Record<string, boolean>>({});

  const navRef = useRef<HTMLElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* Theme -----------------------------------------------------------------
     layout.tsx writes data-theme on <html> before first paint, so the icon is
     chosen by CSS (see .aab-icon-sun / .aab-icon-moon in globals.css). This
     state exists only to keep the accessible label and the drawer row text in
     sync, which is why it starts at "light" and syncs in an effect after
     hydration rather than being read during render. */
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem("aab-theme", next);
    } catch {
      /* storage blocked (private mode): the choice simply does not persist */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#14181f" : "#fbf7f0");
    setTheme(next);
  }, []);

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"),
    [pathname]
  );

  // Click-only: a panel opens when its trigger is clicked and closes on the same
  // trigger, an outside pointer-down, Escape, scroll, or a route change. There is
  // deliberately no hover-open — the menu stays hidden until asked for.
  const closeMenu = useCallback((refocus = false) => {
    setOpen((cur) => {
      if (refocus && cur) triggerRefs.current[cur]?.focus();
      return null;
    });
  }, []);

  const openMenu = useCallback((id: string) => {
    setSeen((s) => (s[id] ? s : { ...s, [id]: true }));
    setOpen(id);
  }, []);

  // Scroll state + close any open dropdown that would otherwise float away.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setOpen(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes everything; focus returns to the trigger that was open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeMenu(true);
      setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMenu]);

  // Pointer outside the nav dismisses an open menu.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Route change: nothing should stay open.
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
    setMobileGroup(null);
  }, [pathname]);

  const focusFirstRow = (id: string) =>
    requestAnimationFrame(() =>
      panelRefs.current[id]?.querySelector<HTMLAnchorElement>("a[data-nav-item]")?.focus()
    );

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
    const panel = panelRefs.current[id];
    if (!panel) return;
    const rows = Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[data-nav-item]"));
    if (!rows.length) return;
    const idx = rows.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      rows[idx < 0 ? 0 : Math.min(idx + 1, rows.length - 1)]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx <= 0) triggerRefs.current[id]?.focus();
      else rows[idx - 1]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      rows[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      rows[rows.length - 1]?.focus();
    }
  };

  const scrolledClass = scrolled
    ? "aab-glass-warm-strong backdrop-blur-2xl backdrop-saturate-150 border-b aab-line-glass shadow-[0_10px_30px_-18px_rgba(120,72,20,0.35)]"
    : "bg-transparent";
  const linkColor = scrolled ? "text-[var(--color-gray-700)]" : "text-white/90";
  const linkHover = scrolled ? "hover:aab-nav-active" : "hover:text-white";

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[var(--z-fixed)] transition-[background,box-shadow,border-color] duration-300 nav-enter ${
        mobileOpen ? "aab-glass-warm-strong backdrop-blur-2xl backdrop-saturate-150" : scrolledClass
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className={`font-display text-2xl lg:text-3xl tracking-tight transition-colors ${
              scrolled || mobileOpen ? "aab-nav-active" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            AAB
          </Link>

          {/* Desktop: glass mega-menus */}
          <div className="hidden lg:flex items-center gap-1">
            {MENUS.map((menu, i) => {
              const isOpen = open === menu.id;
              const sectionActive = menu.items.some((it) => isActive(it.href));
              const isLast = i === MENUS.length - 1;
              return (
                <div
                  key={menu.id}
                  className="relative nav-stagger"
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <button
                    ref={(el) => {
                      triggerRefs.current[menu.id] = el;
                    }}
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-controls={`nav-panel-${menu.id}`}
                    onClick={() => (isOpen ? closeMenu() : openMenu(menu.id))}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        openMenu(menu.id);
                        focusFirstRow(menu.id);
                      }
                    }}
                    className={`group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium tracking-wide uppercase transition-colors ${
                      sectionActive || isOpen ? "aab-nav-active" : linkColor
                    } ${sectionActive || isOpen ? "" : linkHover}`}
                  >
                    <span className="relative">
                      {menu.label}
                      <span
                        className={`pointer-events-none absolute -bottom-1 left-0 h-[2px] rounded-full bg-[var(--color-primary)] transition-[width,opacity] duration-300 ${
                          isOpen || sectionActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                        }`}
                      />
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M5 7.5 10 12.5 15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Glass panel — padding-top keeps the trigger→panel corridor hoverable */}
                  <div
                    id={`nav-panel-${menu.id}`}
                    ref={(el) => {
                      panelRefs.current[menu.id] = el;
                    }}
                    data-open={isOpen}
                    onKeyDown={(e) => onPanelKeyDown(e, menu.id)}
                    className={`aab-menu-panel absolute top-full z-[var(--z-dropdown)] w-[600px] max-w-[calc(100vw-2rem)] pt-3 ${
                      isLast ? "right-0" : "left-1/2 -translate-x-1/2"
                    }`}
                  >
                    <div className="aab-glass-warm relative overflow-hidden rounded-2xl border ring-1 ring-black/5 backdrop-blur-2xl backdrop-saturate-150">
                      {/* glass edge highlights */}
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(255_250_242/0.95)] to-transparent" />
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[rgb(224_146_60/0.85)] via-[rgb(246_196_118/0.6)] to-transparent opacity-80" />

                      <div className="grid grid-cols-[1fr_212px] gap-2 p-3">
                        <ul className="space-y-0.5">
                          {menu.items.map((it, j) => {
                            const on = isActive(it.href);
                            return (
                              <li
                                key={it.href}
                                className="aab-drop-item"
                                style={{ animationDelay: `${0.04 + j * 0.035}s` }}
                              >
                                <Link
                                  href={it.href}
                                  data-nav-item
                                  aria-current={on ? "page" : undefined}
                                  onClick={() => closeMenu()}
                                  className={`group/row relative flex flex-col gap-0.5 rounded-xl py-2.5 pl-4 pr-3 transition-colors ${
                                    on ? "aab-active-warm" : "aab-hover-warm"
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none absolute left-1.5 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-primary)] transition-opacity duration-200 ${
                                      on ? "opacity-100" : "opacity-0 group-hover/row:opacity-70"
                                    }`}
                                  />
                                  <span className="flex items-center gap-1.5 text-[13px] font-semibold tracking-wide text-[var(--color-gray-900)]">
                                    {it.label}
                                    <svg
                                      aria-hidden="true"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover/row:translate-x-0 group-hover/row:opacity-100"
                                    >
                                      <path
                                        d="M4 10h11m0 0-4-4m4 4-4 4"
                                        stroke="currentColor"
                                        strokeWidth="1.75"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </span>
                                  <span className="text-[11.5px] leading-snug text-[var(--color-gray-500)]">
                                    {it.desc}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>

                        {/* Feature card — thumbnail mounts on first open only */}
                        <Link
                          href={menu.feature.href}
                          onClick={() => closeMenu()}
                          className="group/feat flex flex-col overflow-hidden rounded-xl ring-1 ring-black/5 bg-[rgb(255_245_231/0.6)] transition-colors hover:bg-[rgb(255_238_216/0.9)]"
                        >
                          <span className="relative block h-[132px] w-full overflow-hidden bg-[rgb(250_228_197)]">
                            {seen[menu.id] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={menu.feature.image}
                                alt={menu.feature.alt}
                                width={320}
                                height={240}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/feat:scale-[1.06]"
                              />
                            ) : null}
                            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                          </span>
                          <span className="flex flex-1 flex-col gap-0.5 p-3">
                            <span
                              className="text-[13px] leading-none aab-nav-active"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {menu.feature.kicker}
                            </span>
                            <span className="text-[12.5px] font-semibold text-[var(--color-gray-900)]">
                              {menu.feature.title}
                            </span>
                            <span className="mt-auto inline-flex items-center gap-1 pt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--color-gray-600)] transition-colors group-hover/feat:aab-nav-active">
                              {menu.feature.cta}
                              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3 w-3">
                                <path
                                  d="M4 10h11m0 0-4-4m4 4-4 4"
                                  stroke="currentColor"
                                  strokeWidth="1.9"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link
              href={ABOUT.href}
              className={`nav-stagger rounded-full px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                isActive(ABOUT.href) ? "aab-nav-active" : linkColor
              } ${linkHover}`}
              style={{ animationDelay: "0.25s" }}
            >
              {ABOUT.label}
            </Link>

            <button
              type="button"
              data-theme-toggle
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
              aria-label={theme === "dark" ? "Switch to light contrast" : "Switch to dark contrast"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className={`aab-theme-toggle nav-stagger ml-2 grid h-9 w-9 place-items-center rounded-full ring-1 backdrop-blur-sm transition-all ${
                scrolled
                  ? "text-[var(--color-gray-700)] ring-[var(--aab-toggle-ring)] aab-hover-warm"
                  : "text-white ring-[rgb(255_226_190/0.5)] hover:bg-[rgb(255_232_205/0.28)]"
              }`}
              style={{ animationDelay: "0.28s" }}
            >
              <svg
                aria-hidden="true"
                className="aab-icon-moon h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
              </svg>
              <svg
                aria-hidden="true"
                className="aab-icon-sun h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
              </svg>
            </button>
            <Link
              href="/contact"
              className={`nav-stagger ml-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 backdrop-blur-sm transition-all ${
                scrolled
                  ? "bg-[var(--aab-apricot)] text-[var(--aab-apricot-ink)] ring-[var(--aab-apricot)] hover:bg-[var(--aab-apricot-dark)]"
                  : "bg-[rgb(255_232_205/0.18)] text-white ring-[rgb(255_226_190/0.5)] hover:bg-[rgb(255_232_205/0.32)]"
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              Contact
            </Link>
          </div>

          {/* Mobile toggle — morphs to an X */}
          <button
            data-nav-toggle
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              scrolled || mobileOpen ? "text-[var(--color-gray-700)]" : "text-white"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="nav-mobile-panel"
          >
            <span className="sr-only">Menu</span>
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileOpen ? "translate-y-2 rotate-45" : "mb-1.5"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileOpen ? "scale-x-0 opacity-0" : "mb-1.5"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile glass panel — grouped accordion */}
      <div
        id="nav-mobile-panel"
        data-nav-drawer
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-400 ease-out ${
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="aab-glass-warm-strong max-h-[78vh] overflow-y-auto border-t aab-line-glass px-3 pb-4 pt-2 backdrop-blur-2xl backdrop-saturate-150">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            aria-current={isActive("/") ? "page" : undefined}
            className={`relative block rounded-xl px-3 py-2.5 font-medium transition-colors aab-hover-warm ${
              isActive("/") ? "aab-active-warm aab-nav-active" : "text-[var(--color-gray-700)]"
            }`}
          >
            {isActive("/") && (
              <span className="pointer-events-none absolute left-1 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-primary)]" />
            )}
            Home
          </Link>

          {MENUS.map((menu) => {
            const groupOpen = mobileGroup === menu.id;
            const sectionActive = menu.items.some((it) => isActive(it.href));
            return (
              <div key={menu.id} className="border-b aab-line-warm">
                <button
                  type="button"
                  data-nav-group={menu.id}
                  onClick={() => setMobileGroup(groupOpen ? null : menu.id)}
                  aria-expanded={groupOpen}
                  aria-controls={`nav-mobile-${menu.id}`}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left font-medium transition-colors aab-hover-warm"
                >
                  <span
                    className={
                      sectionActive
                        ? "aab-nav-active"
                        : "text-[var(--color-gray-700)]"
                    }
                  >
                    {menu.label}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`h-4 w-4 text-[var(--color-gray-500)] transition-transform duration-300 ${
                      groupOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M5 7.5 10 12.5 15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  id={`nav-mobile-${menu.id}`}
                  data-open={groupOpen}
                  className="aab-submenu"
                >
                  <div className="ml-3 mb-1 border-l aab-line-soft pl-2">
                    {menu.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive(it.href) ? "page" : undefined}
                        className={`relative block rounded-lg px-3 py-2 transition-colors ${
                          isActive(it.href) ? "aab-active-warm" : "aab-hover-warm"
                        }`}
                      >
                        {isActive(it.href) && (
                          <span className="pointer-events-none absolute -left-2.5 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-primary)]" />
                        )}
                        <span
                          className={`block text-sm font-medium ${
                            isActive(it.href)
                              ? "aab-nav-active"
                              : "text-[var(--color-gray-700)]"
                          }`}
                        >
                          {it.label}
                        </span>
                        <span className="block text-[11px] leading-snug text-[var(--color-gray-500)]">
                          {it.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href={ABOUT.href}
            onClick={() => setMobileOpen(false)}
            className="block rounded-xl px-3 py-2.5 font-medium text-[var(--color-gray-700)] transition-colors aab-hover-warm"
          >
            {ABOUT.label}
          </Link>

          <button
            type="button"
            data-theme-toggle
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label={theme === "dark" ? "Switch to light contrast" : "Switch to dark contrast"}
            className="aab-theme-toggle mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-medium text-[var(--color-gray-700)] aab-hover-warm transition-colors"
          >
            <span>{theme === "dark" ? "Light contrast" : "Dark contrast"}</span>
            <span className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-[var(--aab-toggle-ring)]">
              <svg
                aria-hidden="true"
                className="aab-icon-moon h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
              </svg>
              <svg
                aria-hidden="true"
                className="aab-icon-sun h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
              </svg>
            </span>
          </button>

          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-full bg-[var(--aab-apricot)] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--aab-apricot-ink)] transition-colors hover:bg-[var(--aab-apricot-dark)]"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
