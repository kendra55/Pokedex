import { Container, Form, Button, Modal } from "react-bootstrap";
import { getProfile, updateProfile, updatePassword } from "../services/userService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const [form, setFormData] = useState({ name: "", mail: "" });
  const navigate = useNavigate();
  const [modalPassword, setModalPassword] = useState(false);
  const [formPassword, setFormPassword] = useState({ oldPassword: '', newPassword: '' });

  const fetchUser = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
      setFormData({
        name: response.data.name || "",
        mail: response.data.mail || "",
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      localStorage.setItem('user', JSON.stringify({ ...user, name: form.name, mail: form.mail }));

      setShow(false);
      alert('Profil mis à jour');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formPassword.oldPassword !== formPassword.newPassword) {
      try {
        await updatePassword(formPassword);
        localStorage.removeItem('token');
        navigate('/login');

      } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe :", error);
      }
    } else {
      alert("Veuillez saisir un mot de passe différent de l'ancien.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) return <Container className="mt-5">Chargement...</Container>;

  return (
    <Container className="mt-5">
      <h1> <strong>Mon Profil</strong></h1>
      <p><strong>Nom</strong> : {user.name}</p>
      <p><strong>Email</strong> : {user.mail}</p>

      <Button variant="primary" onClick={handleShow}>
        Modifier mon profil
      </Button>
      <Button variant="warning" className="ms-2" onClick={() => setModalPassword(true)}>
  Modifier mon mot de passe
</Button>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label><strong>Nom</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrer le nom"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Email</strong></Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrer l'email"
                name="mail"
                value={form.mail}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Enregistrer
            </Button>
            <Button variant="secondary" onClick={handleClose} className="ms-2">
              Annuler
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


           {/* modal du changement de mot de passe */}
<Modal show={modalPassword} onHide={() => setModalPassword(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Changer mon mot de passe</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleUpdatePassword}>
      <Form.Group className="mb-3">
        <Form.Label><strong>Ancien mot de passe</strong></Form.Label>
        <Form.Control
          type="password"
          placeholder="Entrez votre ancien mot de passe"
          value={formPassword.oldPassword}
          onChange={(e) =>
            setFormPassword((prev) => ({ ...prev, oldPassword: e.target.value }))
          }
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label><strong>Nouveau mot de passe</strong></Form.Label>
        <Form.Control
          type="password"
          placeholder="Entrez votre nouveau mot de passe"
          value={formPassword.newPassword}
          onChange={(e) =>
            setFormPassword((prev) => ({ ...prev, newPassword: e.target.value }))
          }
          required
        />
      </Form.Group>
      <Button type="submit" variant="primary">
        Modifier le mot de passe
      </Button>
      <Button
        variant="secondary"
        onClick={() => setModalPassword(false)}
        className="ms-2"
      >
        Annuler
      </Button>
    </Form>
  </Modal.Body>
</Modal>

    </Container>
  );
};

export default ProfilePage;
