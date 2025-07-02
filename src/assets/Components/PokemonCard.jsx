import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  const [frenchName, setFrenchName] = useState('');
  const [primaryType, setPrimaryType] = useState('normal');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSpecies = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
        const frName = resSpecies.data.names.find(entry => entry.language.name === "fr");
        if (frName) {
          setFrenchName(frName.name);
        }

        if (pokemon.types.length > 0) {
          setPrimaryType(pokemon.types[0].type.name); // Pour le fond de la carte
        }
      } catch (err) {
        console.error("Erreur de récupération des données :", err);
      }
    };

    fetchData();
  }, [pokemon.name, pokemon.types]);

  return (
    <Card className={`text-center shadow-sm pokemon-card ${primaryType}`} style={{ width: '14rem' }}>
      <Card.Img
        variant="top"
        src={pokemon.sprites.other["official-artwork"].front_default}
        alt={frenchName || pokemon.name}
        style={{ height: '140px', objectFit: 'contain', marginTop: '10px' }}
      />
      <Card.Body>
        <Card.Title className="text-capitalize"><strong>{frenchName || pokemon.name}</strong></Card.Title>
        <div className="mb-2">
          {pokemon.types && pokemon.types.map(({ type }) => (
            <Badge key={type.name} className={`me-1 type-badge ${type.name}`}>
              {type.name}
            </Badge>
          ))}
        </div>
        <Link to={`/pokemon/${pokemon.name}`}>
          <Button variant="dark" className="w-100">Détails</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default PokemonCard;
