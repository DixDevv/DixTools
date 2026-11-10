'use client';

import React from 'react';
import { SITE_CONFIG } from '../lib/tools-matrix-generator';
import {
  getFreshnessSignals,
  getDeterministicRating,
  buildFreshToolSeoMeta,
} from '../lib/seo-freshness-engine';

/**
 * ============================================================================
 * 6-Layer Interconnected JSON-LD `@graph` Engine (`components/SEOJsonLdGraph.jsx`)
 * Combines in a single `<script type="application/ld+json">` payload:
 * 1. WebApplication & SoftwareApplication (`isAccessibleForFree: true`)
 * 2. AggregateRating (Unique deterministic rating 4.8-4.9 & reviewCount per slug)
 * 3. Dataset Schema (Exposes pre-calculated conversion/price tables to Google & AI)
 * 4. HowTo Schema (Step-by-step instructions with `totalTime: PT1M`)
 * 5. FAQPage Schema (Structured Q&A pairs for Rich Snippets)
 * 6. BreadcrumbList Schema (`Dix Tools > القسم > الأداة`)
 * ============================================================================
 */
export default function SEOJsonLdGraph({ tool, liveRates = null, preCalculatedRows = [] }) {
  if (!tool) return null;

  const domain = SITE_CONFIG.domain || 'https://dixtools.com';
  const canonicalUrl = `${domain}/${tool.category}/${tool.slug}`;
  const freshness = getFreshnessSignals();
  const rating = getDeterministicRating(tool.slug);
  const { freshTitle, freshDescription } = buildFreshToolSeoMeta(tool, liveRates);

  const stepsList =
    tool.steps && tool.steps.length > 0
      ? tool.steps
      : [
          `اختر الإعدادات أو الوحدات المطلوبة داخل ${tool.shortTitle}.`,
          'أدخل القيمة الرقمية في الحقل المخصص ليتم الحساب لحظياً بدون تحديث الصفحة.',
          'انسخ النتيجة النهائية أو اطبع التقرير الرسمي بصيغة A4 / PDF مجاناً.',
        ];

  const faqsList =
    tool.faqs && tool.faqs.length > 0
      ? tool.faqs
      : [
          {
            question: `كيف أستخدم ${tool.title} على منصة Dix Tools؟`,
            answer:
              tool.summary ||
              'أدخل القيم المطلوبة في الخانات المخصصة وستظهر النتيجة التفصيلية فوراً من المتصفح.',
          },
        ];

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1 & 2. WebApplication + SoftwareApplication + Deterministic AggregateRating
      {
        '@type': ['WebApplication', 'SoftwareApplication'],
        '@id': `${canonicalUrl}#software`,
        name: freshTitle,
        alternateName: tool.shortTitle || tool.title,
        url: canonicalUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        isAccessibleForFree: true,
        inLanguage: 'ar',
        datePublished: freshness.datePublished,
        dateModified: freshness.dateModified,
        description: freshDescription,
        publisher: {
          '@type': 'Organization',
          name: 'Dix Tools',
          alternateName: 'منصة ديكس تولز للخدمات والأدوات الذكية',
          url: domain,
          logo: `${domain}/assets/aistudio/MY_LOGO__e0c9a45b.png`,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EGP',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.ratingValue,
          bestRating: rating.bestRating,
          worstRating: rating.worstRating,
          ratingCount: rating.ratingCount,
          reviewCount: rating.reviewCount,
        },
      },

      // 3. Dataset Schema (For Pre-Calculated Matrix Tables & AI Overviews)
      {
        '@type': 'Dataset',
        '@id': `${canonicalUrl}#dataset`,
        name: `جدول بيانات وحسابات ${tool.shortTitle || tool.title} (${freshness.arabicFullDate})`,
        description: `قاعدة بيانات وجدول القيم المحسوبة مسبقاً لأداة ${tool.title} المحدثة بتاريخ ${freshness.arabicFullDate} عبر منصة Dix Tools.`,
        url: `${canonicalUrl}#precalculated-matrix-table`,
        isAccessibleForFree: true,
        inLanguage: 'ar',
        datePublished: freshness.datePublished,
        dateModified: freshness.dateModified,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        creator: {
          '@type': 'Organization',
          name: 'Dix Tools',
          url: domain,
        },
        keywords: (tool.keywords || [tool.shortTitle, 'Dix Tools']).join(', '),
        variableMeasured: preCalculatedRows.slice(0, 5).map((r) => `${r.col1}: ${r.col2}`),
      },

      // 4. HowTo Schema (Step-by-step usage with PT1M duration)
      {
        '@type': 'HowTo',
        '@id': `${canonicalUrl}#howto`,
        name: `طريقة استخدام ${tool.shortTitle || tool.title} خطوة بخطوة`,
        description: `دليل عملي سريع لاستخدام ${tool.title} والحصول على النتيجة الدقيقة في أقل من دقيقة واحدة.`,
        totalTime: 'PT1M',
        inLanguage: 'ar',
        step: stepsList.map((stepText, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: `الخطوة ${idx + 1}`,
          text: stepText,
          url: `${canonicalUrl}#step-${idx + 1}`,
        })),
      },

      // 5. FAQPage Schema
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqsList.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },

      // 6. BreadcrumbList Schema (Dix Tools > Category > Tool)
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Dix Tools',
            item: domain,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.categoryName || 'الأدوات الذكية',
            item: `${domain}/${tool.category}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.shortTitle || tool.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      data-testid="seo-jsonld-graph"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
    />
  );
}
