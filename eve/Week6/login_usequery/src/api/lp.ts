import api from './axios';

export const getLps = async (sort: string) => {
  const { data } = await api.get(`/v1/lps`, {
    params: { sort }
  });
  return data; 
};

export const getLpDetail = async (lpid: string) => {
  if (!lpid) return null;
  const { data } = await api.get(`/v1/lps/${lpid}`);
  return data;
};