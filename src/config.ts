import axios from 'axios';
export const baseUrl = 'http://92.42.46.74:3000/api/v1';

export const api = axios.create({
  baseURL: 'http://92.42.46.74:3000/api/v1',
});

export const getProxy = async () => {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');
  const response = await api.get(`/users/${id}/proxy`, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

export const getAllProxyFn = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/proxy`, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

// favourite
export const AddFavouritefn = async (favourite: any) => {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');
  const response = await api.post(`users/${id}/favorites`, favourite, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

export const getAllFavouriteFn = async () => {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');
  const response = await api.get(`users/${id}/favorites?filters[kind]=favorite`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// today

export const getAllTodayFn = async () => {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');
  const response = await api.get(`users/${id}/favorites?filters[kind]=today`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

export const AddTodayfn = async (today: any) => {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');
  const response = await api.post(`users/${id}/favorites`, today, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

export const DeleteFavouritefn = async (favtodId: any) => {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');
  const response = await api.delete(`users/${id}/favorites`, {
    headers: {Authorization: `Bearer ${token}`},
    data: {
      proxiesList: [favtodId],
    },
  });
  return response.data;
};

//Identity

export const getIdentityFn = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/identity/myst', {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

export const deleteIdentityFn = async (identityId: string) => {
  const token = localStorage.getItem('token');
  const response = await api.delete<any>(`/identity/myst/${identityId}`, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

export const createIdentityFn = async (formData: FormData) => {
  const token = localStorage.getItem('token');
  const response = await api.post<any>(`/identity/myst`, formData, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

// provider

export const getAllProviderFn = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/provider/myst?filters[country]=GB&filters[providerIpType]=residential&limit=500&', {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

export const getAllProviderConnectedFn = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get('/provider/myst?filters[isRegister]=true', {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

export const disconnectProviderFn = async (providerId: string) => {
  const token = localStorage.getItem('token');

  const response = await api.delete<any>(`/provider/myst/${providerId}/proxy`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

export const connectProviderFn = async (providerId: string, formData?: any) => {
  const token = localStorage.getItem('token');

  const response = await api.post<any>(`/provider/myst/${providerId}/proxy`, formData, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

// users

export const userFn = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get('http://92.42.46.74:3000/api/v1/users/me', {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
};

export const allUserFn = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get('/users', {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

// acl

export const Aclfn = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get('/acl', {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

export const deleteAclFn = async (aclId: string) => {
  const token = localStorage.getItem('token');

  const response = await api.delete<any>(`/acl/${aclId}`, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};
