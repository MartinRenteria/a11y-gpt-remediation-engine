import { Stethoscope, Image as ImageIcon, Palette } from 'lucide-react';

export interface TabConfig {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const REMEDIATION_TABS: TabConfig[] = [
    { id: 'doctor', label: 'Component Doctor', icon: Stethoscope },
    { id: 'alt', label: 'Alt-Text Gen', icon: ImageIcon },
    { id: 'contrast', label: 'Contrast Fixer', icon: Palette },
];