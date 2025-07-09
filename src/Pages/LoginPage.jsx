import React, { useState } from 'react';
import { login } from '../services/userService';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [userData, setUserData] = useState({ name: '', mail: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(userData);

      const token = response.data.token;
      const decoded = jwtDecode(response.data.token); // on suppose que le token contient username ou name

      const user = {
        name: decoded.username || decoded.name, // adapte selon le payload du token
        mail: userData.mail,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Utilisateur connecté');
      navigate('/profile');
      window.location.reload();
    } catch (error) {
      alert('Login ou mot de passe incorrect');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Login page</h1>
      <Form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='mail' className='form-label'> Email Adresse</label>
          <input
            type="email"
            className='form-control'
            id='mail'
            placeholder='Enter mail'
            value={userData.mail}
            onChange={(e) => setUserData({ ...userData, mail: e.target.value })}
            required
          />
        </div>

        <div className='mb-3'>
          <label htmlFor='password' className='form-label'> Mot de passe</label>
          <input
            type="password"
            className='form-control'
            id='password'
            placeholder='Enter password'
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required
          />
        </div>

        <Button type="submit" className='btn btn-primary'>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
