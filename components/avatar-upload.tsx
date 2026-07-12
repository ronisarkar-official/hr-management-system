"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfilePicture } from "@/lib/services/image-upload";

interface AvatarUploadProps {
  profileId: string;
  currentUrl: string | null;
  initials: string;
  onUpdate?: (url: string) => void;
}

export function AvatarUpload({ profileId, currentUrl, initials, onUpdate }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const result = await updateProfilePicture(profileId, base64, file.name);
        if (result.success && result.data) {
          onUpdate?.(result.data.url);
        } else {
          alert(result.error || "Upload failed.");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
      alert("Upload failed.");
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className="size-16 ring-2 ring-border">
        <AvatarImage src={currentUrl || undefined} alt="Profile" />
        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
          {uploading ? <Loader2 className="size-5 animate-spin" /> : initials}
        </AvatarFallback>
      </Avatar>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Camera className="size-3.5" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
