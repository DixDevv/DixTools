'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3, CheckCircle2 } from 'lucide-react';
import { computeMarketSentimentPercentages } from '../src/utils/calculations';

const POLL_STORAGE_PREFIX = 'dix_tools_market_sentiment_v1_';

export default function MarketSentimentPoll({ tool }) {
  const slug = tool?.slug || 'egypt-market';
  const storageKey = `${POLL_STORAGE_PREFIX}${slug}`;

  // Deterministic baseline votes per tool so the poll looks lively immediately
  const seedCounts = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < slug.length; i += 1) {
      hash = (hash * 31 + slug.charCodeAt(i)) % 1000;
    }
    return {
      baseUp: 140 + (hash % 95),
      baseDown: 65 + ((hash * 7) % 60),
    };
  }, [slug]);

  const [upVotes, setUpVotes] = useState(seedCounts.baseUp);
  const [downVotes, setDownVotes] = useState(seedCounts.baseDown);
  const [userChoice, setUserChoice] = useState(null); // 'up' | 'down' | null

  useEffect(() => {
    setUpVotes(seedCounts.baseUp);
    setDownVotes(seedCounts.baseDown);
    setUserChoice(null);

    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.choice === 'up' || parsed?.choice === 'down') {
            setUserChoice(parsed.choice);
            setUpVotes(Number(parsed.upVotes) || seedCounts.baseUp + 1);
            setDownVotes(Number(parsed.downVotes) || seedCounts.baseDown);
          }
        }
      } catch (_e) {
        // Ignore storage read errors
      }
    }
  }, [storageKey, seedCounts]);

  const handleVote = (direction) => {
    let nextUp = upVotes;
    let nextDown = downVotes;

    if (userChoice === direction) return;

    if (userChoice === 'up' && direction === 'down') {
      nextUp = Math.max(0, upVotes - 1);
      nextDown = downVotes + 1;
    } else if (userChoice === 'down' && direction === 'up') {
      nextDown = Math.max(0, downVotes - 1);
      nextUp = upVotes + 1;
    } else if (direction === 'up') {
      nextUp = upVotes + 1;
    } else {
      nextDown = downVotes + 1;
    }

    setUpVotes(nextUp);
    setDownVotes(nextDown);
    setUserChoice(direction);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            choice: direction,
            upVotes: nextUp,
            downVotes: nextDown,
            votedAt: new Date().toISOString(),
          })
        );
      } catch (_e) {
        // Ignore storage write errors
      }
    }
  };

  const summary = useMemo(
    () => computeMarketSentimentPercentages(upVotes, downVotes),
    [upVotes, downVotes]
  );

  const assetTitle =
    tool?.category === 'gold'
      ? 'الذهب والسبائك'
      : tool?.category === 'currencies'
      ? 'الدولار والعملات'
      : 'السوق والعوائد المالية';

  return (
    <section
      data-testid="market-sentiment-poll"
      aria-label="مؤشر واستطلاع توقعات السوق التفاعلي"
      className="no-print rounded-2xl border-2 border-[#D4AF37]/50 bg-gradient-to-br from-[#161205] via-[#141414] to-[#0A0A0A] p-5 sm:p-6 shadow-xl space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#D4AF37]">
            <BarChart3 className="w-4 h-4" />
            <span>مؤشر توقعات المتداولين اللحظي · Egypt Market Sentiment</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            ما توقعك لاتجاه السعر اليوم في مصر ({assetTitle})؟
          </h3>
        </div>

        <span className="font-num text-xs font-bold px-3 py-1 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F3E5AB]">
          إجمالي المشاركين: {summary.totalVotes.toLocaleString('en-US')} متداول
        </span>
      </div>

      {/* Voting Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          data-testid="sentiment-vote-up-btn"
          onClick={() => handleVote('up')}
          className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-black text-sm transition-all cursor-pointer border ${
            userChoice === 'up'
              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'bg-[#0A0A0A] border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>صعود 📈 (أتوقع ارتفاع السعر)</span>
          </span>
          <span className="font-num text-base font-black text-white">{summary.upPercent}%</span>
        </button>

        <button
          type="button"
          data-testid="sentiment-vote-down-btn"
          onClick={() => handleVote('down')}
          className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-black text-sm transition-all cursor-pointer border ${
            userChoice === 'down'
              ? 'bg-red-500/25 border-red-400 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
              : 'bg-[#0A0A0A] border-red-500/40 text-red-400 hover:bg-red-950/40'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            <span>هبوط 📉 (أتوقع تراجع السعر)</span>
          </span>
          <span className="font-num text-base font-black text-white">{summary.downPercent}%</span>
        </button>
      </div>

      {/* Animated Percentage Bar (Green / Gold / Red) */}
      <div className="space-y-2">
        <div className="w-full h-3.5 rounded-full bg-[#0A0A0A] border border-neutral-800 overflow-hidden flex">
          <div
            data-testid="sentiment-up-bar"
            className="h-full bg-gradient-to-l from-emerald-400 via-emerald-500 to-[#D4AF37] transition-all duration-500"
            style={{ width: `${summary.upPercent}%` }}
          />
          <div
            data-testid="sentiment-down-bar"
            className="h-full bg-gradient-to-r from-red-500 to-rose-700 transition-all duration-500"
            style={{ width: `${summary.downPercent}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          <span className="text-emerald-400 font-num">
            📈 صعود: {summary.upPercent}% ({summary.upVotes} صوت)
          </span>
          <span className="text-[#F3E5AB] flex items-center gap-1">
            {userChoice && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
            <span>
              {userChoice
                ? `تم تسجيل توقعك (${userChoice === 'up' ? 'صعود 📈' : 'هبوط 📉'}) — ${summary.dominantLabel}`
                : summary.dominantLabel}
            </span>
          </span>
          <span className="text-red-400 font-num">
            📉 هبوط: {summary.downPercent}% ({summary.downVotes} صوت)
          </span>
        </div>
      </div>
    </section>
  );
}
