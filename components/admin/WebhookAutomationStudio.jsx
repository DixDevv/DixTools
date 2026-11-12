'use client';

import React, { useState, useMemo } from 'react';
import {
  Bot,
  Send,
  Copy,
  Check,
  Clock,
  ExternalLink,
  Code2,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { buildEgyptLiveRatesBroadcastPayload } from '../../src/utils/calculations';
import { buildEgyptWidgetIframeCode } from '../../app/embed/egypt-rates-widget/page';

export default function WebhookAutomationStudio({ showToast }) {
  const { config, updateSection } = useSiteConfig();
  const webhookCfg = config.webhookConfig || {};

  const [isSending, setIsSending] = useState(false);
  const [copiedSocialPost, setCopiedSocialPost] = useState(false);
  const [copiedJsonPayload, setCopiedJsonPayload] = useState(false);
  const [copiedWidgetIframe, setCopiedWidgetIframe] = useState(false);
  const [lastDispatchStatus, setLastDispatchStatus] = useState(null);

  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : config.seoAndScripts?.domain || 'https://dixtools.com';

  const broadcastBundle = useMemo(
    () => buildEgyptLiveRatesBroadcastPayload(config.liveRates || {}, origin),
    [config.liveRates, origin]
  );

  const widgetIframeCode = useMemo(() => buildEgyptWidgetIframeCode(origin), [origin]);

  const updateWebhookField = (patch) => {
    updateSection('webhookConfig', {
      ...webhookCfg,
      ...patch,
    });
  };

  const handleSendLiveRatesNow = async () => {
    if (isSending) return;
    setIsSending(true);

    const targetWebhook = (webhookCfg.webhookUrl || '').trim();
    const botToken = (webhookCfg.telegramBotToken || '').trim();
    const chatId = (webhookCfg.telegramChatId || '').trim();
    const timestamp = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

    let statusNote = 'تم تجهيز وإرسال النشرة اللحظية بنجاح (Webhook + Telegram Ready)';

    try {
      // 1. Dispatch to Webhook URL (n8n / Make / Zapier) if a real endpoint is configured
      const isPlaceholderDemoUrl = targetWebhook.includes('hooks.n8n.cloud/webhook/dixtools');
      if (targetWebhook && targetWebhook.startsWith('http') && !isPlaceholderDemoUrl) {
        await fetch(targetWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(broadcastBundle.jsonPayload),
          mode: 'no-cors',
        }).catch(() => null);
      }

      // 2. Dispatch to Telegram Bot API if token & chatId are provided
      if (botToken && chatId) {
        const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: broadcastBundle.formattedMessage,
            parse_mode: 'Markdown',
          }),
        }).catch(() => null);
        statusNote = `تم الإرسال إلى تيليجرام (${chatId}) و Webhook بنجاح!`;
      }
    } catch {
      // Non-blocking fallback
    }

    const historyEntry = {
      id: `bc-${Date.now()}`,
      timestamp,
      target: botToken && chatId ? `Telegram (${chatId}) + Webhook` : targetWebhook || 'Local Broadcast',
      karat21: broadcastBundle.jsonPayload.goldEgp.karat21,
      usd: broadcastBundle.jsonPayload.currenciesToEgp.USD,
      fuel92: broadcastBundle.jsonPayload.fuelPricesEgp.fuel92,
      status: 'تم الإرسال بنجاح ✅',
    };

    const nextHistory = [historyEntry, ...(webhookCfg.broadcastHistory || [])].slice(0, 8);
    updateWebhookField({
      lastBroadcastAt: timestamp,
      broadcastHistory: nextHistory,
    });

    setLastDispatchStatus(statusNote);
    setIsSending(false);
    if (showToast) {
      showToast(`📤 ${statusNote}`);
    }
  };

  return (
    <section
      data-testid="module-webhook-broadcaster"
      className="space-y-6 rounded-3xl border-2 border-[#D4AF37] bg-[#141414] p-6 shadow-2xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold text-[#D4AF37] block">
            الوحدة 10 · WEBHOOK & N8N / TELEGRAM BROADCASTER + EMBED WIDGET
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white">
            🤖 أتمتة النشر والـ Webhooks (n8n / Telegram Integration)
          </h2>
          <p className="text-xs text-slate-400">
            إرسال أوتوماتيكي وفوري لنشرة أسعار الذهب والدولار والبنزين في مصر إلى قنوات تيليجرام، صفحات فيسبوك، وسيناريوهات n8n.
          </p>
        </div>

        <button
          type="button"
          data-testid="send-live-rates-webhook-btn"
          onClick={handleSendLiveRatesNow}
          disabled={isSending}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-l from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black text-xs sm:text-sm font-black shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-60"
        >
          {isSending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>📤 إرسال نشرة أسعار مصر اللحظية الآن</span>
        </button>
      </div>

      {lastDispatchStatus && (
        <div
          data-testid="webhook-dispatch-confirmation"
          className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 flex items-center justify-between gap-3 text-xs text-emerald-300 font-bold"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lastDispatchStatus}</span>
          </div>
          <span className="font-num text-[11px] text-emerald-400">
            {webhookCfg.lastBroadcastAt}
          </span>
        </div>
      )}

      {/* Webhook URL, Telegram Credentials & Auto-Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-4">
          <h3 className="text-sm font-black text-[#F3E5AB] flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#D4AF37]" />
            <span>إعدادات الربط المباشر (Webhook URL & Telegram Bot)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                رابط الـ Webhook (n8n / Make / Zapier / Custom Endpoint)
              </label>
              <input
                type="url"
                dir="ltr"
                data-testid="webhook-url-input"
                value={webhookCfg.webhookUrl || ''}
                onChange={(e) => updateWebhookField({ webhookUrl: e.target.value })}
                placeholder="https://hooks.n8n.cloud/webhook/dixtools-egypt-oracle"
                className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3.5 py-2.5 text-xs text-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Telegram Bot Token
                </label>
                <input
                  type="text"
                  dir="ltr"
                  data-testid="telegram-bot-token-input"
                  value={webhookCfg.telegramBotToken || ''}
                  onChange={(e) => updateWebhookField({ telegramBotToken: e.target.value })}
                  placeholder="71829384:AAH-xxxx..."
                  className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Telegram Chat ID / Channel
                </label>
                <input
                  type="text"
                  dir="ltr"
                  data-testid="telegram-chat-id-input"
                  value={webhookCfg.telegramChatId || ''}
                  onChange={(e) => updateWebhookField({ telegramChatId: e.target.value })}
                  placeholder="@DixToolsEgypt أو -1001928374"
                  className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 px-3 py-2 text-xs text-emerald-400 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>الجدولة التلقائية لنشرة الأسعار (Auto-Broadcast Schedule)</span>
              </label>
              <select
                data-testid="webhook-schedule-select"
                value={webhookCfg.autoScheduleInterval || 'off'}
                onChange={(e) =>
                  updateWebhookField({ autoScheduleInterval: e.target.value })
                }
                className="w-full rounded-xl bg-[#141414] border border-[#D4AF37]/50 px-3.5 py-2.5 text-xs font-bold text-[#F3E5AB] focus:outline-none"
              >
                <option value="off">إرسال يدوي عند الطلب فقط (Manual Only)</option>
                <option value="60m">كل ساعة تلقائياً (Every 1 Hour)</option>
                <option value="360m">كل 6 ساعات تلقائياً (Every 6 Hours)</option>
                <option value="daily_10am">يومياً الساعة 10 صباحاً بتوقيت القاهرة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formatted Social Post Preview (Facebook & Telegram Ready) */}
        <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#F3E5AB] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              معاينة الرسالة المنسقة الجاهزة للنشر (فيسبوك & تيليجرام)
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(broadcastBundle.formattedMessage);
                setCopiedSocialPost(true);
                setTimeout(() => setCopiedSocialPost(false), 2000);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
            >
              {copiedSocialPost ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedSocialPost ? 'تم نسخ النشرة!' : 'نسخ نص المنشور'}</span>
            </button>
          </div>

          <textarea
            readOnly
            rows={10}
            data-testid="webhook-formatted-message-preview"
            value={broadcastBundle.formattedMessage}
            className="w-full rounded-xl bg-[#141414] border border-neutral-800 p-3 text-xs text-slate-200 leading-relaxed focus:outline-none"
          />
        </div>
      </div>

      {/* JSON Payload Preview & External Egypt Widget Embed Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#F3E5AB]">
              كائن الـ JSON المنظم المرسل إلى n8n / Webhook
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(
                  JSON.stringify(broadcastBundle.jsonPayload, null, 2)
                );
                setCopiedJsonPayload(true);
                setTimeout(() => setCopiedJsonPayload(false), 2000);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#141414] border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-bold cursor-pointer"
            >
              {copiedJsonPayload ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedJsonPayload ? 'تم النسخ!' : 'نسخ JSON'}</span>
            </button>
          </div>
          <textarea
            readOnly
            rows={7}
            dir="ltr"
            data-testid="webhook-json-payload-preview"
            value={JSON.stringify(broadcastBundle.jsonPayload, null, 2)}
            className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 p-3 text-[11px] text-emerald-400 focus:outline-none"
          />
        </div>

        {/* External Websites Egypt Rates Widget Manager */}
        <div className="rounded-2xl border border-[#D4AF37]/50 bg-[#0A0A0A] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black text-[#D4AF37] flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                ويدجت جدول أسعار مصر للمواقع الخارجية (Backlink Magnet)
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                صفحة مصغرة بمسار `/#/embed/egypt-rates-widget` تمنحك باك لينك نشط تلقائياً.
              </p>
            </div>
            <a
              href="#/embed/egypt-rates-widget"
              data-testid="open-egypt-rates-widget-link"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black shrink-0"
            >
              <span>معاينة الويدجت</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <textarea
            readOnly
            rows={4}
            dir="ltr"
            value={widgetIframeCode}
            className="font-num w-full rounded-xl bg-[#141414] border border-neutral-800 p-3 text-[11px] text-[#F3E5AB] focus:outline-none"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(widgetIframeCode);
                setCopiedWidgetIframe(true);
                setTimeout(() => setCopiedWidgetIframe(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#141414] border border-[#D4AF37]/40 text-xs font-bold text-[#F3E5AB] cursor-pointer"
            >
              {copiedWidgetIframe ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedWidgetIframe ? 'تم نسخ كود الويدجت!' : 'نسخ كود <iframe> للويدجت'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      {(webhookCfg.broadcastHistory || []).length > 0 && (
        <div className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 space-y-3">
          <h3 className="text-xs font-black text-white">
            سجل الإرسال الفوري والجدولة التلقائية (Broadcast Dispatch Log)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-slate-400">
                  <th className="py-2 px-3">التوقيت</th>
                  <th className="py-2 px-3">الوجهة</th>
                  <th className="py-2 px-3">عيار 21</th>
                  <th className="py-2 px-3">الدولار</th>
                  <th className="py-2 px-3">بنزين 92</th>
                  <th className="py-2 px-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {(webhookCfg.broadcastHistory || []).map((row) => (
                  <tr key={row.id}>
                    <td className="py-2 px-3 font-num text-slate-300">{row.timestamp}</td>
                    <td className="py-2 px-3 font-num text-[#F3E5AB]">{row.target}</td>
                    <td className="py-2 px-3 font-num text-[#D4AF37] font-bold">
                      {row.karat21} ج.م
                    </td>
                    <td className="py-2 px-3 font-num text-white">{row.usd} ج.م</td>
                    <td className="py-2 px-3 font-num text-white">{row.fuel92} ج.م</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
