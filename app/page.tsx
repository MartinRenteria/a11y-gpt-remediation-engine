"use client";

import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Stethoscope,
  Image as ImageIcon,
  Palette,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Copy,
  Upload,
  RefreshCw,
  Code2
} from 'lucide-react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { useDropzone } from 'react-dropzone';
import { remediateComponent, generateAltText, suggestContrastColor } from '../services/gemini';
import { cn } from '../lib/utils';

export default function Home() {
  const [activeTab, setActiveTab] = useState('doctor');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <Stethoscope className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              A11y-GPT <span className="text-orange-500 italic">Remediation</span>
            </h1>
          </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-8">
          <Tabs.List className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 self-start">
            <TabTrigger value="doctor" icon={<Stethoscope className="w-4 h-4" />} label="Component Doctor" />
            <TabTrigger value="alt" icon={<ImageIcon className="w-4 h-4" />} label="Alt-Text Gen" />
            <TabTrigger value="contrast" icon={<Palette className="w-4 h-4" />} label="Contrast Fixer" />
            <TabTrigger value="devops" icon={<Terminal className="w-4 h-4" />} label="DevOps Manifests" />
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
            <Tabs.Content value="devops" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DevOpsPanel />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </main>

      <footer className="border-t border-zinc-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-zinc-500 text-sm">
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
        "data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-zinc-300"
      )}
    >
      {icon}
      {label}
    </Tabs.Trigger>
  );
}

function ComponentDoctor() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ violations: string[], fixedCode: string, explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRemediate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await remediateComponent(code);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Code2 className="w-5 h-5 text-orange-500" />
            Source Component
          </h2>
          <button
            onClick={handleRemediate}
            disabled={loading || !code}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Stethoscope className="w-4 h-4" />}
            Analyze & Fix
          </button>
        </div>
        <div className="relative group">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste your React component here..."
            className="w-full h-[500px] bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setCode('')} className="text-zinc-500 hover:text-white p-2">Clear</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          Remediation Result
        </h2>
        {result ? (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Diff Analysis</span>
                <button
                  onClick={() => navigator.clipboard.writeText(result.fixedCode)}
                  className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <Copy className="w-3 h-3" /> Copy Fixed Code
                </button>
              </div>
              <div className="max-h-[400px] overflow-auto text-xs">
                <ReactDiffViewer
                  oldValue={code}
                  newValue={result.fixedCode}
                  splitView={false}
                  useDarkTheme
                  styles={{
                    variables: {
                      dark: {
                        diffViewerBackground: '#18181b',
                        addedBackground: '#064e3b',
                        addedColor: '#34d399',
                        removedBackground: '#7f1d1d',
                        removedColor: '#f87171',
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-sm font-bold text-orange-500 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Detected Violations
                </h3>
                <ul className="space-y-2">
                  {result.violations.map((v, i) => (
                    <li key={i} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-orange-500">•</span> {v}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-sm font-bold text-green-500 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Fix Explanation
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {result.explanation}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[500px] bg-zinc-900/30 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 gap-4">
            <Stethoscope className="w-12 h-12 opacity-20" />
            <p className="text-sm">Paste code and run analysis to see remediation</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AltTextGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [altText, setAltText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      handleGenerateAlt(reader.result as string, file.type);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  } as any);

  const handleGenerateAlt = async (base64: string, type: string) => {
    setLoading(true);
    try {
      const res = await generateAltText(base64, type);
      setAltText(res || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Alt-Text Generator</h2>
        <p className="text-zinc-500">Upload an image to generate context-aware accessibility descriptions.</p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
          isDragActive ? "border-orange-500 bg-orange-500/5" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
        )}
      >
        <input {...getInputProps()} />
        {image ? (
          <img src={image} alt="Preview" className="h-full w-full object-contain p-4" referrerPolicy="no-referrer" />
        ) : (
          <>
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-400">Drag & drop image here, or click to select</p>
          </>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 text-orange-500 animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Analyzing visual context...</span>
        </div>
      )}

      {altText && !loading && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Generated Alt Text</h3>
            <button
              onClick={() => navigator.clipboard.writeText(altText)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
          <p className="text-lg leading-relaxed text-zinc-200 italic">"{altText}"</p>
          <div className="pt-4 border-t border-zinc-800">
            <code className="text-xs text-orange-500">
              &lt;img src="..." alt="{altText}" /&gt;
            </code>
          </div>
        </div>
      )}
    </div>
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
          <p className="text-sm text-zinc-500">AI-powered color suggestions that maintain brand identity while passing WCAG AA/AAA.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500">Foreground Color</label>
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
            <label className="text-xs font-bold uppercase text-zinc-500">Background Color</label>
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
                <p className="text-xs text-zinc-500">{suggestion.explanation}</p>
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

function DevOpsPanel() {
  const dockerfile = `
# Multi-stage build for A11y-GPT
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./ .next
COPY --from=builder /app/package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
  `.trim();

  const k8sManifest = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: a11y-gpt-engine
spec:
  replicas: 3
  selector:
    matchLabels:
      app: a11y-gpt
  template:
    metadata:
      labels:
        app: a11y-gpt
    spec:
      containers:
      - name: engine
        image: a11y-gpt:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: a11y-gpt-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: a11y-gpt-engine
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  `.trim();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" /> Dockerfile
        </h3>
        <pre className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-xs font-mono overflow-auto text-zinc-400 leading-relaxed">
          {dockerfile}
        </pre>
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" /> Kubernetes Manifest (HPA)
        </h3>
        <pre className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-xs font-mono overflow-auto text-zinc-400 leading-relaxed">
          {k8sManifest}
        </pre>
      </div>
    </div>
  );
}
