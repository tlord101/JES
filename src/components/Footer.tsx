import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--primary-dark)] text-white pt-12 pb-8 border-t-4 border-[var(--primary)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-700">

          {/* Column 1: School Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-[var(--primary-dark)] font-bold rounded flex items-center justify-center text-lg">
                JES
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight text-white">Jasmine Exclusive School</h3>
                <p className="text-xs text-slate-300">Diligence for Excellence</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Nurturing intellectually excellent, morally sound and socially responsible children prepared to become agents of positive change in society.
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2">
                <i className="bi bi-geo-alt text-amber-400 mt-0.5"></i>
                <span><strong>Campus 1:</strong> 12 Aitamegbe Street, Off Narrow Way Street, Off Reliance, Aduwawa, Benin City, Edo State.</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="bi bi-geo-alt text-amber-400 mt-0.5"></i>
                <span><strong>Campus 2:</strong> 7 Asemota Street, Off College Road, Aduwawa, Benin City, Edo State.</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-telephone text-amber-400"></i>
                <span>+234 806 078 2404</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-envelope text-amber-400"></i>
                <span>jasmineexclusiveschool@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4 border-b border-slate-700 pb-2">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About JES</Link></li>
              <li><Link href="/about/history" className="hover:text-white transition-colors">History & Heritage</Link></li>
              <li><Link href="/about/mission-vision" className="hover:text-white transition-colors">Mission & Vision</Link></li>
              <li><Link href="/about/principal" className="hover:text-white transition-colors">Principal&apos;s Message</Link></li>
              <li><Link href="/staff" className="hover:text-white transition-colors">Staff Directory</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Column 3: Admissions & Academics */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4 border-b border-slate-700 pb-2">Admissions & Academics</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/admissions" className="hover:text-white transition-colors">Admissions Overview</Link></li>
              <li><Link href="/admissions/requirements" className="hover:text-white transition-colors">Entry Requirements</Link></li>
              <li><Link href="/admissions/fees" className="hover:text-white transition-colors">Tuition & Fees</Link></li>
              <li><Link href="/admissions/apply" className="hover:text-white transition-colors text-amber-400 font-semibold">Online Application</Link></li>
              <li><Link href="/academics/curriculum" className="hover:text-white transition-colors">School Curriculum</Link></li>
              <li><Link href="/academics/clubs" className="hover:text-white transition-colors">Clubs & Societies</Link></li>
              <li><Link href="/calendar" className="hover:text-white transition-colors">Term Calendar</Link></li>
            </ul>
          </div>

          {/* Column 4: Community & Portal */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4 border-b border-slate-700 pb-2">Community & Portal</h4>
            <ul className="space-y-2 text-xs text-slate-300 mb-4">
              <li><Link href="/news" className="hover:text-white transition-colors">School News</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Upcoming Events</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Photo & Video Gallery</Link></li>
              <li><Link href="/pta" className="hover:text-white transition-colors">PTA Forum</Link></li>
              <li><Link href="/alumni" className="hover:text-white transition-colors">Alumni Network</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Portal Login</Link></li>
            </ul>

            <h5 className="font-medium text-xs text-white mb-2">Connect With Us</h5>
            <div className="flex items-center gap-3 text-slate-300">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white">
                <i className="bi bi-facebook text-base"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white">
                <i className="bi bi-instagram text-base"></i>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-white">
                <i className="bi bi-whatsapp text-base"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white">
                <i className="bi bi-youtube text-base"></i>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Jasmine Exclusive School. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-white">Terms of Use</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
