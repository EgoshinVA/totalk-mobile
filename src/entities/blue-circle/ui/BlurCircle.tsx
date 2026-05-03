import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BlurMask, Canvas, Circle} from '@shopify/react-native-skia';

interface GlowOrbProps {
    size: number;
    color: string;
    blur: number; // Насколько сильно размыть (в пикселях)
    opacity?: number;
    style?: any; // Для абсолютного позиционирования
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
                                                    size,
                                                    color,
                                                    blur,
                                                    opacity = 0.3,
                                                    style
                                                }) => {
    const center = size / 2;

    const canvasSize = size + (blur * 2);

    return (
        <View
            style={[
                styles.container,
                {
                    width: canvasSize,
                    height: canvasSize,
                    marginLeft: -blur,
                    marginTop: -blur,
                },
                style,
            ]}
        >
            <Canvas style={styles.canvas}>
                <Circle
                    cx={center + blur}
                    cy={center + blur}
                    r={center}
                    color={color}
                    opacity={opacity}
                >
                    <BlurMask blur={blur} style="normal"/>
                </Circle>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        pointerEvents: 'none', // Чтобы круги не перекрывали клики по кнопкам
    },
    canvas: {
        flex: 1,
    },
});