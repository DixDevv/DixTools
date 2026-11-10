/**
 * ============================================================================
 * Dix Tools — Official Web App Manifest (`app/manifest.js`)
 * Luxury Black (`#0A0A0A`) & Royal Gold (`#D4AF37`) Standalone PWA Configuration
 * ============================================================================
 */
export default function manifest() {
  return {
    id: '/',
    name: 'Dix Tools | منصة ديكس تولز للخدمات والأدوات الذكية',
    short_name: 'Dix Tools',
    description:
      'منصة ديكس تولز للخدمات والأدوات الذكية: أكثر من 52 أداة رئيسية شاملة للذهب والزكاة، العملات، القروض، السيارات، استوديو الصور، والعقود الرسمية A4 تعمل بسرعة فائقة من هاتفك.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    dir: 'rtl',
    lang: 'ar-EG',
    background_color: '#0A0A0A',
    theme_color: '#D4AF37',
    categories: ['finance', 'utilities', 'productivity', 'business'],
    icons: [
      {
        src: '/assets/aistudio/MY_LOGO__e0c9a45b.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/aistudio/MY_LOGO__e0c9a45b.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/aistudio/MY_LOGO__e0c9a45b.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
