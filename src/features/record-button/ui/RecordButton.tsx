import React, {useRef, useEffect} from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Animated,
    ViewStyle,
} from 'react-native';
import {Mic} from 'lucide-react-native';
import {colors} from '@/shared/styles';
import {GlowOrb} from "@/entities/blue-circle/ui/BlurCircle";

interface RecordButtonProps {
    onPress?: () => void;
    size?: number;
    style?: ViewStyle;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
                                                              onPress,
                                                              size = 128,
                                                              style,
                                                          }) => {
    const pulse = useRef(new Animated.Value(1)).current;
    const ORB_SIZE = 150;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {toValue: 1.12, duration: 1400, useNativeDriver: true}),
                Animated.timing(pulse, {toValue: 1, duration: 1400, useNativeDriver: true}),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[{
            transform: [{scale: pulse}],
            width: ORB_SIZE,
            height: ORB_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
        }, style]}>

            <GlowOrb
                size={ORB_SIZE}
                color={colors.accent}
                blur={80}
                opacity={0.35}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Сама кнопка */}
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.85}
                style={[
                    styles.button,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    },
                ]}
            >
                <Mic size={size * 0.26} color={colors.accent} strokeWidth={1.8}/>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.recordColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.accent,
        shadowColor: colors.accent,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.7,
        shadowRadius: 18,
        elevation: 12,
    },
});