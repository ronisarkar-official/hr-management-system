"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

const IMAGEKIT_URL = process.env.IMAGEKIT_URL_ENDPOINT;
const IMAGEKIT_PUBLIC = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE = process.env.IMAGEKIT_PRIVATE_KEY;

export async function uploadImage(
  base64Data: string,
  fileName: string,
  folder: string = "avatars"
): Promise<ActionResult<{ url: string }>> {
  try {
    if (!IMAGEKIT_URL || !IMAGEKIT_PRIVATE) {
      return { success: false, error: "Image upload is not configured." };
    }

    const formData = new URLSearchParams();
    formData.append("file", base64Data);
    formData.append("fileName", fileName);
    formData.append("folder", folder);
    formData.append("useUniqueFileName", "true");

    const auth = Buffer.from(`${IMAGEKIT_PUBLIC}:${IMAGEKIT_PRIVATE}`).toString("base64");

    const response = await fetch(`${IMAGEKIT_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Upload failed." };
    }

    return { success: true, data: { url: data.url } };
  } catch (err) {
    console.error("uploadImage error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteImage(fileId: string): Promise<ActionResult> {
  try {
    if (!IMAGEKIT_URL || !IMAGEKIT_PRIVATE) {
      return { success: false, error: "Image upload is not configured." };
    }

    const auth = Buffer.from(`${IMAGEKIT_PUBLIC}:${IMAGEKIT_PRIVATE}`).toString("base64");

    const response = await fetch(`${IMAGEKIT_URL}/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete image." };
    }

    return { success: true };
  } catch (err) {
    console.error("deleteImage error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateProfilePicture(
  profileId: string,
  base64Data: string,
  fileName: string
): Promise<ActionResult<{ url: string }>> {
  const uploadResult = await uploadImage(base64Data, fileName, "avatars");
  if (!uploadResult.success) return uploadResult;

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ profile_picture_url: uploadResult.data!.url })
    .eq("id", profileId);

  if (error) {
    return { success: false, error: error.message };
  }

  return uploadResult;
}
