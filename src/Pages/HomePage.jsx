import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import PokemonCard from "../assets/Components/PokemonCard";
import "./HomePage.css";
import { Button, Form } from "react-bootstrap";

const HomePage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalPages, setTotalPages] = useState(0);

  const fetchPokemon = async () => {
    try {
      if (search !== "") {
        const res = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
        );
        setPokemonList([res.data]); // Résultat unique
      } else {
        const offset = (page - 1) * limit;
        const res = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        const results = res.data.results;

        setTotalPages(Math.ceil(res.data.count / limit));

        const detailed = await Promise.all(
          results.map(async (pokemon) => {
            const detail = await axios.get(pokemon.url);
            return detail.data;
          })
        );

        setPokemonList(detailed);
      }
    } catch (error) {
      console.error("Erreur de chargement :", error);
      setPokemonList([]);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, [search, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Revenir à la page 1 quand on cherche
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
     
      <Form.Control
        type="text"
        className="mb-4 col-10 col-md-6 text-dark"
        placeholder="🔍 Rechercher un Pokémon (ex: pikachu)"
        value={search}
        onChange={handleSearchChange}
      />

      {/* Pagination visible uniquement sans recherche */}
      {search === "" && (
        <>
          <p className="text-muted mb-2">
            Page {page} sur {totalPages}
          </p>
          <div className="pagination-controls d-flex flex-wrap gap-3 justify-content-center align-items-center">
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              variant="secondary"
            >
              ⬅️ Précédent
            </Button>

            <Form
              onSubmit={(e) => {
                e.preventDefault();
                const inputPage = parseInt(e.target.pageInput.value);
                if (
                  !isNaN(inputPage) &&
                  inputPage >= 1 &&
                  inputPage <= totalPages
                ) {
                  setPage(inputPage);
                }
                e.target.reset();
              }}
              className="d-flex align-items-center"
            >
              <Form.Control
                type="number"
                name="pageInput"
                placeholder={`Page (1 - ${totalPages})`}
                min="1"
                max={totalPages}
                className="me-2"
                style={{ width: "120px" }}
              />
              <Button type="submit" variant="primary">
                Aller
              </Button>
            </Form>

            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              variant="secondary"
            >
              Suivant ➡️
            </Button>
          </div>
        </>
      )}

      {/* Grille de cartes */}
      <div className="d-flex flex-wrap justify-content-center gap-4 col-12 pokemon-grid">
        {pokemonList.length > 0 ? (
          pokemonList.map((poke) => (
            <PokemonCard key={poke.id} pokemon={poke} />
          ))
        ) : (
          <p className="text-danger fw-bold mt-4">Aucun Pokémon trouvé...</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
