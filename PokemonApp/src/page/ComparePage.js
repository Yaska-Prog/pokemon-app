import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart } from 'react-native-gifted-charts';
import BottomSheetModal from '../components/BottomSheetModal';
import { addPokemon } from '../redux/actions';

export const ComparePage = ({ navigation }) => {
    const dispatch = useDispatch();
    const selectedPokemon = useSelector((state) => state.selectedPokemon);

    const [showBottomSheet, setShowBottomSheet] = useState(false);

    const colors = [
        "#7FFF7F", // Green
        "#7F7FFF", // Blue
        "#FF7F7F", // Red
        "#7F7FFF", // Purple
        "#FFFF7F"  // Yellow
    ];

    const generateBarChartData = () => {
        var stats = {
            "pokeName": [],
            "atk": [],
            "def": [],
            "hp": [],
            "spAtt": [],
            "spDef": [],
            "spd": [],
        }
        selectedPokemon.forEach(function (pokemon, index) {
            stats.pokeName.push(pokemon.name);
            stats.atk.push(pokemon.stats.attack);
            stats.def.push(pokemon.stats.defense);
            stats.hp.push(pokemon.stats.hp);
            stats.spAtt.push(pokemon.stats.specialAttack);
            stats.spDef.push(pokemon.stats.specialDefense);
            stats.spd.push(pokemon.stats.speed);
        })
        var datasets = [];
        for (const key in stats) {
            if (key != 'pokeName') {
                for (let i = 0; i < stats[key].length; i++) {
                    if (i == 0) {
                        datasets.push({
                            value: stats[key][i],
                            label: key,
                            spacing: 2,
                            labelWidth: 30,
                            labelTextStyle: { color: 'gray', fontSize: 12, fontWeight: 'bold' },
                            frontColor: colors[i]
                        })
                    } else {
                        datasets.push({
                            value: stats[key][i],
                            frontColor: colors[i]
                        })
                    }
                }
            }
        }
        return datasets;
    };

    const renderTableRow = (rowData, isHeader = false) => {
        const maxWidths = isHeader ? rowData.map((_, index) => getMaxCellWidth(rowData, index)) : null;

        return (
            <View style={[styles.tableRow, isHeader && styles.tableHeaderRow]}>
                {rowData.map((item, index) => (
                    <View key={index} style={[styles.tableCell, isHeader && { flex: maxWidths[index] }]}>
                        <Text style={[styles.tableCellText, isHeader && styles.tableHeaderText]}>{item}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const getMaxCellWidth = (rowData, columnIndex) => {
        const cellTexts = rowData.map((item) => String(item).length);
        const maxWidth = Math.max(...cellTexts);
        return maxWidth;
    };

    const renderTitle = () => {
        return (
            <View style={{ marginVertical: 30 }}>
                <Text
                    style={{
                        color: 'navy',
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>
                    Chart of comparison
                </Text>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginTop: 24,
                        // backgroundColor: 'yellow',
                    }}>
                    {selectedPokemon.map((pokemon, index) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{
                                    height: 12,
                                    width: 12,
                                    borderRadius: 6,
                                    backgroundColor: colors[index],
                                    marginRight: 8,
                                }}
                            />
                            <Text
                                style={{
                                    width: 60,
                                    height: 16,
                                    color: 'black',
                                }}>
                                {pokemon.name}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        )
    }

    const renderTable = () => {
        const tableHeaders = ['Name', 'Height', 'Weight', 'Types'];
        const tableData = selectedPokemon.map((pokemon) => [
            pokemon.name,
            `${pokemon.height * 10} cm`,
            `${pokemon.weight / 10} kg`,
            pokemon.types.map((type) => type.name).join(', '),
        ]);

        return (
            <View style={styles.tableContainer}>
                {renderTableRow(tableHeaders, true)}
                {tableData.map((rowData, index) => (
                    <View key={index} style={styles.tableRowContainer}>
                        {renderTableRow(rowData)}
                    </View>
                ))}
            </View>
        );
    };

    const toggleBottomSheet = () => {
        setShowBottomSheet(!showBottomSheet);
    };

    const handleSelectPokemon = (pokemon) => {
        dispatch(addPokemon(pokemon));
        toggleBottomSheet();
    };

    return (
        <View style={styles.container}>
            {selectedPokemon.length >= 2 ? (
                <>
                    {renderTitle()}
                    <BarChart
                        data={generateBarChartData()}
                        barWidth={8}
                        spacing={30}
                        // roundedTop
                        // roundedBottom
                        hideRules
                        xAxisThickness={0}
                        yAxisThickness={0}
                        yAxisTextStyle={{ color: 'gray' }}
                    // noOfSections={3}
                    // maxValue={75}
                    />
                    <View style={styles.centeredTableContainer}>
                        {renderTable()}
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.noItemsText}>No Pokémon selected for comparison</Text>
                    <TouchableOpacity style={styles.addButton} onPress={toggleBottomSheet}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </>
            )}
            <BottomSheetModal
                isVisible={showBottomSheet}
                onClose={toggleBottomSheet}
                onSelectPokemon={handleSelectPokemon}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    tableHeaderRow: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },
    tableHeaderText: {
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableCell: {
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    centeredTableContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        // flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    barChart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
    },
    tableContainer: {
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableCell: {
        // flex: 2,
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    tableCellText: {
        textAlign: 'center',
    },
    noItemsText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: '#007aff',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});