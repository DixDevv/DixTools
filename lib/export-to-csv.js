'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Check } from 'lucide-react';
import { buildCsvStringWithBom } from '../src/utils/calculations';

export function buildCsvContentWithBom(headers = [], rows = []) {
  return buildCsvStringWithBom(headers, rows);
}

export function triggerCsvDownload(filename = 'dix-tools-report.csv', headers = [], rows = []) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const csvContent = buildCsvContentWithBom(headers, rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const cleanName = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', cleanName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  return true;
}

export function ExcelExportBtn({
  filename = 'dix-tools-table.csv',
  headers = [],
  rows = [],
  label = 'تصدير الجدول إلى Excel (CSV)',
  className = '',
}) {
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    const ok = triggerCsvDownload(filename, headers, rows);
    if (ok) {
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    }
  };

  return React.createElement(
    'button',
    {
      type: 'button',
      'data-testid': 'excel-export-btn',
      onClick: handleExport,
      className: `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D4AF37]/50 bg-[#0A0A0A] hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-black text-xs font-extrabold transition-all cursor-pointer shadow-sm ${className}`,
    },
    downloaded
      ? [
          React.createElement(Check, { key: 'icon', className: 'w-4 h-4 text-emerald-400' }),
          React.createElement('span', { key: 'txt' }, 'تم تحميل ملف Excel بنجاح!'),
        ]
      : [
          React.createElement(FileSpreadsheet, {
            key: 'icon',
            className: 'w-4 h-4 text-[#D4AF37] group-hover:text-black',
          }),
          React.createElement('span', { key: 'txt' }, label),
        ]
  );
}

export default ExcelExportBtn;
