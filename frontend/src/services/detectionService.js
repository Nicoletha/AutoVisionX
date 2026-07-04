import api from './api';

/**
 * Envía la imagen capturada o subida al backend para su análisis.
 * El backend reenvía la imagen al servicio de IA, cruza el resultado
 * contra la base de datos y responde con el detalle completo.
 *
 * @param {File} imageFile - archivo de imagen (upload o snapshot de cámara)
 * @param {'upload'|'camera'} source
 * @returns {Promise<DetectionResult>}
 */
export async function predictDetection(imageFile, source = 'upload') {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('source', source);

  const { data } = await api.post('/detection/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

/**
 * Obtiene el historial de detecciones (uso interno / métricas).
 */
export async function getDetectionHistory() {
  const { data } = await api.get('/detection/history');
  return data;
}

export default { predictDetection, getDetectionHistory };
