import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, Badge, Button, ProgressBar } from "react-bootstrap";
import "./PokemonDetail.css";

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [frenchName, setFrenchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [evoSprites, setEvoSprites] = useState({});

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(res.data);

        const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        const frName = speciesRes.data.names.find(entry => entry.language.name === "fr");
        if (frName) setFrenchName(frName.name);

        const evoChainUrl = speciesRes.data.evolution_chain.url;
        const evoRes = await axios.get(evoChainUrl);
        const chain = evoRes.data.chain;

        const evoList = [];
        let current = chain;
        while (current) {
          evoList.push(current.species.name);
          current = current.evolves_to[0];
        }
        setEvolutionChain(evoList);

        const spriteMap = {};
        for (let evoName of evoList) {
          const evoData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
          spriteMap[evoName] = evoData.data.sprites.front_default;
        }
        setEvoSprites(spriteMap);

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  if (loading || !pokemon) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  const maxStat = Math.max(...pokemon.stats.map(s => s.base_stat));
  const mainType = pokemon.types[0]?.type.name || "";

  return (
    <div className="container mt-4">
      <Card className={`pokedex-card shadow-lg type-${mainType}`} style={{ position: 'relative' }}>
        <Card.Body>
          <Card.Title className="text-capitalize fs-2 mb-3 text-center">
            {frenchName || pokemon.name}
          </Card.Title>

          <div style={{ position: 'absolute', left: '0', width: '50%' }}>
            <Card.Img
              variant="top"
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              style={{ width: "300px", margin: "0 auto", display: 'block' }}
            />
            <div className="my-3 text-center">
              <strong>Type(s) :</strong>
              <div>
                {pokemon.types.map((typeObj, index) => (
                  <Badge
                    key={index}
                    className={`mx-1 type-badge ${typeObj.type.name}`}
                  >
                    {typeObj.type.name}
                  </Badge>
                ))}
              </div>
            </div>
            <p><strong>Taille :</strong> {pokemon.height / 10} m</p>
            <p><strong>Poids :</strong> {pokemon.weight / 10} kg</p>
          </div>

          <div style={{ marginLeft: '50%', width: '50%' }}>
            <h5 className="text-center">Statistiques</h5>
            {pokemon.stats.map((stat, i) => (
              <div key={i} className="mb-2">
                <strong className="text-capitalize">{stat.stat.name} :</strong>
                <ProgressBar
                  now={stat.base_stat}
                  max={maxStat}
                  label={`${stat.base_stat}`}
                  variant="info"
                  style={{ height: "20px" }}
                />
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {evolutionChain.length > 1 && (
        <div className={`mt-4 text-center type-${mainType}`}>
          <h5>Évolutions</h5>
          <div className="evo-container">
            {evolutionChain.map((evoName, i) => (
              <Link key={i} to={`/pokemon/${evoName}`} className="evo-card">
                <img
                  src={evoSprites[evoName]}
                  alt={evoName}
                  className="evo-img"
                />
                <Button
                  variant={evoName === name ? "dark" : "outline-dark"}
                  size="sm"
                  className="evo-btn text-capitalize"
                >
                  {evoName}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link to="/" className="d-block text-center btn">
        <Button>Retour</Button>
      </Link>
    </div>
  );
};

export default PokemonDetail;
