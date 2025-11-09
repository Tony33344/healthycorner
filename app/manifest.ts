import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Healthy Corner - Alpine Wellness Retreat',
    short_name: 'Healthy Corner',
    description: 'Transform your health with yoga, Wim Hof method, ice baths, and organic nutrition in the Slovenian Alps.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10b981',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['health', 'lifestyle', 'wellness'],
    lang: 'en',
    dir: 'ltr',
  };
}
