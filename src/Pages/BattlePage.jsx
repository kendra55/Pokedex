import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';  // <--- import manquant
import { getPokemonData } from '../services/pokemonService';
import { Button, Card, ProgressBar, Row, Col } from 'react-bootstrap';
import './BattlePage.css'


import attackSoundFile from '../assets/sounds/attack.mp3';
import musicFile from '../assets/sounds/battle-theme.mp3';
import victoryMusicFile from '../assets/sounds/victory.mp3';

const BattlePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const playerPokemonId = parseInt(queryParams.get('playerPokemonId'), 10);

  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [hp1, setHp1] = useState(0);
  const [hp2, setHp2] = useState(0);
  const [turn, setTurn] = useState('player');
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState(false);
  const [attackingPokemon, setAttackingPokemon] = useState(null);
  const [lastEnemyAttack, setLastEnemyAttack] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);


const attackSound = useRef(new Audio(attackSoundFile));
  const backgroundMusic = useRef(new Audio(musicFile));
  const victoryMusic = useRef(new Audio(victoryMusicFile));

  const startBattle = () => {
      backgroundMusic.current.play()

   .then(() => setMusicPlaying(true))
    .catch((err) => {
      console.warn("Musique non jouée automatiquement :", err);
    });
};

//focntion pour jouer et mettre en pause
const toggleMusic = () => {
  if (musicPlaying) {
    backgroundMusic.current.pause();
  } else {
    backgroundMusic.current.play().catch(err => console.warn("Erreur lecture musique :", err));
  }
  setMusicPlaying(!musicPlaying);
};


  // Charger les Pokémons au montage ou changement d'ID
  useEffect(() => {
    if (playerPokemonId) {
      fetchPokemons();
    }
  }, [playerPokemonId]);

  useEffect(() => {
    backgroundMusic.current.loop = true;
    backgroundMusic.current.volume = 0.4;
   
    return () => {
      backgroundMusic.current.pause();
      backgroundMusic.current.currentTime = 0;
    };
  }, []);


  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const data1 = await getPokemonData(playerPokemonId);
      let id2;
      do {
        id2 = Math.floor(Math.random() * 386) + 1;
      } while (id2 === playerPokemonId);
      const data2 = await getPokemonData(id2);



      setPokemon1(data1);
      setPokemon2(data2);
      setHp1(data1.hp * 4);
      setHp2(data2.hp * 4);

victoryMusic.current.pause();
victoryMusic.current.currentTime = 0;


      setWinner(null);
      setTurn('player');
    } catch (error) {
      console.error('Erreur chargement Pokémon :', error);
    }
    setLoading(false);
  };



  // Calcul des dégâts
  const calculateDamage = (attacker, defender, movePower) => {
      const level = 50; // niveau fictif
  const attackStat = attacker.attack;
  const defenseStat = defender.defense;
  const power = movePower || 10;

  // Formule adoucie inspirée des jeux Pokémon
  const baseDamage = (((2 * level / 5 + 2) * power * (attackStat / defenseStat)) / 50) + 2;

  // Facteur d'aléa entre 85% et 100%
  const randomFactor = (Math.random() * 0.15) + 0.85;

  return Math.floor(baseDamage * randomFactor);
};
  // Fonction générique d'attaque (joueur ou ennemi)
  const attack = (attacker, defender, move, setDefenderHp, setTurnNext, attackerLabel) => {
    setAttackAnimation(true);
    setAttackingPokemon(attackerLabel);
    attackSound.current.currentTime = 0;
 attackSound.current.play().catch(err => console.warn("Erreur lecture attaque :", err));

   

  setTimeout(() => {
    const damage = calculateDamage(attacker, defender, move.power || 10);
    
    if (attackerLabel === 'enemy') {
      setLastEnemyAttack({ name: move.name, damage });
    }

    setDefenderHp(prevHp => {
      const newHp = prevHp - damage;
      if (newHp <= 0) {
        setWinner(attacker.name);

        // Arrêter la musique de fond
    backgroundMusic.current.pause();
    backgroundMusic.current.currentTime = 0;

    // Jouer la musique de victoire
    victoryMusic.current.volume = 0.5;
    victoryMusic.current.play().catch(err => console.warn("Erreur lecture victoire :", err));


        return 0;
      }
      return newHp;
    });
    setTurnNext();
    setAttackAnimation(false);
    setAttackingPokemon(null);
  
  }, 800);
};


  // Attaque du joueur
  const playerAttack = (move) => {
    if (turn !== 'player' || winner || attackAnimation) return;
    attack(pokemon1, pokemon2, move, setHp2, () => setTurn('enemy'), 'player');
  };

  // Attaque de l'adversaire
  useEffect(() => {
    if (turn === 'enemy' && !winner && pokemon2 && pokemon1 && !attackAnimation) {
      const moves = pokemon2.moves;
      if (!moves || moves.length === 0) {
        setTurn('player');
        return;
      }
      const move = moves[Math.floor(Math.random() * moves.length)];

      const timeout = setTimeout(() => {
        attack(pokemon2, pokemon1, move, setHp1, () => setTurn('player'), 'enemy');
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [turn, winner, pokemon2, pokemon1, attackAnimation]);

  
useEffect(() => {
  if (turn === 'player') {
     const timeout = setTimeout(() => {
      setLastEnemyAttack(null);
    }, 3000); // Laisse le message 2 secondes

    return () => clearTimeout(timeout);
  }
  
}, [turn]);


  if (loading || !pokemon1 || !pokemon2) return <div>Chargement...</div>;



  return (
    <div className="container text-center mt-4">
      <h1>⚔️ Combat Pokémon !</h1>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Img
              variant="top"
              src={pokemon1.gif}
              className={attackAnimation && attackingPokemon === 'player' ? 'shake' : ''}
            />
            <Card.Body>
              <Card.Title>{pokemon1.name}</Card.Title>
              <ProgressBar now={(hp1 / (pokemon1.hp * 4))* 100} label={`${hp1} / ${pokemon1.hp} PV`} />
              <p>Attaque : {pokemon1.attack} | Défense : {pokemon1.defense} | Vitesse : {pokemon1.speed}</p>
              <h5>Choisis ton attaque :</h5>
              {pokemon1.moves.map((move, i) => (
                <Button
                  key={i}
                  onClick={() => playerAttack(move)}
                  disabled={turn !== 'player' || winner || attackAnimation}
                  className="m-1"
                >
                  {move.name} (Puissance: {move.power || '?'})
                </Button>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Img
              variant="top"
              src={pokemon2.gif}
              className={attackAnimation && attackingPokemon === 'enemy' ? 'shake' : ''}
            />
            <Card.Body>
              <Card.Title>{pokemon2.name}</Card.Title>
              <ProgressBar now={(hp2 / (pokemon2.hp * 5)) * 100} label={`${hp2} / ${pokemon2.hp} PV`} />
              <p>Attaque : {pokemon2.attack} | Défense : {pokemon2.defense} | Vitesse : {pokemon2.speed}</p>
              <h5>Attaques adversaire :</h5>
              <ul>
                {pokemon2.moves.map((move, i) => (
                  <li key={i}>{move.name}</li>
                ))}
              </ul>
              {lastEnemyAttack && (
  <div className="mt-2" aria-live='polite'>
    <strong>🗡 {pokemon2.name}</strong> utilise <strong>{lastEnemyAttack.name}</strong> et inflige <strong>{lastEnemyAttack.damage} pts</strong> !
  </div>
)}


            </Card.Body>
          </Card>
        </Col>
      </Row>

      {winner && <h2>🎉 Le gagnant est : {winner}</h2>}


      <Button onClick={fetchPokemons} className="mt-3" disabled={loading}>
        Recommencer avec d'autres Pokémon
      </Button>

      <Button variant="secondary" onClick={() => navigate('/Choosepokemon')} className="mb-3">
  ← Retour au choix des Pokémon
</Button>

<Button onClick={startBattle} variant="success" className="m-3"  disabled={musicPlaying}>
  ▶️ Commencer la bataille (musique)
</Button>

<Button onClick={toggleMusic} variant="warning" className="m-3">
  {musicPlaying ? '⏸ Pause musique' : '▶️ Reprendre musique'}
</Button>

{attackAnimation && (
  <div className="attack-flash"></div>
)}

</div>

  );
};

export default BattlePage;
