import axios from 'axios';

export const getPokemonData = async (id) => {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = res.data;

    // Récupérer max 4 attaques avec leur puissance
    const movesPromises = data.moves.slice(0, 4).map(async (moveEntry) => {
      const moveRes = await axios.get(moveEntry.move.url);
      const moveData = moveRes.data;
      return {
        name: moveData.name,
        power: moveData.power || 10, // valeur par défaut si power est null
      };
    });

    const moves = await Promise.all(movesPromises);

    return {
      name: data.name,
      gif: data.sprites.versions['generation-v']['black-white'].animated.front_default,
      attack: data.stats.find((s) => s.stat.name === 'attack').base_stat,
      defense: data.stats.find((s) => s.stat.name === 'defense').base_stat,
      speed: data.stats.find((s) => s.stat.name === 'speed').base_stat,
      hp: data.stats.find((s) => s.stat.name === 'hp').base_stat,
      moves: moves,   // <== ici tu remplaces bien par les attaques récupérées
      types: data.types.map(t => t.type.name)
    };
    
  } catch (error) {
    console.error("Erreur lors de la récupération du Pokémon :", error);
    return null;
  }
};
