'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, ExternalLink, X, Link2 } from 'lucide-react';
import { SITE_CONFIG } from '../lib/tools-matrix-generator';

/**
 * ============================================================================
 * Automatic Backlink Magnet (`components/EmbedToolModal.jsx`)
 * Renders the "🔗 ضمّن هذه الأداة في موقعك مجاناً (Embed)" button below every tool
 * and opens a modal with a lightweight `<iframe>` + mandatory dofollow backlink
 * to Dix Tools (`https://dixtools.com/...`).
 * ============================================================================
 */
export default function EmbedToolModal({ tool }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!tool) return null;

  const domain = SITE_CONFIG.domain || 'https://dixtools.com';
  const canonicalToolUrl = `${domain}/${tool.category}/${tool.slug}`;
  const liveOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : domain;
  const embedSrcUrl = `${liveOrigin}/#/embed/${tool.slug}`;
  const seoEmbedUrl = `${domain}/embed/${tool.slug}`;

  const iframeEmbedSnippet = `<!-- بداية كود تضمين أداة ${tool.shortTitle || tool.title} من منصة Dix Tools -->
<div style="max-width:760px;margin:16px auto;border:1px solid #D4AF37;border-radius:16px;overflow:hidden;background:#0A0A0A;font-family:'Cairo',sans-serif;" dir="rtl">
  <iframe
    src="${seoEmbedUrl}"
    data-preview-src="${embedSrcUrl}"
    title="${tool.title} | Dix Tools"
    width="100%"
    height="560"
    style="border:0;display:block;background:#0A0A0A;"
    loading="lazy"
  ></iframe>
  <div style="padding:10px 16px;background:#141414;border-top:1px solid #262626;text-align:center;font-size:13px;color:#F3E5AB;">
    أداة مقدمة مجاناً من <a href="${canonicalToolUrl}" target="_blank" rel="dofollow" style="color:#D4AF37;font-weight:bold;text-decoration:underline;">Dix Tools — ${tool.shortTitle || tool.title}</a>
  </div>
</div>
<!-- نهاية كود تضمين الأداة -->`;

  const handleCopyEmbed = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(iframeEmbedSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <div className="no-print">
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#171307] via-[#141414] to-[#0A0A0A] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#D4AF37]">
            <Link2 className="w-4 h-4" />
            <span>مغناطيس الباكلينكس التلقائي لأصحاب المواقع والمدونات</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            هل تمتلك موقعاً أو مدونة؟ أضف «{tool.shortTitle || tool.title}» لزوارك مجاناً بضغطة زر.
          </p>
        </div>

        <button
          type="button"
          data-testid="open-embed-modal-btn"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-black text-xs sm:text-sm font-extrabold transition-all shadow-lg cursor-pointer shrink-0"
        >
          🔗 ضمّن هذه الأداة في موقعك مجاناً (Embed)
        </button>
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`تضمين ${tool.shortTitle || tool.title} في موقعك`}
          data-testid="embed-tool-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-2xl w-full rounded-3xl border border-[#D4AF37]/70 bg-[#141414] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    🔗 ضمّن «{tool.shortTitle || tool.title}» في موقعك مجاناً
                  </h3>
                  <p className="text-xs text-slate-400">
                    انسخ كود HTML الخفيف والصقه في مقالك على ووردبريس أو بلوجر أو أي موقع
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="إغلاق نافذة التضمين"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#F3E5AB]">
                  كود التضمين الجاهز (يتضمن رابط حقوق Dofollow تلقائي لـ Dix Tools):
                </span>
                <span className="font-num text-emerald-400">Responsive Iframe · Zero JS</span>
              </div>
              <textarea
                readOnly
                rows={9}
                dir="ltr"
                value={iframeEmbedSnippet}
                data-testid="embed-code-textarea"
                className="font-num w-full rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-3.5 text-xs text-amber-200 leading-relaxed focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-300">
                أداة مقدمة مجاناً من{' '}
                <a
                  href={canonicalToolUrl}
                  target="_blank"
                  rel="dofollow"
                  className="text-[#D4AF37] font-extrabold underline"
                >
                  Dix Tools
                </a>
              </div>
              <a
                href={`#/embed/${tool.slug}`}
                onClick={() => setIsOpen(false)}
                data-testid="preview-embed-route-link"
                className="inline-flex items-center gap-1.5 text-[#F3E5AB] hover:text-[#D4AF37] font-bold"
              >
                <span>معاينة صفحة التضمين المستقلة (/embed/{tool.slug})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-xs font-bold text-slate-300 cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                data-testid="copy-embed-code-btn"
                onClick={handleCopyEmbed}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-extrabold cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تم نسخ كود التضمين بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ كود التضمين (Copy Embed Code)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
