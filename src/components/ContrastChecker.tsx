import { useState } from 'react';
import { suggestContrastColor } from '../../services/gemini';
import {
    Palette,
    RefreshCw,
} from 'lucide-react';

export default function ContrastChecker() {
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
