import { useState } from "react";
import { register } from '../services/userService';
import Button from'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const RegisterPage = () => {

    const [userData, setUserData] = useState({name: '', mail:'', password: ''});



// changement intervintielle pour la validation du formulaire,une fois que tous les champs sont remplis
    const handleSubmit = async (e) => {
        // eviter le comportement par défaut du formulaire et le rechargement de la page
        e.preventDefault();
 try {
    await register(userData);
 alert('Utilisateur inscrit ');
 
 
  }catch (error) {
 
    alert('CPT');
    console.error(error);
    };
}


    return ( 

    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label><strong>Name</strong></Form.Label>
        <Form.Control 
        type="text" 
        placeholder="Enter name" 
        value={userData.name} 
        onChange={(e) => setUserData({...userData, name: e.target.value})}
     />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicMail">
        <Form.Label><strong>EMail</strong></Form.Label>
        <Form.Control 
        type="email" 
        placeholder="Enter Mail" 
        value={userData.mail} 
        onChange={(e) => setUserData({...userData, mail: e.target.value})} 
         />
      </Form.Group>

      
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label> <strong>Password</strong></Form.Label>
        <Form.Control
         type="password" 
        placeholder="Password" 
        value={userData.password} 
        onChange={(e) => setUserData({...userData, password: e.target.value})}
         />
      </Form.Group>
      
      <Button variant="primary"type="submit" >
        Submit
      </Button>
    </Form>

  );
};

export default RegisterPage;
