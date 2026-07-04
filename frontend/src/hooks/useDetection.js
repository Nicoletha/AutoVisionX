import { useCallback, useState } from 'react';
import { predictDetection } from '../services/detectionService';

/**
 * Orquesta el flujo completo de reconocimiento:
 * imagen -> POST /api/detection/predict -> resultado del catálogo.
 */
export function useDetection() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [source, setSource] = useState('upload');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const setImage = useCallback((file, src = 'upload') => {
    setImageFile(file);
    setSource(src);
    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setResult(null);
    setError(null);
  }, []);

  const runDetection = useCallback(async () => {
    if (!imageFile) return null;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await predictDetection(imageFile, source);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.friendlyMessage || 'No se pudo analizar la imagen.');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile, source]);

  const reset = useCallback(() => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(null);
    setImagePreviewUrl(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, [imagePreviewUrl]);

  return {
    imageFile,
    imagePreviewUrl,
    source,
    result,
    error,
    isAnalyzing,
    setImage,
    runDetection,
    reset,
  };
}

export default useDetection;
