import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../Context';

export const BottomNavigation = ({ navigation }) => {
    const { currentPage, setCurrentPage } = useContext(AppContext);

    const handleNavigation = (page) => {
        setCurrentPage(page);
        navigation.navigate(page);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.navButton,
                    currentPage === 'Home' && styles.activeButton,
                ]}
                onPress={() => handleNavigation('Home')}
            >
                <MaterialIcons name="home" size={24} color="black" />
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.navButton,
                    currentPage === 'Compare' && styles.activeButton,
                ]}
                onPress={() => handleNavigation('Compare')}
            >
                <MaterialIcons name="compare" size={24} color="black" />
                <Text style={styles.buttonText}>Compare</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'yellow',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    navButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    activeButton: {
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 12,
        marginTop: 5,
        color: 'black',
    },
});