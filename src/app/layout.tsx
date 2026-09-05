import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Jasmine Exclusive School | Diligence for Excellence',
    template: '%s | Jasmine Exclusive School',
  },
  description:
    'Premier educational institution in Benin City, Edo State, offering world-class Creche, Nursery, Primary, Junior Secondary (JSS), and Senior Secondary (SS) education.',
  metadataBase: new URL('https://jasmineexclusiveschool.edu.ng'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jasmine Exclusive School | Diligence for Excellence',
    description:
      'Empowering future leaders through academic rigor, moral integrity, digital innovation, and holistic child development.',
    url: 'https://jasmineexclusiveschool.edu.ng',
    siteName: 'Jasmine Exclusive School',
    locale: 'en_NG',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-white text-[var(--text)]">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
