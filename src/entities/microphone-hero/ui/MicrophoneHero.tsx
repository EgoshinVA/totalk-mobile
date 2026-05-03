import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, View} from 'react-native';
import {borderRadius, colors} from "@/shared/styles";
import {CalendarDays, Check, Quote} from 'lucide-react-native';

export const MicrophoneHero: React.FC = () => {
    const animCal = useRef(new Animated.Value(0)).current;
    const animCheck = useRef(new Animated.Value(0)).current;
    const animQuote = useRef(new Animated.Value(0)).current;

    const createWiggle = (value: Animated.Value, duration: number) => {
        return Animated.loop(
            Animated.sequence([
                Animated.timing(value, {
                    toValue: 1,
                    duration: duration,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(value, {
                    toValue: 0,
                    duration: duration,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );
    };

    useEffect(() => {
        createWiggle(animCal, 700).start();
        createWiggle(animCheck, 800).start();
        createWiggle(animQuote, 500).start();
    }, []);

    // 3. Интерполяция углов (базовый угол из стилей +/- пару градусов)
    const rotCal = animCal.interpolate({
        inputRange: [0, 1],
        outputRange: ['-20deg', '6deg'],
    });
    const rotCheck = animCheck.interpolate({
        inputRange: [0, 1],
        outputRange: ['-6deg', '18deg'],
    });
    const rotQuote = animQuote.interpolate({
        inputRange: [0, 1],
        outputRange: ['-3deg', '15deg'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                <Image
                    source={require('../../../shared/assets/microphone.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            {/* Календарь */}
            <Animated.View style={[styles.badgeCalendar, { transform: [{ rotate: rotCal }] }]}>
                <CalendarDays size={20} color={colors.accent} strokeWidth={2}/>
            </Animated.View>

            {/* Галочка */}
            <Animated.View style={[styles.badgeCheck, { transform: [{ rotate: rotCheck }] }]}>
                <View style={styles.iconWrapper}>
                    <Check size={16} color={colors.svgBack} strokeWidth={4} />
                </View>
            </Animated.View>

            {/* Кавычки */}
            <Animated.View style={[styles.badgeQuote, { transform: [{ rotate: rotQuote }] }]}>
                <Quote size={15} color={colors.accentLight} fill={colors.accentLight} strokeWidth={2} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 260,
        height: 260,
        alignSelf: 'center',
    },
    imageWrapper: {
        width: 330,
        height: 330,
        borderRadius: borderRadius.lg,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badgeCalendar: {
        position: 'absolute',
        top: 80,
        right: 40,
        width: 48,
        height: 48,
        borderWidth: 1.5,
        borderColor: colors.borderColor,
        borderRadius: 16,
        backgroundColor: colors.svgBack,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeCheck: {
        position: 'absolute',
        top: 160,
        left: 20,
        width: 56,
        height: 56,
        borderWidth: 1.5,
        borderColor: colors.borderColor,
        borderRadius: 16,
        backgroundColor: colors.svgBack,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeQuote: {
        position: 'absolute',
        top: 160,
        right: -20,
        width: 40,
        height: 40,
        borderWidth: 1.5,
        borderColor: colors.borderColor,
        borderRadius: 16,
        backgroundColor: colors.svgBack,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 24,
        height: 24,
        backgroundColor: colors.badgeGreen,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
});