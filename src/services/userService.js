
import API from './api';

export const register = (data) => API.post('/register', data);
export const login = (data) => API.post('/login', data);
export const getProfile = () => API.get('/profile', {
    // authorisation est nécessaire pour accéder à cette route
    headers: {
        Authorization: `${localStorage.getItem('token')}`,
    },
});

console.log();
