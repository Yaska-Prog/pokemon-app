import React, { useState, useEffect } from 'react';
import { View, Modal, FlatList, ActivityIndicator, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchPokemonList, fetchPokemonDetails } from '../api';

const BottomSheetModal = ({ isVisible, onClose, onSelectPokemon }) => {
    const [pokemonListForModal, setPokemonListForModal] = useState([]);
    const [isLoadingModal, setIsLoadingModal] = useState(true);
    const [loadingMoreModal, setLoadingMoreModal] = useState(false);
    const [offsetModal, setOffsetModal] = useState(0);
    const [hasMoreDataModal, setHasMoreDataModal] = useState(true);

    useEffect(() => {
        const fetchDataForModal = async () => {
            try {
                const { results, next } = await fetchPokemonList(offsetModal);
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
                setPokemonListForModal((prevList) => [...prevList, ...detailedPokemonList]);
                setHasMoreDataModal(next !== null);
                setIsLoadingModal(false);
                setLoadingMoreModal(false);
            } catch (error) {
                console.error('Error fetching data for modal:', error);
                setIsLoadingModal(false);
                setLoadingMoreModal(false);
            }
        };

        fetchDataForModal();
    }, [offsetModal]);

    const loadMoreModal = () => {
        if (hasMoreDataModal && !loadingMoreModal) {
            setLoadingMoreModal(true);
            setOffsetModal((prevOffset) => prevOffset + 20);
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

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <FlatList
                        data={pokemonListForModal}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.pokemonItem}
                                onPress={() => {
                                    onSelectPokemon(item);
                                    onClose();
                                }}
                            >
                                <Image source={{ uri: item.sprites.front_default }} style={styles.pokemonImage} />
                                <Text style={styles.pokemonName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.name}
                        numColumns={3}
                        onEndReached={loadMoreModal}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={loadingMoreModal ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    pokemonItem: {
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 16,
    },
    pokemonImage: {
        width: 80,
        height: 80,
    },
    pokemonName: {
        marginTop: 8,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#007aff',
        padding: 8,
        borderRadius: 4,
        alignSelf: 'flex-end',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default BottomSheetModal;