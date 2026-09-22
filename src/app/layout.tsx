import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jasmine Exclusive School | Diligence for Excellence',
    template: '%s | Jasmine Exclusive School',
  },
  description:
    'Jasmine Exclusive School, Aduwawa, Benin City, Edo State. Nurturing intellectually excellent, morally sound and socially responsible children prepared to become agents of positive change in society.',
  applicationName: 'Jasmine Exclusive School',
  keywords: [
    'Jasmine Exclusive School',
    'JES Benin City',
    'secondary school Aduwawa',
    'school in Benin City',
    'Edo State secondary school',
    'WAEC NECO BECE centre',
  ],
  authors: [{ name: 'Jasmine Exclusive School' }],
  openGraph: {
    type: 'website',
    siteName: 'Jasmine Exclusive School',
    title: 'Jasmine Exclusive School | Diligence for Excellence',
    description:
      'Aduwawa, Benin City, Edo State. Academic excellence, moral integrity and social grace.',
    locale: 'en_NG',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jasmine Exclusive School | Diligence for Excellence',
    description: 'Aduwawa, Benin City, Edo State. Academic excellence, moral integrity and social grace.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0F2C59',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-white text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}

