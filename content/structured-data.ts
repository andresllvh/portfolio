import { certifications } from "./certifications";
import { profile } from "./profile";

// schema.org Person, so search engines can tie the site to the LinkedIn and
// GitHub profiles and show the role and certifications.
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    alternateName: profile.name,
    jobTitle: "Desenvolvedor Front-End Júnior",
    url: profile.siteUrl,
    image: `${profile.siteUrl}/opengraph-image`,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.city,
      addressRegion: profile.region,
      addressCountry: profile.country,
    },
    sameAs: [profile.linkedin, profile.github],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "PostgreSQL",
      "Supabase",
      "AWS",
    ],
    hasCredential: certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "certification",
      url: c.url,
      recognizedBy: { "@type": "Organization", name: "Amazon Web Services" },
    })),
  };
}
