"use client";

import { useState, useRef } from "react";
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { ui } from "@/content/en/ui";

interface ImageUploadOrLinkProps {
    onImageSelected: (url: string) => void;
    currentUrl?: string | null;
}

export function ImageUploadOrLink({ onImageSelected, currentUrl }: ImageUploadOrLinkProps) {
    const [mode, setMode] = useState<"upload" | "link">("upload");
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
    const [linkInput, setLinkInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert(ui.uploads.imagePicker.invalidFile);
            return;
        }

        setIsUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error(ui.uploads.documents.notAuthenticated);

            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('vehicles')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('vehicles')
                .getPublicUrl(filePath);

            setPreviewUrl(data.publicUrl);
            onImageSelected(data.publicUrl);
        } catch (error: unknown) {
            console.error("Upload failed", error);
            alert(ui.uploads.imagePicker.uploadFailed(error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setIsUploading(false);
        }
    };

    const handleLinkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (linkInput.trim()) {
            setPreviewUrl(linkInput.trim());
            onImageSelected(linkInput.trim());
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex bg-muted/50 p-1 rounded-xl w-full max-w-sm mx-auto">
                <Button
                    type="button"
                    variant={mode === "upload" ? "default" : "ghost"}
                    className={`flex-1 rounded-lg text-sm h-8 ${mode === "upload" ? "shadow-sm" : ""}`}
                    onClick={() => setMode("upload")}
                    disabled={isUploading}
                >
                    <UploadCloud className="h-4 w-4 mr-2" />
                    {ui.uploads.imagePicker.modes.upload}
                </Button>
                <Button
                    type="button"
                    variant={mode === "link" ? "default" : "ghost"}
                    className={`flex-1 rounded-lg text-sm h-8 ${mode === "link" ? "shadow-sm" : ""}`}
                    onClick={() => setMode("link")}
                    disabled={isUploading}
                >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    {ui.uploads.imagePicker.modes.link}
                </Button>
            </div>

            <div className="border border-dashed rounded-[1.5rem] p-4 flex flex-col items-center justify-center min-h-[160px] bg-muted/20 relative overflow-hidden group transition-all hover:bg-muted/40 text-center">
                {previewUrl ? (
                    <div className="absolute inset-0 w-full h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt={ui.uploads.imagePicker.previewAlt} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="rounded-xl"
                                onClick={() => {
                                    setPreviewUrl(null);
                                    onImageSelected("");
                                    setLinkInput("");
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                            >
                                {ui.uploads.imagePicker.clearImage}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {mode === "upload" && (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImageIcon className="h-6 w-6" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{ui.uploads.imagePicker.clickToUpload}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{ui.uploads.imagePicker.supportedFormats}</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </div>
                        )}

                        {mode === "link" && (
                            <div className="w-full max-w-sm px-4">
                                <p className="text-sm font-medium mb-2 text-left">{ui.uploads.imagePicker.pasteImageUrl}</p>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder={ui.uploads.imagePicker.imageUrlPlaceholder}
                                        value={linkInput}
                                        onChange={(e) => setLinkInput(e.target.value)}
                                        className="rounded-xl"
                                        onKeyDown={(e) => e.key === 'Enter' && handleLinkSubmit(e)}
                                    />
                                    <Button type="button" onClick={handleLinkSubmit} className="rounded-xl shrink-0">
                                        {ui.uploads.imagePicker.preview}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
