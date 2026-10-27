import type { NextConfig } from "next";

// Security headers applied to every response. Tuned for a public portfolio:
//   - HSTS forces HTTPS on future visits (the reverse proxy / Traefik handles
//     the actual TLS — this locks browsers in once they've seen one response).
//   - DENY framing prevents clickjacking.
//   - nosniff stops MIME-type confusion attacks.
//   - strict-origin-when-cross-origin limits what the Referer leaks.
//   - Permissions-Policy closes browser APIs we don't use so a future
//     dependency update can't silently start using them.
// CSP intentionally omitted for now — it tends to break Next.js inline
// hydration scripts and Tailwind's injected styles without careful tuning.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
];

const OLD_HOSTS = [
  "portfolio-tan-six-bcjn1gwug5.vercel.app",
  "portfolio-tan-six.vercel.app",
];

const nextConfig: NextConfig = {
  // Emits a minimal server bundle at `.next/standalone/` so the Docker
  // runtime image can drop npm/node_modules entirely and just run
  // `node server.js`. Trims the final image to ~100 MB.
  output: "standalone",

  // Older addresses of this same site (still linked from resumes already
  // sent) permanently redirect to the current one.
  async redirects() {
    return OLD_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://portfolioandresllvh.vercel.app/:path*",
      permanent: true,
    }));
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
