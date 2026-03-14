"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, AlertCircle, Loader2, Lock } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { useUserStore } from "@/store/user-store";
import { createClient } from "@/utils/supabase/client";
import { getErrorMessage } from "@/utils/errors";
import { ui } from "@/content/en/ui";

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

            if (!user) throw new Error(ui.uploads.documents.notAuthenticated);

            // Sanitize filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            // Path: /userId/vehicleId/uniqueFilename
            const filePath = `${user.id}/${vehicleId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
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

        } catch (error: unknown) {
            console.error("Upload error:", error);
            setError(getErrorMessage(error, ui.uploads.documents.uploadFailed));
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
                                <h3 className="text-lg font-semibold tracking-tight">{ui.uploads.documents.vaultLockedTitle}</h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                                    {ui.uploads.documents.vaultLockedDescription}
                                </p>
                            </div>
                        </>
                    ) : isUploading ? (
                        <>
                            <div className="p-4 bg-primary/10 text-primary rounded-full animate-pulse">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{ui.uploads.documents.uploadingTitle}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{ui.uploads.documents.uploadingDescription}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                                <UploadCloud className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold tracking-tight">
                                    {isDragActive ? ui.uploads.documents.dropToUpload : ui.uploads.documents.uploadInvoice}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                                    {ui.uploads.documents.uploadDescription}
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
