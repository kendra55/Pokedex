
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import PokemonDetail from './Pages/PokemonDetail';
import AppNavbar from './assets/Components/Navbar';
import PokemonCard from './assets/Components/PokemonCard';
import RegisterPage from './Pages/RegisterPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './Pages/LoginPage';
import ProfilePage from './Pages/ProfilPage';
import BattlePage from './Pages/BattlePage';
import ChoosePokemon from './Pages/ChoosePokemon'; // chemin correct vers ton composant



function App() {
 
  

  return (
    <>
 {/* //sytéme de rooting */}
      <BrowserRouter>
      <AppNavbar/>
      <Routes>
        {/* definition des routes */}
        {/* Pour la route / j'affiche mon titreHomepage */}
        <Route path='/' element={<HomePage/>} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
       <Route path="/Choosepokemon" element={<ChoosePokemon/>} />
      <Route path="/battle" element={<BattlePage />} />

        </Routes>
      </BrowserRouter>

     </>
  )
}

export default App
