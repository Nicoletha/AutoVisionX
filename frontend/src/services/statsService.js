import api from './api';

export async function getPriceStats(realCarModel) {
  const { data } = await api.get('/detection/price-stats', {
    params: { realCarModel },
  });
  return data;
}

export async function getForecastStats(realCarModel) {
  const { data } = await api.get('/detection/forecast-stats', {
    params: { realCarModel },
  });
  return data;
}

export default { getPriceStats, getForecastStats };