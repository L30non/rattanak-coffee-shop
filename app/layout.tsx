import type { Metadata } from "next";
import "../styles/index.css";
import "../styles/tailwind.css";
import "../styles/theme.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const LOGO_URL =
  "https://qboxqdnuoqpsrmqtaaaf.supabase.co/storage/v1/object/public/Images/branding/Rattanak.webp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: LOGO_URL,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [LOGO_URL],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [LOGO_URL],
  },
};

// Organization + WebSite JSON-LD: tells Google what the business is (name,
// logo, socials) and — via `potentialAction` — that the site supports a
// search box, which is one of the forms sitelinks can take under a brand
// search. Sitelinks themselves are still Google's algorithmic call; this
// only supplies the signals they're computed from.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: LOGO_URL,
  sameAs: [
    "https://www.facebook.com/rattanakcoffeeroaster",
    "https://www.instagram.com/rattanakcoffee/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+855-12-667-778",
    email: "info@rattanakcoffee.com",
    contactType: "customer service",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/products?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
