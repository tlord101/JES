'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Hide public site header when inside portal routes
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/staff') ||
    pathname?.startsWith('/parent') ||
    pathname?.startsWith('/student')
  ) {
    return null;
  }

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--border)]">
      {/* Top Banner Bar */}
      <div className="bg-[var(--primary)] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5">
              <i className="bi bi-geo-alt-fill text-amber-400"></i>
              Aduwawa, Benin City, Edo State
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="flex items-center gap-1.5">
              <i className="bi bi-telephone-fill text-amber-400"></i>
              +234 806 078 2404
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="flex items-center gap-1.5">
              <i className="bi bi-envelope-fill text-amber-400"></i>
              jasmineexclusiveschool@gmail.com
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="italic text-slate-200 text-xs hidden lg:inline">
              Motto: <strong className="text-white font-semibold">Diligence for Excellence</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[var(--primary)] text-white font-bold rounded flex items-center justify-center text-lg border border-[var(--primary-dark)]">
            JES
          </div>
          <div>
            <span className="block font-bold text-lg leading-tight text-[var(--primary)] group-hover:text-[var(--primary-dark)]">
              Jasmine Exclusive School
            </span>
            <span className="block text-xs text-[var(--muted-text)] font-medium">
              Diligence for Excellence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-[var(--text)]">
          <Link href="/" className="px-3 py-2 rounded hover:bg-[var(--soft-bg)] transition-colors">
            Home
          </Link>

          {/* About Dropdown */}
          <div className="relative group">
            <button className="px-3 py-2 rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1">
              About <i className="bi bi-chevron-down text-xs text-[var(--muted-text)]"></i>
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-56 bg-white border border-[var(--border)] rounded-md py-2 z-50">
              <Link href="/about" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                About Overview
              </Link>
              <Link href="/about/history" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Our History
              </Link>
              <Link href="/about/mission-vision" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Mission & Vision
              </Link>
              <Link href="/about/values" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Core Values
              </Link>
              <Link href="/about/principal" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Principal&apos;s Message
              </Link>
              <Link href="/about/accreditation" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Accreditation & Quality
              </Link>
            </div>
          </div>

          {/* Academics Dropdown */}
          <div className="relative group">
            <button className="px-3 py-2 rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1">
              Academics <i className="bi bi-chevron-down text-xs text-[var(--muted-text)]"></i>
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-56 bg-white border border-[var(--border)] rounded-md py-2 z-50">
              <Link href="/academics" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Academics Overview
              </Link>
              <Link href="/academics/curriculum" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Curriculum
              </Link>
              <Link href="/academics/subjects" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Subjects Offered
              </Link>
              <Link href="/academics/results" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Academic Results
              </Link>
              <Link href="/academics/clubs" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Clubs & Societies
              </Link>
              <Link href="/academics/sports" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Sports & Athletics
              </Link>
            </div>
          </div>

          {/* Admissions Dropdown */}
          <div className="relative group">
            <button className="px-3 py-2 rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1">
              Admissions <i className="bi bi-chevron-down text-xs text-[var(--muted-text)]"></i>
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-60 bg-white border border-[var(--border)] rounded-md py-2 z-50">
              <Link href="/admissions" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Admissions Overview
              </Link>
              <Link href="/admissions/requirements" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Admission Requirements
              </Link>
              <Link href="/admissions/process" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Application Process
              </Link>
              <Link href="/admissions/fees" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Tuition & Fees
              </Link>
              <Link href="/admissions/dates" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Key Dates & Deadlines
              </Link>
              <Link href="/admissions/downloads" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Downloads & Forms
              </Link>
              <Link href="/admissions/apply" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm text-[var(--primary)] font-semibold">
                Apply Now
              </Link>
            </div>
          </div>

          {/* School Life / Community */}
          <div className="relative group">
            <button className="px-3 py-2 rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1">
              School Life <i className="bi bi-chevron-down text-xs text-[var(--muted-text)]"></i>
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-56 bg-white border border-[var(--border)] rounded-md py-2 z-50">
              <Link href="/staff" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Staff Directory
              </Link>
              <Link href="/calendar" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Term Calendar
              </Link>
              <Link href="/gallery" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Gallery & Videos
              </Link>
              <Link href="/pta" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Parent-Teacher Association (PTA)
              </Link>
              <Link href="/alumni" className="block px-4 py-2 hover:bg-[var(--soft-bg)] text-sm">
                Alumni Network
              </Link>
            </div>
          </div>

          <Link href="/news" className="px-3 py-2 rounded hover:bg-[var(--soft-bg)] transition-colors">
            News
          </Link>
          <Link href="/events" className="px-3 py-2 rounded hover:bg-[var(--soft-bg)] transition-colors">
            Events
          </Link>
          <Link href="/contact" className="px-3 py-2 rounded hover:bg-[var(--soft-bg)] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action CTA Buttons (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm font-medium text-[var(--primary)] border border-[var(--primary)] rounded hover:bg-[var(--primary-light)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-person-lock"></i> Portal Login
          </Link>
          <Link
            href="/admissions/apply"
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-pencil-square"></i> Apply Now
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[var(--text)] focus:outline-none rounded border border-[var(--border)] hover:bg-[var(--soft-bg)]"
          aria-label="Toggle Navigation Menu"
        >
          <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-2xl`}></i>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--border)] px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[var(--text)] border-b border-slate-100"
          >
            Home
          </Link>

          {/* Mobile About Accordion */}
          <div className="border-b border-slate-100 py-1">
            <button
              onClick={() => toggleDropdown('about')}
              className="w-full text-left py-2 text-sm font-medium text-[var(--text)] flex justify-between items-center"
            >
              <span>About</span>
              <i className={`bi bi-chevron-${openDropdown === 'about' ? 'up' : 'down'} text-xs`}></i>
            </button>
            {openDropdown === 'about' && (
              <div className="pl-4 space-y-2 py-2 bg-[var(--soft-bg)] rounded text-xs">
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1">Overview</Link>
                <Link href="/about/history" onClick={() => setMobileMenuOpen(false)} className="block py-1">Our History</Link>
                <Link href="/about/mission-vision" onClick={() => setMobileMenuOpen(false)} className="block py-1">Mission & Vision</Link>
                <Link href="/about/values" onClick={() => setMobileMenuOpen(false)} className="block py-1">Core Values</Link>
                <Link href="/about/principal" onClick={() => setMobileMenuOpen(false)} className="block py-1">Principal&apos;s Message</Link>
                <Link href="/about/accreditation" onClick={() => setMobileMenuOpen(false)} className="block py-1">Accreditation</Link>
              </div>
            )}
          </div>

          {/* Mobile Academics Accordion */}
          <div className="border-b border-slate-100 py-1">
            <button
              onClick={() => toggleDropdown('academics')}
              className="w-full text-left py-2 text-sm font-medium text-[var(--text)] flex justify-between items-center"
            >
              <span>Academics</span>
              <i className={`bi bi-chevron-${openDropdown === 'academics' ? 'up' : 'down'} text-xs`}></i>
            </button>
            {openDropdown === 'academics' && (
              <div className="pl-4 space-y-2 py-2 bg-[var(--soft-bg)] rounded text-xs">
                <Link href="/academics" onClick={() => setMobileMenuOpen(false)} className="block py-1">Overview</Link>
                <Link href="/academics/curriculum" onClick={() => setMobileMenuOpen(false)} className="block py-1">Curriculum</Link>
                <Link href="/academics/subjects" onClick={() => setMobileMenuOpen(false)} className="block py-1">Subjects</Link>
                <Link href="/academics/results" onClick={() => setMobileMenuOpen(false)} className="block py-1">Results</Link>
                <Link href="/academics/clubs" onClick={() => setMobileMenuOpen(false)} className="block py-1">Clubs & Societies</Link>
                <Link href="/academics/sports" onClick={() => setMobileMenuOpen(false)} className="block py-1">Sports</Link>
              </div>
            )}
          </div>

          {/* Mobile Admissions Accordion */}
          <div className="border-b border-slate-100 py-1">
            <button
              onClick={() => toggleDropdown('admissions')}
              className="w-full text-left py-2 text-sm font-medium text-[var(--text)] flex justify-between items-center"
            >
              <span>Admissions</span>
              <i className={`bi bi-chevron-${openDropdown === 'admissions' ? 'up' : 'down'} text-xs`}></i>
            </button>
            {openDropdown === 'admissions' && (
              <div className="pl-4 space-y-2 py-2 bg-[var(--soft-bg)] rounded text-xs">
                <Link href="/admissions" onClick={() => setMobileMenuOpen(false)} className="block py-1">Overview</Link>
                <Link href="/admissions/requirements" onClick={() => setMobileMenuOpen(false)} className="block py-1">Requirements</Link>
                <Link href="/admissions/process" onClick={() => setMobileMenuOpen(false)} className="block py-1">Process</Link>
                <Link href="/admissions/fees" onClick={() => setMobileMenuOpen(false)} className="block py-1">Fees</Link>
                <Link href="/admissions/dates" onClick={() => setMobileMenuOpen(false)} className="block py-1">Key Dates</Link>
                <Link href="/admissions/downloads" onClick={() => setMobileMenuOpen(false)} className="block py-1">Downloads</Link>
                <Link href="/admissions/apply" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-semibold text-[var(--primary)]">Apply Now</Link>
              </div>
            )}
          </div>

          {/* Mobile School Life Accordion */}
          <div className="border-b border-slate-100 py-1">
            <button
              onClick={() => toggleDropdown('life')}
              className="w-full text-left py-2 text-sm font-medium text-[var(--text)] flex justify-between items-center"
            >
              <span>School Life</span>
              <i className={`bi bi-chevron-${openDropdown === 'life' ? 'up' : 'down'} text-xs`}></i>
            </button>
            {openDropdown === 'life' && (
              <div className="pl-4 space-y-2 py-2 bg-[var(--soft-bg)] rounded text-xs">
                <Link href="/staff" onClick={() => setMobileMenuOpen(false)} className="block py-1">Staff Directory</Link>
                <Link href="/calendar" onClick={() => setMobileMenuOpen(false)} className="block py-1">Term Calendar</Link>
                <Link href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-1">Gallery</Link>
                <Link href="/pta" onClick={() => setMobileMenuOpen(false)} className="block py-1">PTA</Link>
                <Link href="/alumni" onClick={() => setMobileMenuOpen(false)} className="block py-1">Alumni Network</Link>
              </div>
            )}
          </div>

          <Link href="/news" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-slate-100">
            News
          </Link>
          <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-slate-100">
            Events
          </Link>
          <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-slate-100">
            FAQ
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium border-b border-slate-100">
            Contact Us
          </Link>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold text-[var(--primary)] border border-[var(--primary)] rounded"
            >
              Portal Login
            </Link>
            <Link
              href="/admissions/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[var(--primary)] rounded"
            >
              Apply for Admission
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
