"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { extractDataFromInvoice } from "@/app/actions/ocr";
import { CheckCircle2, Loader2, FileText } from "lucide-react";
import type { OcrExtractedData, OcrLineItem } from "@/types/ai";
import { getErrorMessage } from "@/utils/errors";

interface OcrReviewModalProps {
    vehicleId: string;
    fileUrl: string | null;
    filePath: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function OcrReviewModal({ vehicleId, fileUrl, filePath, isOpen, onClose, onSuccess }: OcrReviewModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [ocrData, setOcrData] = useState<OcrExtractedData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const updateOcrField = <K extends keyof OcrExtractedData>(field: K, value: OcrExtractedData[K]) => {
        setOcrData((currentData) => currentData ? { ...currentData, [field]: value } : currentData);
    };

    const updateLineItem = (index: number, field: keyof OcrLineItem, value: OcrLineItem["service"] | OcrLineItem["cost"]) => {
        setOcrData((currentData) => {
            if (!currentData) {
                return currentData;
            }

            const nextLineItems = currentData.line_items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item
            );

            return {
                ...currentData,
                line_items: nextLineItems,
            };
        });
    };

    // Initial Trigger when modal opens with a new file URL
    const processDocument = useCallback(async () => {
        if (!fileUrl) return;
        setIsProcessing(true);
        setError(null);
        try {
            const data = await extractDataFromInvoice(fileUrl);
            setOcrData(data);
        } catch (error: unknown) {
            setError(getErrorMessage(error, "Failed to analyze document."));
        } finally {
            setIsProcessing(false);
        }
    }, [fileUrl]);

    // Auto-run processing when modal opens if we have a URL but no data yet
    useEffect(() => {
        if (isOpen && fileUrl && !ocrData && !isProcessing && !error) {
            void processDocument();
        }
    }, [error, fileUrl, isOpen, isProcessing, ocrData, processDocument]);


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ocrData) return;

        setError(null);
        startTransition(async () => {
            try {
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) throw new Error("Not authenticated");

                // For simplicity, we create one maintenance log for the primary provider
                // and append line items to the notes section. In a full production app,
                // we'd probably create multiple rows or a dedicated line_items table.

                const lineItemsText = ocrData.line_items.map((lineItem) => `- ${lineItem.service}: $${lineItem.cost}`).join("\n");
                const notes = `Auto-extracted from receipt.\n\nLine Items:\n${lineItemsText}`;

                const maintenanceEntry = {
                    vehicle_id: vehicleId,
                    user_id: session.user.id,
                    date: ocrData.date || new Date().toISOString().split('T')[0],
                    service_type: ocrData.provider ? `Service at ${ocrData.provider}` : "General Maintenance",
                    cost: Number.parseFloat(String(ocrData.total_cost)) || 0,
                    notes: notes,
                    receipt_url: filePath // Link back to the storage path
                };

                const { error: insertError } = await supabase.from('maintenance_logs').insert(maintenanceEntry);
                if (insertError) throw insertError;

                // Also record the document in our new documents table
                if (filePath) {
                    const docName = filePath.split('/').pop() || 'Invoice.pdf';
                    await supabase.from('documents').insert({
                        vehicle_id: vehicleId,
                        file_path: filePath,
                        file_name: docName,
                    });
                }

                onSuccess();
                onClose();
            } catch (error: unknown) {
                setError(getErrorMessage(error, "Failed to save records."));
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] bg-black/80 backdrop-blur-2xl border-white/10 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        AI Receipt Analysis
                    </DialogTitle>
                    <DialogDescription>
                        Review the extracted data before saving it to your vehicle&apos;s history.
                    </DialogDescription>
                </DialogHeader>

                {isProcessing ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <div>
                            <p className="font-semibold text-foreground">Reading Document...</p>
                            <p className="text-sm text-muted-foreground mt-1">Extracting line items, dates, and costs.</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                            !
                        </div>
                        <p className="font-medium text-red-500">{error}</p>
                        <Button onClick={onClose} variant="outline" className="border-white/10">Cancel</Button>
                    </div>
                ) : ocrData ? (
                    <form onSubmit={handleSave} className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs text-muted-foreground uppercase">Service Provider</Label>
                                <Input
                                    defaultValue={ocrData.provider || ''}
                                    onChange={(e) => updateOcrField("provider", e.target.value)}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase">Date</Label>
                                <Input
                                    type="date"
                                    defaultValue={ocrData.date || ''}
                                    onChange={(e) => updateOcrField("date", e.target.value)}
                                    className="bg-white/5 border-white/10 [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase">Total Cost</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        defaultValue={ocrData.total_cost || ''}
                                        onChange={(e) => updateOcrField("total_cost", e.target.value)}
                                        className="pl-8 bg-white/5 border-white/10 font-bold text-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <Label className="text-xs text-muted-foreground uppercase flex items-center justify-between">
                                Extracted Line Items
                                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{ocrData.line_items?.length || 0} Found</span>
                            </Label>

                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {ocrData.line_items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-black/20 p-2 rounded-lg border border-white/5">
                                        <Input
                                            value={item.service}
                                            onChange={(e) => updateLineItem(idx, "service", e.target.value)}
                                            className="h-8 text-sm bg-transparent border-none shadow-none focus-visible:ring-1"
                                        />
                                        <div className="relative w-24 shrink-0">
                                            <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                value={item.cost}
                                                onChange={(e) => updateLineItem(idx, "cost", e.target.value)}
                                                className="h-8 pl-6 text-sm bg-transparent border-white/10 text-right"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!ocrData.line_items || ocrData.line_items.length === 0) && (
                                    <p className="text-sm text-muted-foreground italic text-center py-4">No detailed line items detected.</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-white/10 flex sm:justify-between">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending} className="text-muted-foreground">Discard</Button>
                            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 mr-2" /> Verify & Save</>}
                            </Button>
                        </DialogFooter>
                    </form>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
