import { Stethoscope } from 'lucide-react';

export default function Header() {
    return (
        <header role="banner" className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div aria-hidden="true" className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                        <Stethoscope className="w-5 h-5 text-black" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        A11y-GPT <span className="text-orange-500 italic">Remediation</span>
                    </h1>
                </div>
            </div>
        </header>
    );
}