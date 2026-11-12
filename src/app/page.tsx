"use client";

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Stethoscope,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';

//Layout Components
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Feature Components
import ComponentDoctor from '../components/ComponentDoctor';
import AltTextGenerator from '../components/AltTextGenerator';
import ContrastChecker from '../components/ContrastChecker';
import TabTrigger from '../components/ui/TabTrigger';

export default function App() {
  const [activeTab, setActiveTab] = useState('doctor');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-orange-500/30">
      <Header />

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
      <Footer />
    </div>
  );
}

