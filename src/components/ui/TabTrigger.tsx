import { cn } from '../../../lib/utils';
import * as Tabs from '@radix-ui/react-tabs';

export default function TabTrigger({ value, icon, label }: { value: string, icon: React.ReactNode, label: string }) {
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