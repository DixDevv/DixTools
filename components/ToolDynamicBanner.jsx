'use client';

import React from 'react';

/**
 * ToolDynamicBanner Component
 * Automatically synthesizes a unique Luxury Black & Gold 3D-styled SVG Featured Artwork
 * for every single one of the 5,000+ generated tools using its visualConfig, engineType,
 * primary/secondary symbols, and Arabic title.
 */
export default function ToolDynamicBanner({ tool, compact = false }) {
  if (!tool) return null;

  const visual = tool.visualConfig || {
    primarySymbol: 'MEEZAN',
    secondarySymbol: 'PRO',
    accentLabel: tool.categoryName || 'أداة ذكية',
  };

  // Deterministic geometric pattern angle from slug characters
  const slugHash = (tool.slug || 'meezan')
    .split('')
    .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
  const ringOffset = (slugHash % 40) - 20;

  if (compact) {
    return (
      <div
        aria-hidden="true"
        className="relative w-full h-28 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#0A0A0A] select-none"
      >
        <svg
          viewBox="0 0 600 180"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`bg-${slugHash}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0A0A0A" />
              <stop offset="55%" stopColor="#141414" />
              <stop offset="100%" stopColor="#1E190D" />
            </linearGradient>
            <linearGradient id={`gold-${slugHash}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#F3E5AB" />
              <stop offset="100%" stopColor="#AA8220" />
            </linearGradient>
          </defs>

          <rect width="600" height="180" fill={`url(#bg-${slugHash})`} />

          {/* Subtle Architectural Grid & Rings */}
          <circle
            cx={120 + ringOffset}
            cy="90"
            r="110"
            fill="none"
            stroke="#D4AF37"
            strokeOpacity="0.14"
            strokeWidth="1.5"
          />
          <circle
            cx={120 + ringOffset}
            cy="90"
            r="75"
            fill="none"
            stroke="#F3E5AB"
            strokeOpacity="0.2"
            strokeWidth="1"
            strokeDasharray="6 6"
          />

          {/* 3D Gold Emblem Box on Left */}
          <g transform="translate(36, 36)">
            <rect
              width="175"
              height="108"
              rx="16"
              fill="#111111"
              stroke={`url(#gold-${slugHash})`}
              strokeWidth="2"
            />
            <text
              x="87.5"
              y="48"
              textAnchor="middle"
              fill="#F3E5AB"
              fontFamily="Cairo, IBM Plex Mono, sans-serif"
              fontWeight="800"
              fontSize="22"
            >
              {visual.primarySymbol}
            </text>
            <line
              x1="30"
              y1="62"
              x2="145"
              y2="62"
              stroke="#D4AF37"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
            <text
              x="87.5"
              y="88"
              textAnchor="middle"
              fill="#D4AF37"
              fontFamily="Cairo, IBM Plex Mono, sans-serif"
              fontWeight="700"
              fontSize="16"
            >
              {visual.secondarySymbol}
            </text>
          </g>

          {/* Right Side Category & Accent Label */}
          <text
            x="568"
            y="65"
            direction="ltr"
            textAnchor="end"
            fill="#D4AF37"
            fontFamily="Cairo, sans-serif"
            fontWeight="700"
            fontSize="14"
          >
            {tool.categoryName}
          </text>
          <text
            x="568"
            y="102"
            direction="ltr"
            textAnchor="end"
            fill="#FFFFFF"
            fontFamily="Cairo, sans-serif"
            fontWeight="800"
            fontSize="17"
          >
            {(tool.shortTitle || tool.title).slice(0, 36)}
          </text>
          <text
            x="568"
            y="136"
            direction="ltr"
            textAnchor="end"
            fill="#94A3B8"
            fontFamily="Cairo, sans-serif"
            fontWeight="500"
            fontSize="13"
          >
            {visual.accentLabel}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      data-testid="tool-dynamic-banner"
      className="no-print relative w-full rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#0A0A0A] shadow-2xl"
    >
      <svg
        viewBox="0 0 1200 320"
        direction="ltr"
        className="w-full h-auto max-h-[260px] object-cover"
        role="img"
        aria-label={`الصورة البارزة المولدة تلقائياً لأداة ${tool.title}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="luxuryBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#080808" />
            <stop offset="50%" stopColor="#121212" />
            <stop offset="100%" stopColor="#1C1608" />
          </linearGradient>
          <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3E5AB" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7B1C" />
          </linearGradient>
        </defs>

        {/* Luxury Dark Background */}
        <rect width="1200" height="320" fill="url(#luxuryBg)" />

        {/* Subtle Architectural Grid Lines */}
        <g stroke="#D4AF37" strokeOpacity="0.08" strokeWidth="1">
          <line x1="0" y1="80" x2="1200" y2="80" />
          <line x1="0" y1="160" x2="1200" y2="160" />
          <line x1="0" y1="240" x2="1200" y2="240" />
          <line x1="300" y1="0" x2="300" y2="320" />
          <line x1="600" y1="0" x2="600" y2="320" />
          <line x1="900" y1="0" x2="900" y2="320" />
        </g>

        {/* Left 3D Isometric Gold Vault / Engine Emblem */}
        <g transform="translate(55, 42)">
          <rect
            x="10"
            y="10"
            width="290"
            height="226"
            rx="26"
            fill="#0A0A0A"
            stroke="#D4AF37"
            strokeOpacity="0.25"
            strokeWidth="2"
          />
          <rect
            x="0"
            y="0"
            width="290"
            height="226"
            rx="26"
            fill="#141414"
            stroke="url(#goldMetallic)"
            strokeWidth="2.5"
          />
          <circle
            cx="145"
            cy="113"
            r="86"
            fill="none"
            stroke="#D4AF37"
            strokeOpacity="0.22"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <text
            x="145"
            y="95"
            textAnchor="middle"
            fill="url(#goldMetallic)"
            fontFamily="Cairo, IBM Plex Mono, sans-serif"
            fontWeight="800"
            fontSize="38"
          >
            {visual.primarySymbol}
          </text>
          <line
            x1="55"
            y1="118"
            x2="235"
            y2="118"
            stroke="#D4AF37"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <text
            x="145"
            y="158"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Cairo, IBM Plex Mono, sans-serif"
            fontWeight="700"
            fontSize="26"
          >
            {visual.secondarySymbol}
          </text>
          <text
            x="145"
            y="196"
            textAnchor="middle"
            fill="#D4AF37"
            fontFamily="Cairo, sans-serif"
            fontWeight="600"
            fontSize="14"
          >
            {visual.accentLabel}
          </text>
        </g>

        {/* Right Side Arabic Title & Programmatic SEO Metadata */}
        <text
          x="1140"
          y="78"
          direction="ltr"
          textAnchor="end"
          fill="#D4AF37"
          fontFamily="Cairo, sans-serif"
          fontWeight="700"
          fontSize="18"
        >
          Dix Tools · {tool.categoryName}
        </text>

        <text
          x="1140"
          y="142"
          direction="ltr"
          textAnchor="end"
          fill="#FFFFFF"
          fontFamily="Cairo, sans-serif"
          fontWeight="800"
          fontSize="26"
        >
          {(tool.shortTitle || tool.title || '').slice(0, 48)}
        </text>

        <text
          x="1140"
          y="195"
          direction="ltr"
          textAnchor="end"
          fill="#F3E5AB"
          fontFamily="Cairo, sans-serif"
          fontWeight="600"
          fontSize="18"
        >
          {String(tool.subtitle || visual.accentLabel || '').length > 64
            ? `${String(tool.subtitle || visual.accentLabel).slice(0, 62)}...`
            : tool.subtitle || visual.accentLabel}
        </text>

        <text
          x="1140"
          y="252"
          direction="ltr"
          textAnchor="end"
          fill="#94A3B8"
          fontFamily="Cairo, sans-serif"
          fontWeight="500"
          fontSize="16"
        >
          معالجة فورية 100% من المتصفح · دقة قياسية · Dix Tools
        </text>

        {/* Golden "Dix Tools" Corner Watermark Badge */}
        <g transform="translate(970, 272)">
          <rect
            width="170"
            height="34"
            rx="10"
            fill="#141414"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />
          <text
            x="85"
            y="22"
            textAnchor="middle"
            fill="#D4AF37"
            fontFamily="Cairo, IBM Plex Mono, sans-serif"
            fontWeight="800"
            fontSize="14"
          >
            Dix Tools ★
          </text>
        </g>
      </svg>
    </div>
  );
}
