import { ADD_POKEMON, REMOVE_POKEMON } from './actions';

const initialState = {
    selectedPokemon: [],
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POKEMON:
            return {
                ...state,
                selectedPokemon: [...state.selectedPokemon, action.payload],
            };
        case REMOVE_POKEMON:
            return {
                ...state,
                selectedPokemon: state.selectedPokemon.filter(
                    (pokemon) => pokemon.name !== action.payload
                ),
            };
        default:
            return state;
    }
};

export default rootReducer;