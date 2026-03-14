"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Link2, CheckCircle2, RotateCcw, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useVehicleStore } from "@/store/vehicle-store";
import { toast } from "sonner";
import { submitFuelLog } from "@/app/actions/fuel";
import { submitMaintenanceLog } from "@/app/actions/maintenance";
import { useUserStore } from "@/store/user-store";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import type {
    CopilotAttachment,
    CopilotRequestMessage,
    CopilotResponseBody,
    CopilotResponseSource,
    CopilotVehicleContext,
    PendingAction,
} from "@/types/ai";
import type { BadgeDefinition } from "@/lib/badges";
import { getErrorMessage } from "@/utils/errors";
import { brand } from "@/content/en/brand";
import { ui } from "@/content/en/ui";
import { getEdgeBrowserAiAvailability, promptEdgeBrowserCopilot } from "@/utils/browser-ai";

const DynamicChatMarkdown = dynamic(() => import("./chat-markdown"), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-white/10 h-4 w-3/4 rounded"></div>
});

interface ChatMessage extends CopilotRequestMessage {
    id: string;
    pendingAction?: PendingAction;
    source?: CopilotResponseSource;
}

function getCopilotSourceLabel(source?: CopilotResponseSource) {
    switch (source) {
        case "local-nlp":
            return ui.copilot.sources.localNlp;
        case "edge-local":
            return ui.copilot.sources.edgeLocal;
        case "server-gemini":
            return ui.copilot.sources.serverGemini;
        case "server-openai":
            return ui.copilot.sources.serverOpenAi;
        case "server-deepseek":
            return ui.copilot.sources.serverDeepSeek;
        case "server":
            return ui.copilot.sources.server;
        default:
            return null;
    }
}

export function VeloceCopilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [edgeBrowserAiAvailability, setEdgeBrowserAiAvailability] = useState<"available" | "downloadable" | "downloading" | "unavailable">("unavailable");
    const [pendingAttachments, setPendingAttachments] = useState<CopilotAttachment[]>([]);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { vehicles, fetchVehicles } = useVehicleStore();
    const { profile } = useUserStore();
    const hasPreferredProviderKey =
        profile.preferredProvider === "gemini"
            ? profile.hasLlmKey
            : profile.preferredProvider === "openai"
                ? profile.hasOpenAiKey
                : profile.hasDeepseekKey;

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        let isMounted = true;

        const checkEdgeBrowserAi = async () => {
            const availability = await getEdgeBrowserAiAvailability();
            if (isMounted) {
                setEdgeBrowserAiAvailability(availability);
            }
        };

        void checkEdgeBrowserAi();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSend = async () => {
        if (!input.trim() && pendingAttachments.length === 0) return;

        const userText = input;
        const currentAttachments = [...pendingAttachments];

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: userText || (currentAttachments.length > 0 ? ui.copilot.messages.uploadedDocuments(currentAttachments.length) : ""),
            attachments: currentAttachments.length > 0 ? currentAttachments : undefined
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setPendingAttachments([]);
        setIsTyping(true);

        try {
            // 1. Try Local NLP First (Zero Latency & Cost)
            // Dynamically import heavy nlp-engine to keep initial bundle small
            const { parseMessage } = await import("@/utils/nlp-engine");

            // Pass the entire conversation history instead of just the latest text
            const nlpResult = parseMessage([...messages, userMsg], vehicles);

            // If NLP found an intent but needs more info
            if (nlpResult.intent !== 'unknown' && nlpResult.missingInfo) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: nlpResult.missingInfo || ui.copilot.messages.needsMoreInfo,
                    source: "local-nlp",
                }]);
                setIsTyping(false);
                return;
            }

            // If NLP successfully drafted a full payload locally
            if (nlpResult.intent !== 'unknown' && nlpResult.payload) {
                const pendingAction: PendingAction =
                    nlpResult.intent === "log_fuel_draft"
                        ? { type: "log_fuel_draft", payload: nlpResult.payload }
                        : { type: "log_maintenance_draft", payload: nlpResult.payload };

                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: ui.copilot.messages.preparedLog,
                    pendingAction,
                    source: "local-nlp",
                }]);
                setIsTyping(false);
                return;
            }

            const garageContext: CopilotVehicleContext[] = vehicles.map(v => ({
                id: v.id,
                make: v.make,
                model: v.model,
                year: v.year,
                nickname: v.nickname,
                odometer: v.baseline_odometer
            }));

            // 2. Experimental Edge local model path for text-only chat
            if (currentAttachments.length === 0 && edgeBrowserAiAvailability === "available") {
                const browserLocalResponse = await promptEdgeBrowserCopilot(
                    [...messages, userMsg],
                    garageContext,
                );

                if (browserLocalResponse) {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: browserLocalResponse.content,
                        pendingAction: browserLocalResponse.pendingAction,
                        source: browserLocalResponse.source,
                    }]);
                    setIsTyping(false);
                    return;
                }
            }

            // 3. Fallback to cloud provider for conversational matching
            if (!hasPreferredProviderKey) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: ui.copilot.messages.missingKey(profile.preferredProvider === 'gemini' ? ui.copilot.providers.gemini : profile.preferredProvider === 'openai' ? ui.copilot.providers.openai : ui.copilot.providers.deepseekFull),
                    source: "server",
                }]);
                setIsTyping(false);
                return;
            }

            const res = await fetch("/api/copilot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    vehicles: garageContext
                })
            });

            if (!res.ok) throw new Error(ui.copilot.messages.failedResponse);
            const data = await res.json() as CopilotResponseBody;

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content,
                pendingAction: data.pendingAction,
                source: data.source,
            };

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);

        } catch (error: unknown) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: getErrorMessage(error, ui.copilot.messages.failedConnection)
            }]);
            setIsTyping(false);
        }
    };

    const handleConfirmAction = async (action: NonNullable<ChatMessage['pendingAction']>) => {
        if (action.type === 'log_fuel_draft') {
            const formData = new FormData();
            formData.append('vehicle_id', action.payload.vehicle_id);
            formData.append('date', action.payload.date || new Date().toISOString().split('T')[0]);
            formData.append('odometer', String(action.payload.odometer));
            formData.append('fuel_volume', String(action.payload.volume));
            formData.append('total_cost', String(action.payload.cost));

            const result = await submitFuelLog(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(ui.copilot.messages.fuelSaved);
                if (result.newBadges?.length) {
                    result.newBadges.forEach((badge: BadgeDefinition) => setTimeout(() => toast.success(`🏆 Unlocked: ${badge.name}!`, { description: badge.description }), 500));
                }
                await fetchVehicles(); // Force a UI refresh to show the new log immediately

                // Easiest way to clear context is to reset the chat.
                // We'll reset it to empty so the NLP engine starts fresh for the next command.
                setTimeout(() => setMessages([]), 1500);
                setMessages(prev => prev.map(message => message.pendingAction === action ? { ...message, pendingAction: undefined, content: "✅ " + message.content } : message));
            }
        } else if (action.type === 'log_maintenance_draft') {
            const formData = new FormData();
            formData.append('vehicle_id', action.payload.vehicle_id);
            formData.append('date', action.payload.date || new Date().toISOString().split('T')[0]);
            formData.append('service_type', action.payload.service_type);
            formData.append('cost', String(action.payload.cost));
            if (action.payload.notes) {
                formData.append('notes', action.payload.notes);
            }
            if (action.payload.receipt_url) {
                formData.append('receipt_url', action.payload.receipt_url);
            }

            const result = await submitMaintenanceLog(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(ui.copilot.messages.maintenanceSaved);
                if (result.newBadges?.length) {
                    result.newBadges.forEach((badge: BadgeDefinition) => setTimeout(() => toast.success(`🏆 Unlocked: ${badge.name}!`, { description: badge.description }), 500));
                }
                await fetchVehicles(); // Force a UI refresh to show the new log immediately

                setTimeout(() => setMessages([]), 1500);
                setMessages(prev => prev.map(message => message.pendingAction === action ? { ...message, pendingAction: undefined, content: "✅ " + message.content } : message));
            }
        }
    };

    const handleDismissAction = () => {
        // We can just clear the chat context entirely to start fresh, 
        // or just clear the pending action. Let's clear the pending action and append a system message, 
        // but since the NLP uses the full array, resetting the entire history on dismiss prevents the bug.
        setMessages([]);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (pendingAttachments.length + files.length > 5) {
            toast.error(ui.copilot.messages.fileLimit);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setIsUploadingFile(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error(ui.copilot.messages.notLoggedIn);

            const newAttachments: CopilotAttachment[] = [];

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `${user.id}/chat/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('vehicle-documents')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('vehicle-documents')
                    .getPublicUrl(filePath);

                newAttachments.push({
                    url: publicUrl,
                    name: file.name,
                    mimeType: file.type
                });
            }

            setPendingAttachments(prev => [...prev, ...newAttachments]);

        } catch (error: unknown) {
            toast.error(getErrorMessage(error, ui.copilot.messages.fileUploadFailed));
        } finally {
            setIsUploadingFile(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const hasExperimentalEdgeLocal = edgeBrowserAiAvailability !== "unavailable";
    const edgeExperimentalStatus = edgeBrowserAiAvailability === "available"
        ? ui.copilot.header.experimentalReady
        : edgeBrowserAiAvailability === "downloadable" || edgeBrowserAiAvailability === "downloading"
            ? ui.copilot.header.experimentalNotReady
            : null;

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/20 flex items-center justify-center hover:scale-105 transition-transform z-50 group border border-white/10"
                >
                    <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[85vh] bg-background/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-semibold text-sm">{brand.ai.copilotName}</h3>
                                    {hasExperimentalEdgeLocal && (
                                        <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/15 font-medium">
                                            {ui.copilot.providers.edgeExperimental}
                                        </div>
                                    )}
                                    <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/80 border border-primary/10 font-medium">
                                        {profile.preferredProvider === 'gemini' ? ui.copilot.providers.gemini : profile.preferredProvider === 'openai' ? ui.copilot.providers.openai : ui.copilot.providers.deepseek}
                                    </div>
                                </div>
                                <p className={`text-[10px] ${edgeExperimentalStatus ? "text-emerald-400" : ""}`}>
                                    {edgeExperimentalStatus ?? ((profile.preferredProvider === 'gemini' ? profile.hasLlmKey :
                                      profile.preferredProvider === 'openai' ? profile.hasOpenAiKey :
                                      profile.hasDeepseekKey) ? ui.copilot.header.online : ui.copilot.header.keyMissing)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {messages.length > 0 && (
                                <button
                                    onClick={() => setMessages([])}
                                    className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                    title={ui.copilot.header.newChatTitle}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-white/10 rounded-full transition-colors" title={ui.copilot.titles.close}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4 text-muted-foreground">
                                <Bot className="h-12 w-12 opacity-20" />
                                <div>
                                    <p className="font-medium">{ui.copilot.emptyState.title}</p>
                                    <p className="text-sm mt-1">{ui.copilot.emptyState.example}</p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-white/5">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                )}

                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                    : 'bg-white/5 border border-white/10 text-foreground rounded-tl-sm'
                                    }`}>
                                    {msg.role === "assistant" && getCopilotSourceLabel(msg.source) && (
                                        <div className="mb-2">
                                            <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                                {getCopilotSourceLabel(msg.source)}
                                            </span>
                                        </div>
                                    )}
                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {msg.attachments.map((att, i) => (
                                                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border ${msg.role === 'user' ? 'bg-black/20 border-black/10' : 'bg-black/20 border-white/5 text-muted-foreground'}`}>
                                                    <Paperclip className="h-3.5 w-3.5 opacity-70 shrink-0" />
                                                    <span className="truncate max-w-[150px]">{att.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                                        <DynamicChatMarkdown content={msg.content} />
                                    </div>

                                    {/* Pending Action Card inside Chat */}
                                    {msg.pendingAction && (
                                        <div className="mt-3 p-3 bg-black/30 border border-white/5 rounded-xl text-sm">
                                            <div className="flex items-center font-semibold mb-2 text-primary">
                                                <Link2 className="h-4 w-4 mr-2" />
                                                {ui.copilot.actions.actionReady}: {msg.pendingAction.type === 'log_fuel_draft' ? ui.copilot.actions.logFuel : ui.copilot.actions.genericAction}
                                            </div>
                                            <ul className="space-y-1 mb-3 text-muted-foreground text-xs">
                                                {Object.entries(msg.pendingAction.payload || {}).map(([key, value]) => (
                                                    <li key={key} className="capitalize">
                                                        <span className="font-medium text-foreground/80">{key.replace('_', ' ')}:</span> {String(value)}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="h-7 w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    onClick={() => handleConfirmAction(msg.pendingAction!)}
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                                    {ui.copilot.actions.confirm}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 w-full text-xs border-white/10 text-white"
                                                    onClick={() => handleDismissAction()}
                                                >
                                                    {ui.copilot.actions.dismiss}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="h-8 w-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                                        <User className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3 justify-start">
                                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-white/5 flex flex-col gap-2">
                        {pendingAttachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-1">
                                {pendingAttachments.map((att, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 text-primary rounded-full w-fit max-w-full text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
                                        <Paperclip className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate max-w-[150px]">{att.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setPendingAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                            className="ml-1 p-0.5 hover:bg-black/20 rounded-full shrink-0"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2">
                            {profile.hasLlmKey && (
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*,application/pdf"
                                        onChange={handleFileUpload}
                                        multiple
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploadingFile || isTyping}
                                        className="h-11 w-11 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 disabled:opacity-50 transition-colors"
                                        title={ui.copilot.composer.attachTitle}
                                    >
                                        {isUploadingFile ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                                    </button>
                                </>
                            )}
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={ui.copilot.composer.inputPlaceholder}
                                className="pr-12 bg-white/5 border-white/10 rounded-full h-11 focus-visible:ring-1 focus-visible:ring-primary/50"
                            />
                            <button
                                type="submit"
                                disabled={(!input.trim() && pendingAttachments.length === 0) || isTyping || isUploadingFile}
                                className="absolute right-2 h-7 w-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground transition-colors"
                            >
                                <Send className="h-3.5 w-3.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
