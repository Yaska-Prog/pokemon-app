import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PokemonCard from '../components/PokemonCard';
import { fetchPokemonList, fetchPokemonDetails } from '../api';
import { addPokemon, removePokemon } from '../redux/actions';
import CustomButton from '../components/CustomButton';
import SelectedPokemonModal from '../components/SelectedPokemonModal';

export const HomePage = ({ navigation }) => {
    const dispatch = useDispatch();
    const selectedPokemon = useSelector((state) => state.selectedPokemon);

    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { results, next } = await fetchPokemonList(offset);
                const detailedPokemonList = await Promise.all(
                    results.map(async (pokemon) => {
                        const details = await fetchPokemonDetails(pokemon.url);
                        const abilitiesWithDetails = await Promise.all(
                            details.abilities.map(async (ability) => {
                                const abilityDetails = await fetchPokemonDetails(ability.ability.url);
                                return {
                                    ...ability.ability,
                                    description: abilityDetails.effect_entries[0].short_effect,
                                };
                            })
                        );
                        return extractPokemonDetails(details, abilitiesWithDetails);
                    })
                );
                setPokemonList((prevList) => [...prevList, ...detailedPokemonList]);
                setHasMoreData(next !== null);
                setIsLoading(false);
                setLoadingMore(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
                setLoadingMore(false);
            }
        };

        fetchData();
    }, [offset]);

    const loadMore = () => {
        if (hasMoreData && !loadingMore) {
            setLoadingMore(true);
            setOffset((prevOffset) => prevOffset + 20);
        }
    };

    const extractPokemonDetails = (data, abilities) => {
        const types = data.types.map((type) => type.type);
        const stats = {
            hp: data.stats.find((stat) => stat.stat.name === 'hp').base_stat,
            attack: data.stats.find((stat) => stat.stat.name === 'attack').base_stat,
            defense: data.stats.find((stat) => stat.stat.name === 'defense').base_stat,
            specialAttack: data.stats.find((stat) => stat.stat.name === 'special-attack').base_stat,
            specialDefense: data.stats.find((stat) => stat.stat.name === 'special-defense').base_stat,
            speed: data.stats.find((stat) => stat.stat.name === 'speed').base_stat,
        };
        const sprites = data.sprites;

        return {
            name: data.name,
            height: data.height,
            weight: data.weight,
            types,
            abilities,
            stats,
            sprites,
        };
    };

    const handleAddPokemon = (pokemon) => {
        if (selectedPokemon.length >= 2) {
            Alert.alert(
                'Reached Limit',
                'You have reached the limit of 2 selected Pokémon. Please remove one from your list before adding a new Pokémon.'
            );
        } else {
            dispatch(addPokemon(pokemon));
        }
    };

    const handleRemovePokemon = (pokemonName) => {
        dispatch(removePokemon(pokemonName));
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const renderItem = ({ item }) => {
        const isInSelectedList = selectedPokemon.some((selectedPokemon) => selectedPokemon.name === item.name);

        return (
            <PokemonCard
                item={item}
                onPress={() => navigation.navigate('DetailPage', { pokemonDetails: item })}
                onAddPokemon={() => (isInSelectedList ? handleRemovePokemon(item.name) : handleAddPokemon(item))}
                isRemoveButton={isInSelectedList}
            />
        );
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <FlatList
                        data={pokemonList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.name}
                        numColumns={2}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                    />
                    {selectedPokemon.length > 0 && (
                        <CustomButton
                            count={selectedPokemon.length}
                            onShowModal={toggleModal}
                        />
                    )}
                    <SelectedPokemonModal
                        isVisible={showModal}
                        onClose={toggleModal}
                        selectedPokemon={selectedPokemon}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fabBadge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});