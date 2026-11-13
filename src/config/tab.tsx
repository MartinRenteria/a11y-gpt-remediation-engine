// src/config/tabs.ts
import { Stethoscope, Image as ImageIcon, Palette } from 'lucide-react';
import React from 'react';

import ComponentDoctor from '../components/ComponentDoctor';
import AltTextGenerator from '../components/AltTextGenerator';
import ContrastChecker from '../components/ContrastChecker';

export interface TabDefinition {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    component: React.ComponentType;
}

export const REMEDIATION_TABS: TabDefinition[] = [
    {
        id: 'doctor',
        label: 'Component Doctor',
        icon: Stethoscope,
        component: ComponentDoctor,
    },
    {
        id: 'alt',
        label: 'Alt-Text Gen',
        icon: ImageIcon,
        component: AltTextGenerator,
    },
    {
        id: 'contrast',
        label: 'Contrast Fixer',
        icon: Palette,
        component: ContrastChecker,
    },
];