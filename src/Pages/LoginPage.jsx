import react from 'react'
import { useState } from 'react'
import { login } from '../services/userService'
import { Form, Button } from 'react-bootstrap';



const LoginPage = () => {

    const [userData, setUserData] = useState({ mail:'', password: ''});
// changement intervintielle pour la validation du formulaire,une fois que tous les champs sont remplis
    
    const handleSubmit = async (e) => {
        // eviter le comportement par défaut du formulaire et le rechargement de la page
        e.preventDefault();
 try {
      const response = await login(userData);
       
// stochage du token de lAPI dans le localstorage
localStorage.setItem('token', response.data.token);

       alert('Utilisateur connecter ');
 
  }catch (error) {
 
    alert('login ou mot de passe incorrect ');
    console.error(error);
    };
}

   return (

    <div className="container">
        <h1>Login page</h1>
  <Form onSubmit={handleSubmit}>
    <div className='mb-3'>
        <label htmlFor='mail' className='form-label'> Email Adress</label>
       <input 
       type="email"
       className='form-control'
       id='mail'
       placeholder='Enter mail'
       value={userData.mail}
       onChange={(e) =>  setUserData({...userData, mail: e.target.value })}
       required />
    </div>

  <div className='mb-3'>
        <label htmlFor='mail' className='form-label'> Email Adress</label>
       <input 
       type="password"
       className='form-control'
       id='password'
       placeholder='Enter password'
       value={userData.password}
       onChange={(e) =>  setUserData({...userData, password: e.target.value  })}
       required />
    </div>
      <Button type="submit " className='btn btn-primary'>
        Login
      </Button>
    </Form>
</div>
  );
}

export default LoginPage;