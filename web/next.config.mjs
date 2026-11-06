
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Canonical host (www ↔ apex): configurar SOLO en Vercel → Domains.
      // No duplicar aquí: provoca ERR_TOO_MANY_REDIRECTS si Vercel también redirige.
      // Legacy static files (Hostinger / Apache)
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
      // Spanish URL aliases
      { source: '/contacto', destination: '/contact', permanent: true },
      { source: '/servicios', destination: '/features', permanent: true },
      { source: '/destino', destination: '/safe-dates', permanent: true },
      { source: '/preguntas-frecuentes', destination: '/faqs', permanent: true },
      { source: '/privacidad.html', destination: '/privacidad', permanent: true },
      { source: '/terminos.html', destination: '/terminos', permanent: true },
      // Legacy CSO product (suite routes are not deployed)
      { source: '/cso', destination: '/', permanent: true },
      { source: '/cso/:path*', destination: '/', permanent: true },
      { source: '/suite', destination: '/', permanent: true },
      { source: '/suite/:path*', destination: '/', permanent: true },
      // Old bookmarks / broken internal links
      { source: '/mentorship', destination: '/contact', permanent: true },
      // App de citas: `/web/*` = pantalla grande, `/app/*` = marco móvil. Temporales mientras se definen las rutas.
      { source: '/login', destination: '/web/login', permanent: false },
      { source: '/web', destination: '/web/login', permanent: false },
      { source: '/app', destination: '/app/login', permanent: false },
      { source: '/demo', destination: '/web/feed', permanent: false },
      { source: '/portal', destination: '/web/login', permanent: false },
      { source: '/portal/:path*', destination: '/web/login', permanent: false },
    ];
  },
};

export default nextConfig;
