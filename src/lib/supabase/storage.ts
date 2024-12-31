import { supabase } from './client';

const BUCKET_NAME = 'trade-screenshots';
const MAX_FILE_SIZE = 512 * 1024; // 0.5MB

/**
 * Uploads an image to Supabase Storage
 */
export async function uploadTradeImage(
  userId: string,
  file: File,
  type: 'entry' | 'exit'
): Promise<string | undefined> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image size must be less than 0.5MB');
  }

  // Create a unique file path: userId/timestamp_type.ext
  const ext = file.name.split('.').pop();
  const timestamp = new Date().getTime();
  const filePath = `${userId}/${timestamp}_${type}.${ext}`;

  // Remove old file if it exists
  try {
    const { data: existingFiles } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId);

    const oldFile = existingFiles?.find(f => f.name.includes(`_${type}.`));
    if (oldFile) {
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([`${userId}/${oldFile.name}`]);
    }
  } catch (error) {
    console.error('Error cleaning up old file:', error);
  }

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: '3600'
    });

  if (error) throw error;

  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Deletes an image from Supabase Storage
 */
export async function deleteTradeImage(url: string): Promise<void> {
  // Extract the file path from the public URL
  const path = url.split(`${BUCKET_NAME}/`)[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) throw error;
}