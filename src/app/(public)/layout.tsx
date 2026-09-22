import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Public website shell: marketing header + footer.
 * The authenticated portals intentionally live in other route groups so they
 * never render this chrome.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
