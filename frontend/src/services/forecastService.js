import api from './api';

export async function forecastNextRelease(payload) {
  const { data } = await api.post('/detection/forecast-next-release', payload);
  return data;
}

export default { forecastNextRelease };