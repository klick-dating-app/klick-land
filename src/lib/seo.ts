import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://click-with-purpose.onrender.com";
export const SITE_NAME = "Klick";

/** URL estable del logo (Google Search favicon + schema.org). */
export const SITE_LOGO_PATH = "/matchapp-logo-circular.png";
export const SITE_LOGO_URL = `${SITE_URL}${SITE_LOGO_PATH}`;

export const DEFAULT_DESCRIPTION =
  "Expert guidance for visas, studies, and a new life in the United States. Technology and human support in one place.";

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export type SitemapEntry = {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

/** Rutas públicas indexables (sitemap + SEO). */
export const PUBLIC_SITEMAP_ROUTES: SitemapEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/visas/student", changeFrequency: "weekly", priority: 0.95 },
  { path: "/visas/tourist", changeFrequency: "weekly", priority: 0.95 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/destinos", changeFrequency: "monthly", priority: 0.8 },
  { path: "/courses", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.75 },
  { path: "/brochures", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/partnerships", changeFrequency: "monthly", priority: 0.65 },
  { path: "/referrals", changeFrequency: "monthly", priority: 0.65 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terminos", changeFrequency: "yearly", priority: 0.3 },
];

const PAGE_SEO: Record<
  string,
  { title: string; description: string }
> = {
  "/": {
    title: "Klick | Dating App",
    description: DEFAULT_DESCRIPTION,
  },
  "/about": {
    title: "About Klick",
    description:
      "Learn about the history, values, and team behind Klick. Transparency and guidance throughout your experience.",
  },
  "/destinos": {
    title: "US Destinations",
    description:
      "Explore popular cities and destinations to study, work, and live with Klick.",
  },
  "/courses": {
    title: "English Courses in USA",
    description:
      "English programs at partner schools in the United States. Plan your education with Klick guidance.",
  },
  "/services": {
    title: "Services in USA",
    description:
      "Housing, banking, SIM cards, transport, and more. Essential services for your arrival.",
  },
  "/brochures": {
    title: "Brochures and Guides",
    description:
      "Download informational materials and take the first step in your process with Klick.",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Speak with the Klick team. We resolve doubts about visas, studies, and your plan.",
  },
  "/partnerships": {
    title: "Institutional Partnerships",
    description:
      "Partner universities and schools. Partnership programs with Klick.",
  },
  "/referrals": {
    title: "Referral Program",
    description:
      "Recommend Klick and earn rewards. Share your experience with our community.",
  },
  "/faqs": {
    title: "Frequently Asked Questions",
    description:
      "Answers about visas, payments, processes, and support.",
  },
  "/privacidad": {
    title: "Privacy Policy",
    description: "Privacy policy and data processing of Klick.",
  },
  "/terminos": {
    title: "Terms and Conditions",
    description: "Terms and conditions of use for Klick services.",
  },
  "/visas/student": {
    title: "F-1 Student Visa",
    description:
      "Plans and guidance for F-1 student visas. Study in the US with expert Klick support.",
  },
  "/visas/tourist": {
    title: "B1/B2 Tourist Visa",
    description:
      "Guidance for B1/B2 tourist visas. Prepare your trip to the United States with confidence.",
  },
};

function canonicalUrl(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}

export function pageMetadata(
  path: string,
  options?: { noindex?: boolean }
): Metadata {
  const normalized = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const entry = PAGE_SEO[normalized] ?? PAGE_SEO["/"];
  const url = canonicalUrl(normalized === "/" ? "" : normalized);
  const noindex = options?.noindex ?? false;

  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: url },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: SITE_LOGO_PATH,
          width: 512,
          height: 512,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
    },
    robots: noindex ? NOINDEX_ROBOTS : { index: true, follow: true },
  };
}

export function noindexMetadata(title: string): Metadata {
  return {
    title,
    robots: NOINDEX_ROBOTS,
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Klick | Dating App",
    template: "%s",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Klick | Dating App",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: SITE_LOGO_PATH,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Klick | Dating App",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Google Search favicon: URL estable, PNG, múltiplos de 48px (ver app/icon.png)
  icons: {
    icon: [
      { url: SITE_LOGO_PATH, type: "image/png", sizes: "48x48" },
      { url: SITE_LOGO_PATH, type: "image/png", sizes: "192x192" },
      { url: SITE_LOGO_PATH, type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: SITE_LOGO_PATH, type: "image/png", sizes: "180x180" }],
    shortcut: SITE_LOGO_PATH,
  },
};
