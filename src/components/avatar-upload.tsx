"use client";

import { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ui } from "@/content/en/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@mattofficial/veloce-ui";

interface AvatarUploadProps {
  currentUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  fallbackText?: string;
}

export function AvatarUpload({
  currentUrl,
  onUploadSuccess,
  fallbackText = "U",
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const supabase = createClient();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploadError(null);
      const file = event.target.files?.[0];
      if (!file) return;

      // Optional: check file type
      if (!file.type.startsWith("image/")) {
        setUploadError(ui.uploads.avatar.invalidFile);
        return;
      }

      setIsUploading(true);

      // Get current user to ensure we upload under their ID or handle properly
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUploadError(ui.uploads.avatar.requiresAuth);
        setIsUploading(false);
        return;
      }

      // Create a unique file path for the user
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // Upload the file to the 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      onUploadSuccess(data.publicUrl);
    } catch (error: unknown) {
      console.error(
        "Error uploading avatar:",
        error instanceof Error ? error.message : error,
      );
      setUploadError(ui.uploads.avatar.failed);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={currentUrl || undefined}
          alt={ui.uploads.avatar.alt}
          className="object-cover"
        />
        <AvatarFallback className="text-2xl">{fallbackText}</AvatarFallback>
      </Avatar>

      <div className="relative group">
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label
          htmlFor="avatar-upload"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span>{ui.uploads.avatar.uploading}</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4 text-muted-foreground" />
              <span>{ui.uploads.avatar.changePicture}</span>
            </>
          )}
        </label>
      </div>
      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
    </div>
  );
}
