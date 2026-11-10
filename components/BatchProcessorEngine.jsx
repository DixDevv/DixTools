'use client';

import React, { useState, useRef } from 'react';
import {
  Layers,
  Upload,
  Download,
  QrCode,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { generateBarcodeBars } from '../src/utils/calculations';
import { generateQrMatrix } from '../src/utils/qrMatrix';

const DEFAULT_BATCH_CODES = [
  'DIX-PROD-1001',
  'DIX-PROD-1002',
  'DIX-PROD-1003',
  'DIX-GOLD-24K-10G',
  'DIX-AWB-CAI-9920',
].join('\n');

function renderBarcodeOrQrToDataUrl(codeText, mode = 'barcode') {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');

  if (mode === 'qr') {
    const size = 360;
    canvas.width = size;
    canvas.height = size + 44;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const matrix = generateQrMatrix(codeText);
    const quiet = 3;
    const total = matrix.length + quiet * 2;
    const cell = size / total;

    ctx.fillStyle = '#D4AF37';
    for (let r = 0; r < matrix.length; r += 1) {
      for (let c = 0; c < matrix.length; c += 1) {
        if (matrix[r][c]) {
          ctx.fillRect(
            Math.floor((c + quiet) * cell),
            Math.floor((r + quiet) * cell),
            Math.ceil(cell),
            Math.ceil(cell)
          );
        }
      }
    }

    ctx.fillStyle = '#F3E5AB';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(codeText.slice(0, 32), size / 2, size + 26);
    return canvas.toDataURL('image/png');
  }

  // 1D Commercial Barcode (Code-128 style)
  const bars = generateBarcodeBars(codeText);
  const totalUnits = bars.reduce((acc, w) => acc + w, 0);
  const width = Math.max(380, totalUnits * 3 + 48);
  const height = 160;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  let x = 24;
  const barWidthUnit = Math.max(2, Math.floor((width - 48) / totalUnits));
  for (let i = 0; i < bars.length; i += 1) {
    const w = bars[i] * barWidthUnit;
    if (i % 2 === 0) {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(x, 18, w, 96);
    }
    x += w;
  }

  ctx.fillStyle = '#0A0A0A';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(codeText.slice(0, 36), width / 2, 138);
  return canvas.toDataURL('image/png');
}

export default function BatchProcessorEngine({ initialTab = 'barcodes' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'images' | 'barcodes'

  // Batch Barcodes State (up to 20 codes at once)
  const [rawCodesInput, setRawCodesInput] = useState(DEFAULT_BATCH_CODES);
  const [codeType, setCodeType] = useState('barcode'); // 'barcode' | 'qr'
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [barcodeProgress, setBarcodeProgress] = useState(0);

  // Batch Images State
  const [targetFormat, setTargetFormat] = useState('image/webp');
  const [quality, setQuality] = useState(82);
  const [maxWidth, setMaxWidth] = useState(1280);
  const [processedImages, setProcessedImages] = useState([]);
  const [imageProgress, setImageProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleGenerateBatchBarcodes = () => {
    const lines = rawCodesInput
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 20);

    if (lines.length === 0) return;

    setBarcodeProgress(15);
    const items = lines.map((code, idx) => {
      const dataUrl = renderBarcodeOrQrToDataUrl(code, codeType);
      return {
        id: `code-${idx}-${Date.now()}`,
        code,
        type: codeType,
        dataUrl,
      };
    });
    setGeneratedCodes(items);
    setBarcodeProgress(100);
  };

  const handleBatchImagesUpload = (filesList) => {
    const files = Array.from(filesList || []).slice(0, 20);
    if (files.length === 0) return;

    setImageProgress(10);
    const results = [];
    let completed = 0;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
          const outW = Math.max(1, Math.round(img.width * ratio));
          const outH = Math.max(1, Math.round(img.height * ratio));

          const canvas = document.createElement('canvas');
          canvas.width = outW;
          canvas.height = outH;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, outW, outH);

          const dataUrl = canvas.toDataURL(targetFormat, quality / 100);
          const outBytes = Math.round((dataUrl.length * 3) / 4);
          const savingsPercent =
            file.size > 0
              ? Math.max(0, Number(((1 - outBytes / file.size) * 100).toFixed(1)))
              : 45;

          const ext =
            targetFormat === 'image/webp'
              ? 'webp'
              : targetFormat === 'image/png'
              ? 'png'
              : 'jpg';

          results.push({
            id: `img-${index}-${Date.now()}`,
            originalName: file.name,
            downloadName: `${file.name.replace(/\.[^.]+$/, '')}-dix.${ext}`,
            originalKb: Number((file.size / 1024).toFixed(1)),
            compressedKb: Number((outBytes / 1024).toFixed(1)),
            savingsPercent,
            dimensions: `${outW}×${outH}`,
            dataUrl,
          });

          completed += 1;
          setImageProgress(Math.round((completed / files.length) * 100));
          if (completed === files.length) {
            setProcessedImages((prev) => [...results, ...prev].slice(0, 20));
          }
        };
        if (typeof ev.target?.result === 'string') {
          img.src = ev.target.result;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownloadAllCodes = () => {
    generatedCodes.forEach((item, idx) => {
      if (!item.dataUrl) return;
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = item.dataUrl;
        a.download = `${item.code.replace(/[^a-zA-Z0-9_-]/g, '_')}-${item.type}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, idx * 120);
    });
  };

  const handleDownloadAllImages = () => {
    processedImages.forEach((img, idx) => {
      if (!img.dataUrl) return;
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = img.dataUrl;
        a.download = img.downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, idx * 120);
    });
  };

  return (
    <div
      data-testid="batch-processor-engine"
      className="space-y-6 rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-5 sm:p-6 shadow-2xl"
    >
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#D4AF37]">
            <Layers className="w-4 h-4" />
            <span>محرك المعالجة الجماعية الفوري (Batch Studio 100% Client-Side)</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            معالجة وضغط الصور بالجملة + توليد حتى 20 باركود ورمز QR بضغطة واحدة
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="batch-tab-barcodes"
            onClick={() => setActiveTab('barcodes')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
              activeTab === 'barcodes'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>توليد جماعي للباركود (حتى 20 كود)</span>
          </button>

          <button
            type="button"
            data-testid="batch-tab-images"
            onClick={() => setActiveTab('images')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
              activeTab === 'images'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>ضغط وتحويل مجموعة صور (WebP/PNG/JPG)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BATCH BARCODE & QR GENERATOR */}
      {activeTab === 'barcodes' && (
        <div className="space-y-5" data-testid="batch-barcodes-panel">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#F3E5AB]">
                  أدخل أكواد المنتجات أو الشحنات (كود واحد في كل سطر — حتى 20 كوداً):
                </label>
                <span className="font-num text-[11px] text-[#D4AF37] font-bold">
                  {
                    rawCodesInput
                      .split(/\r?\n/)
                      .map((l) => l.trim())
                      .filter(Boolean).length
                  }{' '}
                  / 20 كود
                </span>
              </div>

              <textarea
                rows={6}
                dir="ltr"
                data-testid="batch-codes-textarea"
                value={rawCodesInput}
                onChange={(e) => setRawCodesInput(e.target.value)}
                placeholder="DIX-PROD-1001&#10;DIX-PROD-1002&#10;DIX-PROD-1003"
                className="font-num w-full rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/40 p-4 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCodeType('barcode')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      codeType === 'barcode'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
                    }`}
                  >
                    باركود تجاري 1D (Code-128)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeType('qr')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      codeType === 'qr'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
                    }`}
                  >
                    رمز استجابة سريع (QR Code)
                  </button>
                </div>

                <button
                  type="button"
                  data-testid="batch-generate-codes-btn"
                  onClick={handleGenerateBatchBarcodes}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black hover:bg-[#e5c247] transition-all cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>توليد جميع الأكواد بضغطة واحدة</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              {/* Progress Bar */}
              <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">شريط التقدم للمعالجة الجماعية:</span>
                  <span className="font-num text-[#D4AF37]">{barcodeProgress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
                  <div
                    data-testid="batch-barcode-progress-bar"
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 transition-all duration-300"
                    style={{ width: `${barcodeProgress}%` }}
                  />
                </div>
              </div>

              {generatedCodes.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تم توليد {generatedCodes.length} باركود جاهز للتحميل والطباعة</span>
                    </span>
                    <button
                      type="button"
                      data-testid="batch-download-all-codes-btn"
                      onClick={handleDownloadAllCodes}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل الكل دفعة واحدة (PNG)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {generatedCodes.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-neutral-800 bg-[#0A0A0A] p-3 flex flex-col items-center gap-2"
                      >
                        <img
                          src={item.dataUrl}
                          alt={item.code}
                          className="h-20 object-contain rounded bg-white p-1"
                        />
                        <div className="w-full flex items-center justify-between gap-2 text-[11px]">
                          <span dir="ltr" className="font-num font-bold text-[#F3E5AB] truncate">
                            {item.code}
                          </span>
                          <a
                            href={item.dataUrl}
                            download={`${item.code}.png`}
                            className="text-[#D4AF37] font-extrabold hover:underline shrink-0"
                          >
                            تحميل PNG
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-800 bg-[#0A0A0A] p-8 text-center text-xs text-slate-400">
                  اضغط على «توليد جميع الأكواد بضغطة واحدة» لعرض وتحميل حتى 20 باركود تجاري فوراً.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATCH IMAGE COMPRESSOR & CONVERTER */}
      {activeTab === 'images' && (
        <div className="space-y-5" data-testid="batch-images-panel">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#F3E5AB] mb-1">
                صيغة التحويل الجماعي المطلوبة
              </label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
              >
                <option value="image/webp">WebP (أعلى ضغط وسرعة للمتاجر)</option>
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/png">PNG (جودة عالية وشفافية)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F3E5AB] mb-1">
                جودة الضغط ({quality}%)
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[#D4AF37] mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F3E5AB] mb-1">
                العرض الأقصى (Max Width px)
              </label>
              <input
                type="number"
                min="200"
                max="4000"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2 text-xs font-bold text-white"
              />
            </div>
          </div>

          {/* Drag & Drop Multi-File Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleBatchImagesUpload(e.dataTransfer.files);
            }}
            className="rounded-2xl border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] bg-[#0A0A0A] p-6 text-center space-y-3 transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleBatchImagesUpload(e.target.files)}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <p className="text-xs sm:text-sm font-extrabold text-white">
              اسحب وأفلت عدة صور هنا دفعة واحدة (حتى 20 صورة) أو اضغط لاختيار الملفات
            </p>
            <button
              type="button"
              data-testid="batch-select-images-btn"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
            >
              اختيار مجموعة صور من جهازك
            </button>
          </div>

          {/* Progress Bar */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">مؤشر تقدم ضغط وتحويل الصور:</span>
              <span className="font-num text-[#D4AF37]">{imageProgress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 transition-all duration-300"
                style={{ width: `${imageProgress}%` }}
              />
            </div>
          </div>

          {processedImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-emerald-400">
                  تمت معالجة {processedImages.length} صورة بنجاح داخل المتصفح
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadAllImages}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل كل الصور المضغوطة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProcessedImages([]);
                      setImageProgress(0);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-xs text-slate-400 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>مسح القائمة</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {processedImages.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-xl border border-neutral-800 bg-[#0A0A0A] p-3 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="text-xs font-bold text-white truncate">
                        {img.originalName}
                      </div>
                      <div className="font-num text-[11px] text-emerald-400">
                        {img.originalKb} KB ⬅ {img.compressedKb} KB (توفير {img.savingsPercent}%)
                      </div>
                    </div>
                    <a
                      href={img.dataUrl}
                      download={img.downloadName}
                      className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-[11px] font-black shrink-0"
                    >
                      تحميل
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
