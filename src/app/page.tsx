"use client";

import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Stethoscope,
  Image as ImageIcon,
  Palette,
  RefreshCw,
} from 'lucide-react';
import {suggestContrastColor } from '../../services/gemini';
import { cn } from '../../lib/utils';

// Components
import ComponentDoctor from '../components/ComponentDoctor';
import AltTextGenerator from '../components/AltTextGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState('doctor');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-orange-500/30">
      <header role="banner" className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <Stethoscope className="w-5 h-5 text-black" />
            </div> <h1 className="text-xl font-bold tracking-tight"> A11y-GPT
              <span className="text-orange-500 italic">Remediation</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-8">
          <Tabs.List className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 self-start">
            <TabTrigger value="doctor" icon={<Stethoscope className="w-4 h-4" />} label="Component Doctor" />
            <TabTrigger value="alt" icon={<ImageIcon className="w-4 h-4" />} label="Alt-Text Gen" />
            <TabTrigger value="contrast" icon={<Palette className="w-4 h-4" />} label="Contrast Fixer" />
          </Tabs.List>

          <div className="flex-1">
            <Tabs.Content value="doctor" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ComponentDoctor />
            </Tabs.Content>
            <Tabs.Content value="alt" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AltTextGenerator />
            </Tabs.Content>
            <Tabs.Content value="contrast" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ContrastChecker />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </main>

      <footer className="border-t border-zinc-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-zinc-400 text-sm">
          <p>© 2026 A11y-GPT Remediation Engine. Built for WCAG 2.1 Compliance.</p>
        </div>
      </footer>
    </div>
  );
}

function TabTrigger({ value, icon, label }: { value: string, icon: React.ReactNode, label: string }) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
        "data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-sm",
        "data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-white"
      )}
    >
      {icon}
      {label}
    </Tabs.Trigger>
  );
}

function ContrastChecker() {
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#000000');
  const [suggestion, setSuggestion] = useState<{ suggestedColor: string, ratio: number, explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await suggestContrastColor(fg, bg);
      setSuggestion(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Contrast Fixer</h2>
          <p className="text-sm 40">AI-powered color suggestions that maintain brand identity while passing WCAG AA/AAA.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase 40">Foreground Color</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="w-12 h-12 bg-transparent border-none cursor-pointer"
              />
              <input
                type="text"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase 40">Background Color</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-12 h-12 bg-transparent border-none cursor-pointer"
              />
              <input
                type="text"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 font-mono text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Palette className="w-5 h-5" />}
            Analyze Contrast
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div
          className="h-48 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl transition-all duration-500"
          style={{ backgroundColor: bg, color: fg }}
        >
          Sample Text
        </div>

        {suggestion && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-green-500">AI Suggestion</h3>
              <span className="text-xs font-mono bg-green-500/10 text-green-500 px-2 py-1 rounded">Ratio: {suggestion.ratio}:1</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg border border-zinc-700"
                style={{ backgroundColor: suggestion.suggestedColor }}
              />
              <div>
                <p className="font-mono text-lg">{suggestion.suggestedColor}</p>
                <p className="text-xs 40">{suggestion.explanation}</p>
              </div>
            </div>

            <div
              className="h-24 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: bg, color: suggestion.suggestedColor }}
            >
              Fixed Contrast
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
