"use client";

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { REMEDIATION_TABS } from '../config/tab';
import TabTrigger from './ui/TabTrigger';

export function RemediationWorkspace() {
    const [activeTab, setActiveTab] = useState('doctor');

    return (
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-8">
            <Tabs.List className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 self-start">
                {REMEDIATION_TABS.map(({ id, label, icon: Icon }) => (
                    <TabTrigger key={id} value={id} icon={<Icon className="w-4 h-4" />} label={label} />
                ))}
            </Tabs.List>

            <div className="flex-1">
                {REMEDIATION_TABS.map(({ id, component: TargetComponent }) => (
                    <Tabs.Content
                        key={id}
                        value={id}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                        <TargetComponent />
                    </Tabs.Content>
                ))}
            </div>
        </Tabs.Root>
    );
}