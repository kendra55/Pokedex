import { useEffect, useState } from "react";
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

    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" 
        placeholder="Enter name" 
        value={userData.name} 
        onChange={(e) => setUserData({...userData, name: e.target.value })}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>mail</Form.Label>
        <Form.Control type="mail" 
        placeholder="Enter name" 
        value={userData.mail} 
        onChange={(e) => setUserData({...userData, mail: e.target.value })} />
      </Form.Group>

      
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>password</Form.Label>
        <Form.Control
         type="password" 
        placeholder="Password" 
        value={userData.password} 
        onChange={(e) => setUserData({...userData, password: e.target.value })} />
      </Form.Group>
      
      <Button variant="primary" type="submit ">
        Submit
      </Button>
    </Form>

  );
};

export default RegisterPage;
