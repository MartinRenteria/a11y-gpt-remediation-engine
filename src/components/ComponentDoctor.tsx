import { useState } from 'react';
import { remediateComponent } from '../../services/gemini';
import {
    Stethoscope,
    CheckCircle2,
    AlertCircle,
    Copy,
    Check,
    RefreshCw,
    Code2
} from 'lucide-react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { cn } from '../../lib/utils';

export default function ComponentDoctor() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ violations: string[], fixedCode: string, explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

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
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">            <button
            onClick={() => {
              setCode('');
              setResult(null);
            }}
            className="text-zinc-400 hover:text-white p-2 text-xs font-medium transition-colors"
          >
            Clear
          </button>
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
                  onClick={() => handleCopy(result.fixedCode)}
                  className={cn(
                    "text-xs flex items-center gap-1.5 transition-all duration-200",
                    copied ? "text-green-500 font-medium" : "text-zinc-400 hover:text-white"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Fixed Code
                    </>
                  )}
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
          <div className="h-[500px] bg-zinc-900/30 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-400 gap-4">
            <Stethoscope className="w-12 h-12 opacity-20" aria-hidden="true" />
            <p className="text-sm">Paste code and run analysis to see remediation</p>
          </div>
        )}
      </div>
    </div>
  );
}
