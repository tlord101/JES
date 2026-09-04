import Link from 'next/link';
import Image from 'next/image';
import { newsArticles } from '@/data/news';
import { eventsList } from '@/data/events';
import { subjectsList, clubsList } from '@/data/academic';
import { galleryAlbums } from '@/data/gallery';

export default function HomePage() {
  return (
    <div className="space-y-0 text-[var(--text)]">

      {/* SECTION 1: HERO */}
      <section className="bg-[var(--primary)] text-white py-16 md:py-24 border-b-4 border-[var(--primary-dark)]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3 py-1 bg-amber-500 text-slate-900 font-bold text-xs uppercase tracking-wider rounded">
              Diligence for Excellence
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Jasmine Exclusive School
            </h1>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light border-l-2 border-amber-400 pl-4">
              «Nurturing intellectually excellent, morally sound and socially responsible children prepared to become agents of positive change in society.»
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/admissions/apply"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded transition-colors flex items-center gap-2"
              >
                Apply for Admission <i className="bi bi-arrow-right"></i>
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 bg-white text-[var(--primary)] hover:bg-slate-100 font-bold text-sm rounded transition-colors flex items-center gap-2"
              >
                Explore Our School <i className="bi bi-compass"></i>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-2 rounded-md border border-slate-300">
              <div className="relative h-72 md:h-80 w-full rounded overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800"
                  alt="Jasmine Exclusive School Campus Building"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 bg-[var(--soft-bg)] text-xs text-[var(--muted-text)] text-center font-medium">
                Modern academic facility designed for holistic learning and safety.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SCHOOL INTRODUCTION */}
      <section className="py-16 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Welcome to JES</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary-dark)]">
              A Culture of Diligence, Character & Academic Distinction
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted-text)]">
              Jasmine Exclusive School was founded on the conviction that every child possesses unique potential that flourishes when guided by rigorous academic discipline, strong moral values, and social grace.
            </p>
            <p className="text-sm leading-relaxed text-[var(--muted-text)]">
              Located in Aduwawa, Benin City, Edo State, our campuses offer a serene, secure, and modern educational environment from Nursery through Secondary education.
            </p>
            <div className="pt-2">
              <Link href="/about/history" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
                Read our complete history <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-6 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md">
              <i className="bi bi-mortarboard text-3xl text-[var(--primary)] mb-2 block"></i>
              <span className="text-2xl font-extrabold text-[var(--primary-dark)] block">100%</span>
              <span className="text-xs text-[var(--muted-text)]">WAEC & BECE Pass Rate</span>
            </div>
            <div className="p-6 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md">
              <i className="bi bi-people text-3xl text-[var(--primary)] mb-2 block"></i>
              <span className="text-2xl font-extrabold text-[var(--primary-dark)] block">15:1</span>
              <span className="text-xs text-[var(--muted-text)]">Student-to-Teacher Ratio</span>
            </div>
            <div className="p-6 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md">
              <i className="bi bi-award text-3xl text-[var(--primary)] mb-2 block"></i>
              <span className="text-2xl font-extrabold text-[var(--primary-dark)] block">2</span>
              <span className="text-xs text-[var(--muted-text)]">Standard Campuses</span>
            </div>
            <div className="p-6 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md">
              <i className="bi bi-building text-3xl text-[var(--primary)] mb-2 block"></i>
              <span className="text-2xl font-extrabold text-[var(--primary-dark)] block">4+</span>
              <span className="text-xs text-[var(--muted-text)]">Active Student Clubs</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3, 4, 5: MISSION, VISION & CORE VALUES */}
      <section className="py-16 bg-[var(--soft-bg)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Our Foundation</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary-dark)]">Mission, Vision & Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white p-8 border border-[var(--border)] rounded-md space-y-3">
              <div className="flex items-center gap-3 text-[var(--primary)]">
                <i className="bi bi-bullseye text-2xl"></i>
                <h3 className="text-xl font-bold">Our Mission</h3>
              </div>
              <p className="text-sm text-[var(--muted-text)] leading-relaxed italic border-l-2 border-[var(--primary)] pl-3">
                «To diligently nurture children&apos;s intellectual inclination until they become excellent academically and morally sound, using a well-researched robust curriculum to teach social grace and courtesy.»
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 border border-[var(--border)] rounded-md space-y-3">
              <div className="flex items-center gap-3 text-[var(--primary)]">
                <i className="bi bi-eye text-2xl"></i>
                <h3 className="text-xl font-bold">Our Vision</h3>
              </div>
              <p className="text-sm text-[var(--muted-text)] leading-relaxed italic border-l-2 border-[var(--primary)] pl-3">
                «To raise excellent moral agents of change in our society.»
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-4">
            <h3 className="text-center text-lg font-bold text-[var(--primary-dark)]">Pillars of Excellence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-[var(--border)] rounded-md space-y-2">
                <i className="bi bi-shield-check text-2xl text-[var(--primary)]"></i>
                <h4 className="font-bold text-base text-[var(--text)]">Diligence</h4>
                <p className="text-xs text-[var(--muted-text)]">Persistent effort and thorough dedication in all academic and personal pursuits.</p>
              </div>
              <div className="bg-white p-6 border border-[var(--border)] rounded-md space-y-2">
                <i className="bi bi-star text-2xl text-[var(--primary)]"></i>
                <h4 className="font-bold text-base text-[var(--text)]">Excellence</h4>
                <p className="text-xs text-[var(--muted-text)]">Striving for the highest standard of moral, intellectual, and social output.</p>
              </div>
              <div className="bg-white p-6 border border-[var(--border)] rounded-md space-y-2">
                <i className="bi bi-heart text-2xl text-[var(--primary)]"></i>
                <h4 className="font-bold text-base text-[var(--text)]">Social Grace</h4>
                <p className="text-xs text-[var(--muted-text)]">Politeness, respect, decorum, and courtesy in all social interactions.</p>
              </div>
              <div className="bg-white p-6 border border-[var(--border)] rounded-md space-y-2">
                <i className="bi bi-[var(--primary)] bi-person-check text-2xl text-[var(--primary)]"></i>
                <h4 className="font-bold text-base text-[var(--text)]">Integrity</h4>
                <p className="text-xs text-[var(--muted-text)]">Upright moral character, honesty, and responsibility to the community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE JES */}
      <section className="py-16 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Distinction</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary-dark)]">Why Choose Jasmine Exclusive School?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-[var(--border)] rounded-md space-y-3 bg-[var(--soft-bg)]">
              <i className="bi bi-journal-bookmark text-3xl text-[var(--primary)]"></i>
              <h3 className="font-bold text-lg text-[var(--text)]">Robust Dual Curriculum</h3>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                Combining Nigerian national educational standards with international best practices to ensure well-rounded cognitive development.
              </p>
            </div>

            <div className="p-6 border border-[var(--border)] rounded-md space-y-3 bg-[var(--soft-bg)]">
              <i className="bi bi-person-badge text-3xl text-[var(--primary)]"></i>
              <h3 className="font-bold text-lg text-[var(--text)]">Dedicated Educators</h3>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                Highly qualified, passionate teachers who mentor students individually and track performance closely.
              </p>
            </div>

            <div className="p-6 border border-[var(--border)] rounded-md space-y-3 bg-[var(--soft-bg)]">
              <i className="bi bi-shield-lock text-3xl text-[var(--primary)]"></i>
              <h3 className="font-bold text-lg text-[var(--text)]">Safe & Serene Facilities</h3>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                Two purpose-built campuses with modern science labs, computer suites, library resources, and security surveillance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: ACADEMIC EXCELLENCE */}
      <section className="py-16 bg-[var(--soft-bg)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Academic Standards</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary-dark)]">
              Uncompromising Standards of Academic Excellence
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted-text)]">
              At JES, academic rigor is matched with supportive teaching methodologies. Our continuous assessment system ensures no child is left behind, fostering deep understanding rather than rote memorization.
            </p>
            <ul className="space-y-2 text-xs text-[var(--text)]">
              <li className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-[var(--success)]"></i>
                Comprehensive STEM and Humanities learning modules
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-[var(--success)]"></i>
                Continuous diagnostic testing and personalized tutoring
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-[var(--success)]"></i>
                State and national academic competition training
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/academics/curriculum"
                className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded hover:bg-[var(--primary-dark)] transition-colors inline-block"
              >
                Explore Curriculum Details
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 border border-[var(--border)] rounded-md space-y-4">
            <h3 className="font-bold text-base text-[var(--primary-dark)] border-b border-slate-200 pb-2">
              Academic Divisions
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--soft-bg)] rounded border border-slate-200">
                <h4 className="font-bold text-sm text-[var(--text)]">Early Years & Creche</h4>
                <p className="text-xs text-[var(--muted-text)]">Foundational motor skills, phonics, numbers, and social grace in a warm environment.</p>
              </div>
              <div className="p-3 bg-[var(--soft-bg)] rounded border border-slate-200">
                <h4 className="font-bold text-sm text-[var(--text)]">Primary Education</h4>
                <p className="text-xs text-[var(--muted-text)]">Core literacy, numeracy, basic science, civic values, and creative arts.</p>
              </div>
              <div className="p-3 bg-[var(--soft-bg)] rounded border border-slate-200">
                <h4 className="font-bold text-sm text-[var(--text)]">Secondary Education (JSS & SSS)</h4>
                <p className="text-xs text-[var(--muted-text)]">Preparation for BECE, WAEC, NECO, and tertiary education readiness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 & 9: SUBJECTS & CLUBS PREVIEW */}
      <section className="py-16 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 space-y-12">

          {/* Subjects */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Learning Spectrum</span>
                <h2 className="text-2xl font-bold text-[var(--primary-dark)]">Core Subjects Offered</h2>
              </div>
              <Link href="/academics/subjects" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
                View all subjects <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjectsList.slice(0, 4).map((sub) => (
                <div key={sub.code} className="p-4 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
                  <div className="text-xs font-bold text-amber-600 uppercase">{sub.code} • {sub.department}</div>
                  <h3 className="font-bold text-sm text-[var(--text)]">{sub.name}</h3>
                  <p className="text-xs text-[var(--muted-text)] line-clamp-2">{sub.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clubs */}
          <div className="space-y-6 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Co-Curricular</span>
                <h2 className="text-2xl font-bold text-[var(--primary-dark)]">Student Clubs & Societies</h2>
              </div>
              <Link href="/academics/clubs" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
                Explore all clubs <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {clubsList.map((club) => (
                <Link
                  key={club.slug}
                  href={`/academics/clubs/${club.slug}`}
                  className="p-5 border border-[var(--border)] rounded bg-white hover:border-[var(--primary)] transition-colors space-y-2 group"
                >
                  <i className={`bi ${club.icon} text-2xl text-[var(--primary)] group-hover:text-[var(--primary-dark)] block`}></i>
                  <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--primary)]">{club.name}</h3>
                  <p className="text-xs text-[var(--muted-text)] italic">&quot;{club.motto}&quot;</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 10: PRINCIPAL'S MESSAGE */}
      <section className="py-16 bg-[var(--primary-light)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <div className="bg-white p-2 border border-[var(--border)] rounded text-center">
              <div className="relative h-64 w-full rounded overflow-hidden mb-3">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                  alt="Dr. (Mrs.) E. O. Aigbe - Executive Principal"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-base text-[var(--primary-dark)]">Dr. (Mrs.) E. O. Aigbe</h3>
              <p className="text-xs text-[var(--muted-text)] font-medium">Executive Principal</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Leadership Message</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary-dark)]">Welcome from the Principal</h2>
            <p className="text-sm leading-relaxed text-[var(--text)] italic border-l-4 border-[var(--primary)] pl-4">
              «Welcome to Jasmine Exclusive School. Our mission is built on the unwavering commitment to provide an education that nurtures both the mind and the soul. We believe that intelligence without moral discipline is incomplete. Through our motto, Diligence for Excellence, we inspire our students to embrace hard work, integrity, and social grace.»
            </p>
            <div className="pt-2">
              <Link
                href="/about/principal"
                className="px-4 py-2 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-bold rounded transition-colors inline-block"
              >
                Read Full Principal&apos;s Address
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 & 12: LATEST NEWS & UPCOMING EVENTS */}
      <section className="py-16 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Latest News */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-[var(--primary-dark)]">Latest News</h2>
              <Link href="/news" className="text-xs font-bold text-[var(--primary)] hover:underline">View All News</Link>
            </div>

            <div className="space-y-4">
              {newsArticles.slice(0, 2).map((news) => (
                <div key={news.slug} className="p-4 border border-[var(--border)] rounded bg-[var(--soft-bg)] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="relative h-32 w-full rounded overflow-hidden sm:col-span-1">
                    <Image src={news.image} alt={news.title} fill className="object-cover" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">{news.category}</span>
                    <h3 className="font-bold text-sm text-[var(--text)] leading-tight">
                      <Link href={`/news/${news.slug}`} className="hover:text-[var(--primary)]">{news.title}</Link>
                    </h3>
                    <p className="text-xs text-[var(--muted-text)] line-clamp-2">{news.summary}</p>
                    <div className="text-[11px] text-slate-400">{news.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-[var(--primary-dark)]">Upcoming Events</h2>
              <Link href="/events" className="text-xs font-bold text-[var(--primary)] hover:underline">View Calendar</Link>
            </div>

            <div className="space-y-3">
              {eventsList.slice(0, 3).map((event) => (
                <div key={event.slug} className="p-4 border border-[var(--border)] rounded bg-white space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded">
                      {event.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{event.date}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text)]">
                    <Link href={`/events/${event.slug}`} className="hover:text-[var(--primary)]">{event.title}</Link>
                  </h3>
                  <div className="text-xs text-[var(--muted-text)] flex items-center gap-3 pt-1">
                    <span><i className="bi bi-clock mr-1"></i>{event.time}</span>
                    <span><i className="bi bi-geo-alt mr-1"></i>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 13: GALLERY PREVIEW */}
      <section className="py-16 bg-[var(--soft-bg)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex justify-between items-end border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Campus Life in Pictures</span>
              <h2 className="text-2xl font-bold text-[var(--primary-dark)]">Gallery Highlights</h2>
            </div>
            <Link href="/gallery" className="text-xs font-bold text-[var(--primary)] hover:underline">Explore Full Gallery</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryAlbums.slice(0, 3).map((album) => (
              <Link key={album.slug} href={`/gallery/${album.slug}`} className="group bg-white border border-[var(--border)] rounded overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={album.coverImage} alt={album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">{album.category} • {album.date}</span>
                  <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--primary)]">{album.title}</h3>
                  <p className="text-xs text-[var(--muted-text)] line-clamp-1">{album.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 14 & 15: ADMISSION CTA & CONTACT CTA */}
      <section className="py-16 bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Admission CTA */}
          <div className="p-8 bg-[var(--primary-dark)] border border-slate-700 rounded-md space-y-4">
            <i className="bi bi-pencil-square text-3xl text-amber-400"></i>
            <h3 className="text-2xl font-bold">Admissions Now Open</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enroll your child for the upcoming academic session. Experience dedicated teaching, character development, and academic excellence.
            </p>
            <div className="pt-2">
              <Link
                href="/admissions/apply"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-colors inline-flex items-center gap-2"
              >
                Start Application <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="p-8 bg-[var(--primary-dark)] border border-slate-700 rounded-md space-y-4">
            <i className="bi bi-telephone-inbound text-3xl text-amber-400"></i>
            <h3 className="text-2xl font-bold">Schedule a Campus Visit</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Have questions or want to tour our facilities in Aduwawa, Benin City? Reach out to our admissions counselor today.
            </p>
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-white text-[var(--primary)] hover:bg-slate-100 font-bold text-xs rounded transition-colors inline-flex items-center gap-2"
              >
                Contact Admissions <i className="bi bi-envelope"></i>
              </Link>
              <span className="text-xs text-slate-300">Call: <strong>+234 806 078 2404</strong></span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
