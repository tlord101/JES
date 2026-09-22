import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';

/**
 * School identity and contact details, read from the `site_settings` table so
 * the administration can change them without a deployment.
 *
 * The defaults mirror the seeded values so the public website still renders
 * while a new deployment is being connected to Supabase.
 */
export type SiteSettings = {
  schoolName: string;
  shortName: string;
  motto: string;
  tagline: string;
  description: string;
  addressCampus1: string;
  addressCampus2: string;
  city: string;
  state: string;
  country: string;
  phonePrimary: string;
  emailPrimary: string;
  officeHours: string;
  logoUrl: string;
  principalName: string;
  principalTitle: string;
  mission: string;
  vision: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  schoolName: 'Jasmine Exclusive School',
  shortName: 'JES',
  motto: 'Diligence for Excellence',
  tagline: 'Nurturing intellect. Building character.',
  description:
    'Nurturing intellectually excellent, morally sound and socially responsible children prepared to become agents of positive change in society.',
  addressCampus1:
    '12 Aitamegbe Street, Off Narrow Way Street, Off Reliance, Aduwawa, Benin City, Edo State.',
  addressCampus2: '7 Asemota Street, Off College Road, Aduwawa, Benin City, Edo State.',
  city: 'Benin City',
  state: 'Edo State',
  country: 'Nigeria',
  phonePrimary: '+234 806 078 2404',
  emailPrimary: 'jasmineexclusiveschool@gmail.com',
  officeHours: 'Monday - Friday, 7:30 AM - 4:00 PM',
  logoUrl: '',
  principalName: 'Dr. (Mrs.) E. O. Aigbe',
  principalTitle: 'Executive Principal',
  mission:
    'To diligently nurture children\u2019s intellectual inclination until they become excellent academically and morally sound, using a well-researched robust curriculum to teach social grace and courtesy.',
  vision: 'To raise excellent moral agents of change in our society.',
};

const KEY_MAP: Record<keyof SiteSettings, string> = {
  schoolName: 'school_name',
  shortName: 'short_name',
  motto: 'motto',
  tagline: 'tagline',
  description: 'description',
  addressCampus1: 'address_campus_1',
  addressCampus2: 'address_campus_2',
  city: 'city',
  state: 'state',
  country: 'country',
  phonePrimary: 'phone_primary',
  emailPrimary: 'email_primary',
  officeHours: 'office_hours',
  logoUrl: 'logo_url',
  principalName: 'principal_name',
  principalTitle: 'principal_title',
  mission: 'mission',
  vision: 'vision',
};

/** Reads every setting in one query and layers it over the defaults. */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSupabaseEnv()) return DEFAULT_SETTINGS;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('site_settings').select('key, value');

    if (error || !data) return DEFAULT_SETTINGS;

    const byKey = new Map(data.map((row) => [row.key, row.value]));
    const settings = { ...DEFAULT_SETTINGS };

    for (const property of Object.keys(KEY_MAP) as (keyof SiteSettings)[]) {
      const raw = byKey.get(KEY_MAP[property]);
      if (typeof raw === 'string' && raw.trim() !== '') {
        settings[property] = raw;
      }
    }

    return settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
