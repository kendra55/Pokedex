import axios from "axios";
//création d'une nouvelle instance axios avec la base URL du serveur
const API = axios.create({
    baseURL: "https://localhost:3000/api"
})

 export default API;