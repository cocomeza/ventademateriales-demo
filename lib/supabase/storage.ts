import { supabase, isSupabaseConfigured } from './client';

export interface UploadImageOptions {
  file: File;
  folder?: string;
  bucket?: string;
}

export interface UploadImageResult {
  url: string | null;
  error: string | null;
}

/**
 * Sube una imagen a Supabase Storage
 * @param file - Archivo de imagen a subir
 * @param folder - Carpeta donde guardar (opcional, por defecto 'products')
 * @param bucket - Bucket de Supabase Storage (opcional, por defecto 'images')
 * @returns URL pública de la imagen o error
 */
export async function uploadImage({
  file,
  folder = 'products',
  bucket = 'images',
}: UploadImageOptions): Promise<UploadImageResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      url: null,
      error: 'Supabase no está configurado',
    };
  }

  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    return {
      url: null,
      error: 'El archivo debe ser una imagen',
    };
  }

  // Validar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      url: null,
      error: 'La imagen es demasiado grande. Máximo 5MB',
    };
  }

  try {
    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      // Si el bucket no existe, intentar crearlo
      if (error.message.includes('Bucket not found')) {
        return {
          url: null,
          error: `El bucket "${bucket}" no existe. Por favor créalo en Supabase Storage primero.`,
        };
      }
      return {
        url: null,
        error: error.message,
      };
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      url: urlData.publicUrl,
      error: null,
    };
  } catch (error: any) {
    return {
      url: null,
      error: error.message || 'Error al subir la imagen',
    };
  }
}

/**
 * Elimina una imagen de Supabase Storage
 * @param url - URL pública de la imagen a eliminar
 * @param bucket - Bucket de Supabase Storage (opcional, por defecto 'images')
 */
export async function deleteImage(
  url: string,
  bucket: string = 'images'
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      error: 'Supabase no está configurado',
    };
  }

  try {
    // Extraer el nombre del archivo de la URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];

    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      return {
        error: error.message,
      };
    }

    return {
      error: null,
    };
  } catch (error: any) {
    return {
      error: error.message || 'Error al eliminar la imagen',
    };
  }
}

