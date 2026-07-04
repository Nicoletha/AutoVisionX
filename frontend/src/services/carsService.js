import api from './api';

export async function getCars() {
  const { data } = await api.get('/cars');
  return data;
}

export async function getCarById(id) {
  const { data } = await api.get(`/cars/${id}`);
  return data;
}

export default { getCars, getCarById };
