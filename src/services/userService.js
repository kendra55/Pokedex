import API from './api';

// Appel de l'inscription
export const register = (data) => API.post('/register', data);

// Appel de la connexion
export const login = async (data) => {
  const response = await API.post('/login', data);

  // Vérifie et stocke le token reçu dans le localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    console.log("Token enregistré :", response.data.token);   
  }

  if (response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    console.log("Utilisateur enregistré :", response.data.user);
  } else {
  localStorage.removeItem("user");
}

  return response;
};

// Appel pour récupérer le profil
export const getProfile = (data) =>
  API.get('/profile', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  
  export const updateProfile = (data) => API.put('/profile/update', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

    export const updatePassword = (data) => API.put('/profile/password/update', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });