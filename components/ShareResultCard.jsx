'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Share2, Download, MessageCircle, X, CheckCircle2 } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { recordCalculationHistoryEntry } from '../hooks/useUserToolsMemory';

/**
 * Pure helper to format the WhatsApp share text for a calculation result
 */
export function buildWhatsAppShareMessage({
  toolTitle = 'أداة Dix Tools الذكية',
  inputsSummary = '',
  resultPrimary = '',
  resultSubtitle = '',
  toolUrl = 'https://dixtools.com',
  timestamp = '',
}) {
  const lines = [
    `✨ *${toolTitle}*`,
    inputsSummary ? `📌 المدخلات: ${inputsSummary}` : null,
    `🏆 *النتيجة النهائية: ${resultPrimary}*`,
    resultSubtitle ? `📊 التفاصيل: ${resultSubtitle}` : null,
    timestamp ? `🕒 التوقيت: ${timestamp}` : null,
    `🔗 تم الحساب عبر منصة Dix Tools:`,
    toolUrl,
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Renders a Luxury Black & Gold Receipt Card onto an HTML5 Canvas (`components/ShareResultCard.jsx`)
 */
export function drawLuxuryReceiptCanvas(
  canvas,
  {
    toolTitle = 'حاسبة Dix Tools الشاملة',
    categoryName = 'أدوات المال والذهب',
    inputsSummary = 'المدخلات القياسية المعتمدة',
    resultPrimary = '0 ج.م',
    resultSubtitle = '',
    timestamp = '',
  }
) {
  if (!canvas) return '';
  const width = 1080;
  const height = 720;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Luxury Obsidian Background (#0A0A0A -> #141414)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0A0A0A');
  bgGrad.addColorStop(0.5, '#141414');
  bgGrad.addColorStop(1, '#090909');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle ambient gold radial glow
  const glowGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 20, width * 0.5, height * 0.45, 460);
  glowGrad.addColorStop(0, 'rgba(212, 175, 55, 0.14)');
  glowGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Double Royal Gold Receipt Frame
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  ctx.strokeStyle = 'rgba(243, 229, 171, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(46, 46, width - 92, height - 92);

  // Text settings (RTL Arabic)
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';

  // 3. Top Header Bar: Brand & Category
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 34px Cairo, Tajawal, sans-serif';
  ctx.fillText('Dix Tools | منصة ديكس تولز للأدوات الذكية', width - 80, 110);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 22px Cairo, Tajawal, sans-serif';
  ctx.fillText(`${categoryName} · بطاقة نتيجة معتمدة`, width - 80, 148);

  // Divider line
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 175);
  ctx.lineTo(width - 80, 175);
  ctx.stroke();

  // 4. Tool Name & Inputs Box
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Cairo, Tajawal, sans-serif';
  ctx.fillText(String(toolTitle).slice(0, 58), width - 80, 235);

  ctx.fillStyle = '#F3E5AB';
  ctx.font = '600 24px Cairo, Tajawal, sans-serif';
  ctx.fillText(`بيانات الحساب: ${String(inputsSummary).slice(0, 75)}`, width - 80, 285);

  // 5. Center Hero Result Box
  ctx.fillStyle = 'rgba(20, 16, 6, 0.92)';
  ctx.fillRect(80, 315, width - 160, 225);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(80, 315, width - 160, 225);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 24px Cairo, Tajawal, sans-serif';
  ctx.fillText('النتيجة النهائية المحسوبة', width / 2, 366);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 62px Cairo, Tajawal, sans-serif';
  ctx.fillText(String(resultPrimary).slice(0, 34), width / 2, 448);

  if (resultSubtitle) {
    ctx.fillStyle = '#F3E5AB';
    ctx.font = '600 22px Cairo, Tajawal, sans-serif';
    ctx.fillText(String(resultSubtitle).slice(0, 75), width / 2, 506);
  }

  // 6. Footer Signature & Timestamp
  ctx.textAlign = 'right';
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 25px Cairo, Tajawal, sans-serif';
  ctx.fillText('★ تم الحساب عبر منصة Dix Tools', width - 80, 615);

  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 20px Cairo, IBM Plex Mono, sans-serif';
  ctx.fillText(timestamp, 80, 615);

  ctx.fillStyle = '#F3E5AB';
  ctx.font = 'bold 20px IBM Plex Mono, sans-serif';
  ctx.fillText('dixtools.com', 80, 648);

  try {
    return canvas.toDataURL('image/png');
  } catch (_err) {
    return '';
  }
}

export default function ShareResultCard({
  tool,
  inputsSummary = 'حساب قياسي فوري',
  resultPrimary = '',
  resultSubtitle = '',
}) {
  let siteConfigCtx = null;
  try {
    siteConfigCtx = useSiteConfig();
  } catch (_err) {
    siteConfigCtx = null;
  }

  const shareEnabled =
    siteConfigCtx?.config?.viralFeatures?.shareResultCardEnabled !== false;

  const [isOpen, setIsOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const canvasRef = useRef(null);

  const formattedTimestamp = new Date().toLocaleString('ar-EG', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const toolTitle = tool?.shortTitle || tool?.title || 'حاسبة Dix Tools الشاملة';
  const categoryName = tool?.categoryName || 'أدوات Dix Tools الذكية';
  const toolUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/#/${tool?.category || 'gold'}/${tool?.slug || 'comprehensive-gold-calculator'}`
      : 'https://dixtools.com';

  const generateReceiptImage = useCallback(() => {
    if (!canvasRef.current) return;
    const png = drawLuxuryReceiptCanvas(canvasRef.current, {
      toolTitle,
      categoryName,
      inputsSummary,
      resultPrimary,
      resultSubtitle,
      timestamp: `${formattedTimestamp} (توقيت القاهرة)`,
    });
    setDataUrl(png);
  }, [toolTitle, categoryName, inputsSummary, resultPrimary, resultSubtitle, formattedTimestamp]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        generateReceiptImage();
      }, 30);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, generateReceiptImage]);

  if (!shareEnabled || !resultPrimary) return null;

  const handleOpenShareCard = () => {
    // Also record this calculation in the user's smart memory (last 5 calculations)
    if (tool?.slug) {
      recordCalculationHistoryEntry({
        slug: tool.slug,
        category: tool.category,
        toolTitle,
        inputsSummary,
        resultSummary: resultPrimary,
      });
    }
    setIsOpen(true);
  };

  const handleSaveToMemoryOnly = () => {
    if (tool?.slug) {
      recordCalculationHistoryEntry({
        slug: tool.slug,
        category: tool.category,
        toolTitle,
        inputsSummary,
        resultSummary: resultPrimary,
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2400);
    }
  };

  const handleWhatsAppShare = () => {
    const msg = buildWhatsAppShareMessage({
      toolTitle,
      inputsSummary,
      resultPrimary,
      resultSubtitle,
      toolUrl,
      timestamp: formattedTimestamp,
    });
    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="no-print pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="open-share-result-card-btn"
          onClick={handleOpenShareCard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#e4c24d] hover:from-[#e5c247] hover:to-[#f0d160] text-black text-xs sm:text-sm font-extrabold shadow-[0_0_18px_rgba(212,175,55,0.28)] transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>📤 مشاركة النتيجة كصورة / واتساب</span>
        </button>

        <button
          type="button"
          data-testid="save-calculation-history-btn"
          onClick={handleSaveToMemoryOnly}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] border border-neutral-700 hover:border-[#D4AF37] text-xs font-bold text-slate-200 hover:text-[#F3E5AB] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {savedNotice ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">تم حفظ العملية في السجل ✓</span>
            </>
          ) : (
            <span>حفظ في سجل عملياتي الأخيرة</span>
          )}
        </button>
      </div>

      <span className="text-[11px] text-slate-400">
        بطاقة إيصال ذهبية جاهزة للمشاركة الفورية
      </span>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="بطاقة مشاركة النتيجة الفيروسية"
          data-testid="share-result-card-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-2xl w-full rounded-3xl border-2 border-[#D4AF37] bg-[#121212] p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#D4AF37] block">
                  Black & Gold Receipt Card · HTML5 Canvas
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  بطاقة مشاركة النتيجة الرسمية — {toolTitle}
                </h3>
              </div>
              <button
                type="button"
                aria-label="إغلاق نافذة المشاركة"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Canvas Preview */}
            <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#0A0A0A] p-3 flex flex-col items-center justify-center">
              <canvas
                ref={canvasRef}
                data-testid="viral-receipt-canvas"
                className="w-full h-auto rounded-xl border border-neutral-800 shadow-lg"
              />
            </div>

            {/* Action Buttons: Download PNG + Direct WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {dataUrl ? (
                <a
                  href={dataUrl}
                  download={`dix-tools-receipt-${tool?.slug || 'result'}.png`}
                  data-testid="download-receipt-png-btn"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#e5c247] text-black text-xs sm:text-sm font-extrabold transition-all text-center cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل بطاقة النتيجة كصورة (PNG)</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={generateReceiptImage}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-black text-xs sm:text-sm font-extrabold cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>توليد وتحميل الصورة</span>
                </button>
              )}

              <button
                type="button"
                data-testid="whatsapp-share-receipt-btn"
                onClick={handleWhatsAppShare}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-extrabold transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال النتيجة مباشرة عبر واتساب</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
