import type { NextConfig } from 'next'

// Em desenvolvimento, React/Turbopack precisa de 'unsafe-eval' para reconstruir
// callstacks e HMR. Em produção o React JAMAIS usa eval, então a CSP fica
// restritiva (sem 'unsafe-eval') — segurança máxima no deploy.
const isDev = process.env.NODE_ENV !== "production"
const scriptSrc = isDev ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'"

function csp(isSw = false): string {
  if (isSw) return "default-src 'self'; script-src 'self'"
  return `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://avatars.githubusercontent.com https://lastfm.freetls.fastly.net; connect-src 'self'; font-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: csp() },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
    ],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "text/javascript" },
          { key: "Cache-Control", value: "no-store" },
          { key: "Content-Security-Policy", value: csp(true) },
        ],
      },
    ]
  },
}

export default nextConfig
