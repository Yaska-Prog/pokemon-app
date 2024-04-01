export const ADD_POKEMON = 'ADD_POKEMON';
export const REMOVE_POKEMON = 'REMOVE_POKEMON';

export const addPokemon = (pokemon) => ({
    type: ADD_POKEMON,
    payload: pokemon,
});

export const removePokemon = (pokemonName) => ({
    type: REMOVE_POKEMON,
    payload: pokemonName,
});