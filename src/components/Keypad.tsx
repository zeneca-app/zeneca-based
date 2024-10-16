import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface KeypadProps {
    onKeyPress: (key: string | number) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BUTTON_SIZE = screenWidth * 0.17;
const VERTICAL_GAP = screenHeight * 0.01;

const Keypad: React.FC<KeypadProps> = ({ onKeyPress }) => {
    const keys = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['.', 0, 'backspace']
    ];

    return (
        <View style={styles.keypad}>
            {keys.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((key, columnIndex) => (
                        <TouchableOpacity key={columnIndex} style={styles.keypadButton} onPress={() => onKeyPress(key)}>
                            {key === 'backspace' ? (
                                <Ionicons name="backspace-outline" size={24} color="white" />
                            ) : (
                                <Text style={styles.keypadButtonText}>{key}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    keypad: {
        width: '100%',
        justifyContent: 'space-between',
        paddingBottom: VERTICAL_GAP,
        marginBottom: 15
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: screenWidth * 0.08,
    },
    keypadButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keypadButtonText: {
        fontFamily: "Manrope_700Bold",
        color: 'white',
        fontSize: 28,
        textAlign: 'center',
    },
});

export default Keypad;