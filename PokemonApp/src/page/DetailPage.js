import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

export const DetailPage = ({ route }) => {
    const { pokemonDetails } = route.params;
    const [selectedSprite, setSelectedSprite] = useState(pokemonDetails.sprites.front_default);

    const handleSpritePress = (sprite) => {
        setSelectedSprite(sprite);
    };

    const renderSprites = ({ item }) => (
        <TouchableOpacity onPress={() => handleSpritePress(item)}>
            <Image source={{ uri: item }} style={styles.spritePreview} />
        </TouchableOpacity>
    );

    const { name, height, weight, types, stats, abilities } = pokemonDetails;
    const typesList = types.map((type, index) => (
        <Text key={index} style={styles.type}>
            {type.name}
        </Text>
    ));

    const chartConfig = {
        backgroundGradientFrom: '#001f3f', // Navy blue background
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: '#001f3f',
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        propsForVerticalLabels: {
            fontSize: 14,
        },
        propsForHorizontalLabels: {
            fontSize: 14,
        },
    };

    const data = {
        labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
        datasets: [
            {
                data: [stats.hp, stats.attack, stats.defense, stats.specialAttack, stats.specialDefense, stats.speed],
                // colors: ['#ff6384', '#36a2eb', '#ffce56', '#9966ff', '#4bc0c0', '#ff9f40'], // Different colors for each stat
            },
        ],
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.spriteContainer}>
                <Image source={{ uri: selectedSprite }} style={styles.mainSprite} />
                <FlatList
                    data={[pokemonDetails.sprites.front_default, pokemonDetails.sprites.other['dream_world'].front_default]}
                    renderItem={renderSprites}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.spritePreviewContainer}
                />
            </View>

            <View style={styles.infoContainer}>
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
            </View>

            <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Stats</Text>
                <BarChart
                    data={data}
                    width={Dimensions.get('window').width - 48} 
                    height={300} 
                    chartConfig={chartConfig}
                    verticalLabelRotation={30}
                    fromZero
                    style={styles.chart}
                />
            </View>

            <View style={styles.abilitiesContainer}>
                <Text style={styles.sectionTitle}>Abilities</Text>
                {abilities.map((ability, index) => (
                    <View key={index} style={styles.abilityContainer}>
                        <Text style={styles.abilityName}>{ability.name}</Text>
                        <Text style={styles.abilityDescription}>{ability.description}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    spriteContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    mainSprite: {
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').width * 0.3,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    spritePreviewContainer: {
        marginBottom: 16,
    },
    spritePreview: {
        width: 64,
        height: 64,
        resizeMode: 'contain',
        marginHorizontal: 4,
    },
    infoContainer: {
        backgroundColor: '#f2f2f2',
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 4,
    },
    value: {
        fontSize: 16,
    },
    type: {
        marginRight: 4,
        padding: 4,
        backgroundColor: '#ccc',
        borderRadius: 4,
    },
    statsContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    chart: {
        borderRadius: 8,
        paddingVertical: 16,
    },
    abilitiesContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    abilityContainer: {
        backgroundColor: '#f2f2f2',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    abilityName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    abilityDescription: {
        fontSize: 16,
    },
});