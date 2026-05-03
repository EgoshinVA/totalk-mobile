import React from 'react';
import {SafeAreaView, StyleSheet, Text, View,} from 'react-native';
import {MicrophoneHero} from "@/entities/microphone-hero/ui/MicrophoneHero";
import {colors, spacing, typography} from "@/shared/styles";
import {BodyText, Heading} from "@/shared/ui/Typography";
import {Button} from "@/shared/ui/Button";
import {ArrowRightIcon} from "lucide-react-native";
import {GlowOrb} from "@/entities/blue-circle/ui/BlurCircle";

interface Props {
    onGetStarted: () => void;
}

export const HomePage: React.FC<Props> = ({ onGetStarted }) => (
    <SafeAreaView style={styles.safeArea}>
        <GlowOrb
            size={380}
            color={colors.accent}
            blur={80}
            opacity={0.1}
            style={{ top: -100, left: -100 }}
        />

        <GlowOrb
            size={380}
            color={colors.accent}
            blur={80}
            opacity={0.1}
            style={{ top: 300, left: 0 }}
        />

        <View style={styles.container}>
            <AppLogo />

            <View style={styles.heroSection}>
                <MicrophoneHero />
            </View>

            <View style={styles.copySection}>
                <Heading style={styles.headline}>
                    {'Speak. Transcribe.\nRemember.'}
                </Heading>

                <BodyText style={styles.subtext}>
                    Just hold to talk. Well handle the text and reminders.
                </BodyText>
            </View>

            <View style={styles.ctaSection}>
                <Button
                    label="Get Started"
                    onPress={onGetStarted}
                    size="lg"
                    rightIcon={<ArrowRightIcon color={colors.background} />}
                />
            </View>
        </View>
    </SafeAreaView>
);

const AppLogo: React.FC = () => (
    <View style={styles.logoRow}>
        <Text style={styles.logoText}>ToTalk</Text>
    </View>
);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        color: colors.textPrimary
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxxl,
        paddingBottom: spacing.xxl,
    },

    logoRow: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoText: {
        fontSize: typography.sizes.xxl,
        fontWeight: '700',
        color: colors.accent,
        letterSpacing: 0.3,
    },

    heroSection: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },

    copySection: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xxl,
        paddingVertical: spacing.md,
    },
    headline: {
        textAlign: 'center',
        fontSize: 35,
        fontWeight: 'bold',
        lineHeight: 45,
        color: colors.textPrimary,
    },
    subtext: {
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },

    ctaSection: {
        marginTop: spacing.sm,
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.xxxl,
    },
    ctaArrow: {
        color: colors.textPrimary,
        fontSize: typography.sizes.lg,
        fontWeight: '600',
    },
});
