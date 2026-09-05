import { MetadataRoute } from 'next';
import { newsPosts } from '@/lib/cmsStore';
import { upcomingEvents } from '@/lib/cmsStore';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jasmineexclusiveschool.edu.ng';

  const staticRoutes = [
    '',
    '/about',
    '/about/mission-vision',
    '/about/principal',
    '/about/history',
    '/about/accreditation',
    '/about/values',
    '/admissions',
    '/admissions/process',
    '/admissions/requirements',
    '/admissions/fees',
    '/admissions/dates',
    '/admissions/apply',
    '/admissions/downloads',
    '/academics',
    '/academics/curriculum',
    '/academics/subjects',
    '/academics/clubs',
    '/academics/sports',
    '/academics/results',
    '/news',
    '/events',
    '/calendar',
    '/gallery',
    '/gallery/videos',
    '/pta',
    '/alumni',
    '/contact',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const newsRoutes = newsPosts.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const eventRoutes = upcomingEvents.map((evt) => ({
    url: `${baseUrl}/events/${evt.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes, ...eventRoutes];
}
