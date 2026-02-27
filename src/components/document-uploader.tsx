"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, AlertCircle, Loader2, CheckCircle2, Lock } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { useUserStore } from "@/store/user-store";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";

interface DocumentUploaderProps {
    vehicleId: string;
    onUploadSuccess: (url: string, path: string) => void;
}

export function DocumentUploader({ vehicleId, onUploadSuccess }: DocumentUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { profile } = useUserStore();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Not authenticated");

            // Sanitize filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            // Path: /userId/vehicleId/uniqueFilename
            const filePath = `${user.id}/${vehicleId}/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('vehicle-documents')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw new Error(uploadError.message);

            const { data: { publicUrl } } = supabase.storage
                .from('vehicle-documents')
                .getPublicUrl(filePath);

            onUploadSuccess(publicUrl, filePath);

        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Something went wrong uploading the file.");
        } finally {
            setIsUploading(false);
        }
    }, [vehicleId, onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        maxSize: 5242880, // 5MB
        disabled: !profile.hasLlmKey
    });

    return (
        <MotionWrapper delay={0.1}>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 transition-colors duration-200 cursor-pointer text-center
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                    ${isDragReject ? 'border-red-500 bg-red-500/10' : ''}
                    ${isUploading ? 'pointer-events-none opacity-50' : ''}
                `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center space-y-4">
                    {!profile.hasLlmKey ? (
                        <>
                            <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                                <Lock className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold tracking-tight">AI Vault Locked</h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                                    Please add your Gemini API key in Profile Settings to use invoice tracking.
                                </p>
                            </div>
                        </>
                    ) : isUploading ? (
                        <>
                            <div className="p-4 bg-primary/10 text-primary rounded-full animate-pulse">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Uploading securely...</h3>
                                <p className="text-sm text-muted-foreground mt-1">Please wait while we encrypt your document.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                                <UploadCloud className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold tracking-tight">
                                    {isDragActive ? "Drop to upload" : "Upload Maintenance Invoice"}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                                    Drag and drop an image or PDF of your receipt, or click to browse. Max 5MB.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-start text-left text-sm">
                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </MotionWrapper>
    );
}
