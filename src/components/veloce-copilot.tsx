"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Link2, PlusCircle, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useVehicleStore } from "@/store/vehicle-store";
import { MotionWrapper } from "./motion-wrapper";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { submitFuelLog } from "@/app/actions/fuel";
import { submitMaintenanceLog } from "@/app/actions/maintenance";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    pendingAction?: {
        type: "log_fuel_draft" | "log_maintenance_draft";
        payload: any;
    };
}

export function VeloceCopilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { vehicles, fetchVehicles } = useVehicleStore();

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            // Context injection for the AI
            const garageContext = vehicles.map(v => ({
                id: v.id,
                make: v.make,
                model: v.model,
                year: v.year,
                nickname: v.nickname,
                odometer: v.baseline_odometer // Just an approximation
            }));

            const res = await fetch("/api/copilot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    vehicles: garageContext
                })
            });

            if (!res.ok) throw new Error("Failed to get response");

            const data = await res.json();

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content,
                // If the backend returns a pendingAction (function call), attach it
                pendingAction: data.pendingAction
            };

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);

        } catch (e) {
            console.error(e);
            setIsTyping(false);
        }
    };

    const handleConfirmAction = async (action: NonNullable<ChatMessage['pendingAction']>) => {
        if (action.type === 'log_fuel_draft') {
            const formData = new FormData();
            formData.append('vehicle_id', action.payload.vehicle_id);
            formData.append('date', action.payload.date || new Date().toISOString().split('T')[0]);
            formData.append('odometer', action.payload.odometer);
            formData.append('fuel_volume', action.payload.volume);
            formData.append('total_cost', action.payload.cost);

            const result = await submitFuelLog(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Fuel log saved to your vehicle!");
                // Optionally remove the pending action from the chat so it can't be clicked twice
                setMessages(messages.map(m => m.pendingAction === action ? { ...m, pendingAction: undefined } : m));
            }
        } else if (action.type === 'log_maintenance_draft') {
            const formData = new FormData();
            formData.append('vehicle_id', action.payload.vehicle_id);
            formData.append('date', action.payload.date || new Date().toISOString().split('T')[0]);
            formData.append('service_type', action.payload.service_type);
            formData.append('cost', action.payload.cost);
            if (action.payload.notes) {
                formData.append('notes', action.payload.notes);
            }

            const result = await submitMaintenanceLog(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Maintenance log saved to your vehicle!");
                setMessages(messages.map(m => m.pendingAction === action ? { ...m, pendingAction: undefined } : m));
            }
        }
    };

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
                                <h3 className="font-semibold text-sm">Veloce Copilot</h3>
                                <p className="text-[10px] text-emerald-400">Online</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4 text-muted-foreground">
                                <Bot className="h-12 w-12 opacity-20" />
                                <div>
                                    <p className="font-medium">How can I help?</p>
                                    <p className="text-sm mt-1">Try saying: "I filled up the Datsun for 1500 rupees today."</p>
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

                                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                    : 'bg-white/5 border border-white/10 text-foreground rounded-tl-sm'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>

                                    {/* Pending Action Card inside Chat */}
                                    {msg.pendingAction && (
                                        <div className="mt-3 p-3 bg-black/30 border border-white/5 rounded-xl text-sm">
                                            <div className="flex items-center font-semibold mb-2 text-primary">
                                                <Link2 className="h-4 w-4 mr-2" />
                                                Action Ready: {msg.pendingAction.type === 'log_fuel_draft' ? 'Log Fuel' : 'Action'}
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
                                                    Confirm
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 w-full text-xs border-white/10 text-white"
                                                    onClick={() => setMessages(messages.map(m => m.id === msg.id ? { ...m, pendingAction: undefined } : m))}
                                                >
                                                    Dismiss
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
                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Message Copilot..."
                                className="pr-12 bg-white/5 border-white/10 rounded-full h-11 focus-visible:ring-1 focus-visible:ring-primary/50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
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
