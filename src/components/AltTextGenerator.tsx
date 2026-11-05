"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, RefreshCw, Copy, Check } from "lucide-react";
import { cn } from "../../lib/utils";

const escapeAttr = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export default function AltTextGenerator() {
    const [preview, setPreview] = useState<string | null>(null);
    const [altText, setAltText] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

    const generate = async (file: File) => {
        setLoading(true);
        setError(null);
        setAltText(null);
        try {
            const body = new FormData();
            body.append("image", file);

            const res = await fetch("/api/alt-text", { method: "POST", body });
            const raw = await res.text();

            let json: { altText?: string; category?: string; error?: string } = {};
            try {
                json = JSON.parse(raw);
            } catch {
                console.error("Non-JSON response:", res.status, raw.slice(0, 300));
                throw new Error(`Server returned an unexpected response (${res.status}).`);
            }

            if (!res.ok) throw new Error(json.error ?? "Request failed.");
            setAltText(json.altText ?? "");
            setCategory(json.category ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [] },
        multiple: false,
        onDrop: (files) => {
            const file = files[0];
            if (!file) return;
            setPreview(URL.createObjectURL(file));
            generate(file);
        },
    });

    const handleCopy = async () => {
        if (altText === null) return;
        try {
            await navigator.clipboard.writeText(altText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Alt-Text Generator</h2>
                <p className="text-zinc-400">
                    Upload an image to generate context-aware accessibility descriptions.
                </p>
            </div>

            <div
                {...getRootProps({
                    "aria-label": "Upload an image. Drag and drop, or press Enter to choose a file.",
                    className: cn(
                        "h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500",
                        isDragActive ? "border-orange-500 bg-orange-500/5" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                    ),
                })}
            >
                <input {...getInputProps()} />
                {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={preview}
                        alt={altText ?? "Uploaded image preview"}
                        className="h-full w-full object-contain p-4"
                    />
                ) : (
                    <>
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                            <Upload className="w-6 h-6 text-zinc-400" aria-hidden="true" />
                        </div>
                        <p className="text-sm text-zinc-400">Drag & drop image here, or click to select</p>
                    </>
                )}
            </div>

            {/* Live region stays in the DOM so screen readers announce changes */}
            <div role="status" aria-live="polite" className="min-h-6">
                {loading && (
                    <div className="flex items-center justify-center gap-3 text-orange-500">
                        <RefreshCw className="w-5 h-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                        <span className="text-sm font-medium">Analyzing visual context…</span>
                    </div>
                )}
                {!loading && altText !== null && <span className="sr-only">Alt text generated.</span>}
            </div>

            {error && (
                <p role="alert" className="text-sm text-red-400 text-center">{error}</p>
            )}

            {altText !== null && !loading && (
                <section aria-labelledby="alt-heading" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 id="alt-heading" className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                            Generated Alt Text {category && <span className="normal-case tracking-normal">({category})</span>}
                        </h3>
                        <button
                            type="button"
                            onClick={handleCopy}
                            aria-label={copied ? "Alt text copied" : "Copy alt text"}
                            className={cn(
                                "p-2 rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-orange-500",
                                copied ? "bg-green-500/10 text-green-500" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                            )}
                        >
                            {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                        </button>
                    </div>

                    {altText === "" ? (
                        <p className="text-lg text-zinc-200">
                            This image looks decorative. Use <code>alt=&quot;&quot;</code> so screen readers skip it.
                        </p>
                    ) : (
                        <p className="text-lg leading-relaxed text-zinc-200">“{altText}”</p>
                    )}

                    <div className="pt-4 border-t border-zinc-800 overflow-x-auto">
                        <code className="text-xs text-orange-400">
                            {`<img src="…" alt="${escapeAttr(altText)}" />`}
                        </code>
                    </div>
                </section>
            )}
        </div>
    );
}