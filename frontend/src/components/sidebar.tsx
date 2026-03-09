"use client";

import { Search, Trash2, Plus, LayoutGrid, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Collapsible,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
    history: string[];
    setTopic: (topic: string) => void;
    clearHistory: () => void;
}

export default function Sidebar({ history, setTopic, clearHistory }: SidebarProps) {
    return (
        <div className="hidden lg:flex w-[260px] bg-[#0f0f0f] text-white flex-col fixed left-0 top-0 h-screen shrink-0 border-r border-white/[0.08] z-40">

            {/* User / Workspace */}
            <div className="px-3 py-3 border-b border-white/[0.08]">
                <Collapsible>
                    <CollapsibleTrigger >
                        <Button
                            variant="ghost"
                            className="w-full flex items-center justify-between px-3 py-2 h-auto hover:bg-white/[0.08] text-white/80 hover:text-white rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-white/50" />
                                <span className="text-sm font-medium">My Workspace</span>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                        </Button>
                    </CollapsibleTrigger>
                </Collapsible>
            </div>

            <Separator className="bg-white/[0.08]" />

            {/* Nav Actions */}
            <div className="px-3 py-3 space-y-0.5">
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-2.5 px-3 py-2 h-auto bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg"
                >
                    <Plus className="w-4 h-4" />
                    New topic
                </Button>
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-2.5 px-3 py-2 h-auto hover:bg-white/[0.08] text-white/60 hover:text-white text-sm rounded-lg"
                >
                    <Search className="w-4 h-4" />
                    Search
                </Button>
            </div>

            <Separator className="bg-white/[0.08]" />

            {/* History Section */}
            <div className="px-3 py-3 flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">Recent</span>
                    {history.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearHistory}
                            className="h-6 w-6 text-white/30 hover:text-red-400 hover:bg-white/[0.08] rounded"
                            title="Clear History"
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>

                <ScrollArea className="flex-1">
                    <div className="space-y-0.5 pr-2">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-center">
                                <p className="text-xs text-white/30">No recent searches</p>
                            </div>
                        ) : (
                            history.map((item, idx) => (
                                <Button
                                    key={idx}
                                    variant="ghost"
                                    onClick={() => setTopic(item)}
                                    className="w-full justify-start px-3 py-2 h-auto hover:bg-white/[0.08] text-white/60 hover:text-white text-sm rounded-lg gap-2.5 group"
                                >
                                    <FileText className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 shrink-0" />
                                    <span className="line-clamp-1 text-xs text-left">{item}</span>
                                </Button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

        </div>
    );
}