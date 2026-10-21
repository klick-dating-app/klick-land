/** @type {import('next').NextConfig} */
// Exportación 100 % estática: el mismo build se sirve en Firebase Hosting
// y se empaqueta dentro de las apps iOS/Android con Capacitor.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
