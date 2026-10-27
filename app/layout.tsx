import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import AuroraBackdrop from "@/components/AuroraBackdrop";
import SiteLines from "@/components/effects/SiteLines";
import ThreeBackground from "@/components/ThreeBackground";
import HeaderScroll from "@/components/HeaderScroll";
import ScrollProgress from "@/components/ScrollProgress";
import MagneticTargets from "@/components/MagneticTargets";
import SeasonProvider from "@/components/SeasonProvider";
import LanguageProvider from "@/components/LanguageProvider";
import { SEASONS, DEFAULT_SEASON, type SeasonId } from "@/lib/seasons";
import { LANGUAGES, DEFAULT_LANG, type Lang } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/content/profile";
import { personJsonLd } from "@/content/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: "André Santos — Desenvolvedor Front-End Jr",
  description:
    "Portfólio de André Santos, desenvolvedor Front-End Júnior especializado em React, TypeScript e Cloud Computing. AWS Certified Cloud Practitioner. João Pessoa, PB.",
  authors: [{ name: "André Santos" }],
  openGraph: {
    title: "André Santos — Desenvolvedor Front-End Jr",
    description:
      "Portfólio interativo de André Santos, desenvolvedor Front-End. React, Next.js, TypeScript e AWS Certified Cloud Practitioner.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "André Santos — Desenvolvedor Front-End Jr",
    description:
      "Portfólio interativo de André Santos, desenvolvedor Front-End. React, Next.js, TypeScript e AWS Certified Cloud Practitioner.",
  },
};

export const viewport: Viewport = {
  themeColor: "#060e1c",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const rawSeason = cookieStore.get("portfolio-season")?.value;
  const season: SeasonId = SEASONS.some((s) => s.id === rawSeason)
    ? (rawSeason as SeasonId)
    : DEFAULT_SEASON;

  const rawLang = cookieStore.get("portfolio-lang")?.value;
  const lang: Lang = LANGUAGES.includes(rawLang as Lang)
    ? (rawLang as Lang)
    : DEFAULT_LANG;

  return (
    <html
      lang={lang}
      data-season={season}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          // JSON.stringify output is safe here: the data is static and ours.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <LanguageProvider initialLang={lang}>
          <SeasonProvider initialSeason={season}>
            <AuroraBackdrop />
            <SiteLines />
            <ThreeBackground />
            <HeaderScroll />
            <ScrollProgress />
            <div className="site-content relative z-[2] flex min-h-full flex-1 flex-col">
              {children}
            </div>
            <CustomCursor />
            <MagneticTargets />
            <Analytics />
          </SeasonProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
