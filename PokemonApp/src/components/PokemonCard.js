import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PokemonCard = ({ item, onPress, onAddPokemon, isRemoveButton }) => {
    const { name, height, weight, types, stats, sprites } = item;
    const typesList = types.map((type, index) => (
        <Text key={index} style={styles.type}>
            {type.name}
        </Text>
    ));

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
            <Image source={{ uri: sprites.front_default }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Height:</Text>
                    <Text style={styles.value}>{height * 10} cm</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Weight:</Text>
                    <Text style={styles.value}>{weight / 10} kg</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Types:</Text>
                    {typesList}
                </View>
                <TouchableOpacity
                    style={[styles.addButton, isRemoveButton && styles.removeButton]}
                    onPress={onAddPokemon}
                >
                    <Text style={styles.addButtonText}>{isRemoveButton ? 'Remove from List' : 'Add to List'}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '48%',
        aspectRatio: 1,
        marginVertical: 8,
        marginHorizontal: '1%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    name: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    label: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 4,
    },
    value: {
        color: 'white',
        fontSize: 12,
    },
    type: {
        marginRight: 4,
        padding: 4,
        backgroundColor: '#ccc',
        borderRadius: 4,
    },
    addButton: {
        backgroundColor: '#007aff',
        padding: 8,
        borderRadius: 4,
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    removeButton: {
        backgroundColor: 'red',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PokemonCard;