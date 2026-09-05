import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/staff/', '/student/', '/parent/', '/api/'],
    },
    sitemap: 'https://jasmineexclusiveschool.edu.ng/sitemap.xml',
  };
}
