
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import PokemonDetail from './Pages/PokemonDetail';
import AppNavbar from './assets/Components/Navbar';
import PokemonCard from './assets/Components/PokemonCard';
import RegisterPage from './Pages/RegisterPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './Pages/LoginPage';


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
      
        </Routes>
      </BrowserRouter>

     </>
  )
}

export default App
