"use client";

import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Stethoscope,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Components
import ComponentDoctor from '../components/ComponentDoctor';
import AltTextGenerator from '../components/AltTextGenerator';
import ContrastChecker from '../components/ContrastChecker';

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