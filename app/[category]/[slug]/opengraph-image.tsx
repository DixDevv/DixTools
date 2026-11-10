import React from 'react';
import { getToolBySlug, SITE_CONFIG } from '../../../lib/tools-matrix-generator';

export const runtime = 'edge';
export const alt = 'صورة الأداة التفاعلية - Dix Tools';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * Dynamic OpenGraph Image Generator for all 5,000+ Programmatic Routes
 * Renders a customized Black & Gold 1200x630 social card with the tool's
 * specific symbols, category, Arabic title, and the golden "Dix Tools" watermark badge in the corner.
 */
export default async function OpenGraphImage({ params }: { params: { category: string; slug: string } }) {
  const resolved = await Promise.resolve(params);
  const tool = getToolBySlug(resolved?.category, resolved?.slug);
  const visual = tool?.visualConfig || {
    primarySymbol: 'DIX',
    secondarySymbol: 'TOOLS',
    accentLabel: 'Dix Tools',
  };

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #141414 60%, #1F1808 100%)',
        padding: '64px',
        color: '#FFFFFF',
        fontFamily: 'Cairo, sans-serif',
        border: '4px solid #D4AF37',
      }}
    >
      {/* Golden "Dix Tools" Corner Watermark Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 20px',
          borderRadius: '14px',
          background: 'rgba(20, 20, 20, 0.92)',
          border: '2px solid #D4AF37',
          boxShadow: '0 0 24px rgba(212, 175, 55, 0.45)',
        }}
      >
        <span
          style={{
            color: '#D4AF37',
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '0.5px',
          }}
        >
          Dix
        </span>
        <span
          style={{
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: 800,
          }}
        >
          Tools
        </span>
        <span
          style={{
            color: '#F3E5AB',
            fontSize: '14px',
            fontWeight: 600,
            marginLeft: '6px',
          }}
        >
          · منصة ديكس تولز للأدوات الذكية
        </span>
      </div>

      {/* Right Column: Arabic Tool Identity */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'right',
          maxWidth: '720px',
        }}
      >
        <div
          style={{
            color: '#D4AF37',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '16px',
          }}
        >
          Dix Tools · {tool?.categoryName || 'منصة ديكس تولز للأدوات الذكية'}
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontSize: '46px',
            fontWeight: 800,
            lineHeight: 1.3,
            marginBottom: '24px',
          }}
        >
          {tool?.title}
        </div>
        <div
          style={{
            color: '#F3E5AB',
            fontSize: '28px',
            fontWeight: 600,
            marginBottom: '28px',
          }}
        >
          {tool?.subtitle}
        </div>
        <div
          style={{
            color: '#94A3B8',
            fontSize: '20px',
          }}
        >
          أداة ذكية مجانية تعمل 100% من المتصفح · Dix Tools
        </div>
      </div>

      {/* Left Column: 3D Gold Badge Box */}
      <div
        style={{
          width: '340px',
          height: '340px',
          borderRadius: '36px',
          background: '#111111',
          border: '3px solid #D4AF37',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.75)',
        }}
      >
        <div
          style={{
            color: '#F3E5AB',
            fontSize: '56px',
            fontWeight: 800,
            marginBottom: '12px',
          }}
        >
          {visual.primarySymbol}
        </div>
        <div
          style={{
            width: '180px',
            height: '2px',
            background: '#D4AF37',
            marginBottom: '16px',
          }}
        />
        <div
          style={{
            color: '#D4AF37',
            fontSize: '36px',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          {visual.secondarySymbol}
        </div>
        <div
          style={{
            color: '#94A3B8',
            fontSize: '18px',
          }}
        >
          {visual.accentLabel}
        </div>
      </div>
    </div>
  );
}
