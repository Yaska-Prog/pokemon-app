import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const CustomButton = ({ count, onShowModal }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onShowModal}>
            <View style={styles.buttonContent}>
                {count > 0 && (
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{count} selected Pokemon</Text>
                    </View>
                )}
                <Text style={styles.badgeText}>Click me to view the selected Pokemon</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007aff',
        borderRadius: 15,
        padding: 10,
    },
    buttonContent: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    badgeContainer: {
        backgroundColor: 'red',
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginBottom: 4,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default CustomButton;