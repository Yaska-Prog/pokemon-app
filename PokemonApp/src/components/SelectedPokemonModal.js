import React from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PokemonCard from './PokemonCard';
import { useSelector, useDispatch } from 'react-redux';
import { removePokemon } from '../redux/actions';

const SelectedPokemonModal = ({ isVisible, onClose }) => {
    const dispatch = useDispatch();
    const selectedPokemon = useSelector((state) => state.selectedPokemon);

    const handleRemovePokemon = (pokemonName) => {
        dispatch(removePokemon(pokemonName));
    };

    const renderItem = ({ item }) => (
        <PokemonCard
            item={item}
            onPress={() => { }}
            onAddPokemon={() => handleRemovePokemon(item.name)}
            isRemoveButton
        />
    );

    return (
        <Modal visible={isVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <FlatList
                        data={selectedPokemon}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.name}
                        numColumns={2}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        width: '90%',
        maxHeight: '80%',
    },
    closeButton: {
        backgroundColor: '#007aff',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SelectedPokemonModal;