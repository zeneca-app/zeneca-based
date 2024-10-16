import React, { useRef, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';


interface LoadingScreenProps {
    isVisible: boolean;
    text: string;
}

const { width } = Dimensions.get('window');

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible, text }) => {
    const { t } = useTranslation();
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={isVisible}
        >
            <View style={styles.container}>
                <View style={styles.loadingBox}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Feather name="clock" size={40} color="white" />
                    </Animated.View>
                    <Text style={styles.loadingText}>{text}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 30,
    },
    loadingBox: {
        marginHorizontal: 20,
        backgroundColor: '#18171A',
        paddingVertical: 60,
        paddingHorizontal: 40,
        borderRadius: 20,
        alignItems: 'center',
        width: width - 40,

    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default LoadingScreen;