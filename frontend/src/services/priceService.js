import api from './api';

export async function predictPrice(payload) {
  const { data } = await api.post('/detection/predict-price', payload);
  return data;
}

export default { predictPrice };