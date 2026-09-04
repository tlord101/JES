export interface GalleryPhoto {
  url: string;
  caption: string;
}

export interface GalleryAlbum {
  slug: string;
  title: string;
  category: string;
  date: string;
  coverImage: string;
  description: string;
  photos: GalleryPhoto[];
}

export interface GalleryVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

export const galleryAlbums: GalleryAlbum[] = [
  {
    slug: "inter-house-sports-2024",
    title: "Annual Inter-House Sports Competition",
    category: "Sports",
    date: "November 2024",
    coverImage: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=800",
    description: "Highlights from our energetic sports day filled with track events, relay races, and house spirit.",
    photos: [
      { url: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=800", caption: "Track sprint finals" },
      { url: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800", caption: "High jump competition" },
      { url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800", caption: "Relay baton exchange" }
    ]
  },
  {
    slug: "stem-fair-2024",
    title: "STEM Innovation & Science Exhibition",
    category: "Academics",
    date: "June 2024",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    description: "Students presenting groundbreaking science models and robotics projects.",
    photos: [
      { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", caption: "Robotics demonstration" },
      { url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800", caption: "Chemistry experiment exhibition" }
    ]
  },
  {
    slug: "cultural-day-2024",
    title: "Cultural Heritage Showcase",
    category: "Culture",
    date: "October 2024",
    coverImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
    description: "Celebrating Nigerian rich cultural heritage through music, dance, and traditional attire.",
    photos: [
      { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800", caption: "Traditional dance performance" }
    ]
  }
];

export const galleryVideos: GalleryVideo[] = [
  {
    id: "jes-documentary-2024",
    title: "Jasmine Exclusive School - Campus Life & Academic Vision",
    duration: "4:15",
    thumbnail: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "valedictory-service-2024",
    title: "2024 Graduation & Valedictory Ceremony Highlights",
    duration: "6:30",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];
