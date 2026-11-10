import React from 'react';
import toolsConfig from '../data/tools-config.json';
import LiveEgyptTicker from '../components/LiveEgyptTicker';
import PWAInstallBanner from '../components/PWAInstallBanner';

export const DEFAULT_SITE_TITLE = 'Dix Tools | منصة الأدوات والخدمات الذكية الشاملة';

export const viewport = {
  themeColor: '#D4AF37',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL('https://dixtools.com'),
  title: {
    template: '%s | Dix Tools',
    default: 'Dix Tools | منصة الأدوات والخدمات الذكية الشاملة',
  },
  applicationName: 'Dix Tools',
  manifest: '/manifest.json',
  description:
    'منصة ديكس تولز للخدمات والأدوات الذكية (Dix Tools): حاسبات الذهب والزكاة، العملات، القروض، السيارات، استوديو الصور والـ QR، ومولدات العقود الرسمية A4.',
  keywords: toolsConfig.tools.flatMap((t) => t.keywords),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dix Tools',
  },
  icons: {
    icon: '/assets/aistudio/MY_LOGO__e0c9a45b.png',
    apple: '/assets/aistudio/MY_LOGO__e0c9a45b.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: DEFAULT_SITE_TITLE,
    description:
      'منصة ديكس تولز للخدمات والأدوات الذكية (Dix Tools): أكثر من 52 أداة رئيسية شاملة تعمل 100% من المتصفح.',
    url: 'https://dixtools.com',
    siteName: 'Dix Tools',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SITE_TITLE,
    description:
      'منصة ديكس تولز للخدمات والأدوات الذكية (Dix Tools): أكثر من 52 أداة رئيسية شاملة تعمل 100% من المتصفح.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4AF37" />
        <link rel="apple-touch-icon" href="/assets/aistudio/MY_LOGO__e0c9a45b.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;600&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${toolsConfig.site.adsensePublisherId}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#0A0A0A] text-slate-100 antialiased min-h-screen flex flex-col">
        <LiveEgyptTicker />
        <PWAInstallBanner variant="mobile-bar" />
        {children}
      </body>
    </html>
  );
}
