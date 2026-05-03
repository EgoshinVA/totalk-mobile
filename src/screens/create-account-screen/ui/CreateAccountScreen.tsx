import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import {colors, spacing, typography} from "@/shared/styles";
import {StepProgress} from "@/features/step-progress/ui/StepProgress";
import {BodyText, Heading} from "@/shared/ui/Typography";
import {RegisterForm} from "@/features/auth/register/ui/RegisterForm";
import {GlowOrb} from "@/entities/blue-circle/ui/BlurCircle";

interface CreateAccountScreenProps {
    onNext: () => void;
    onLogIn: () => void;
    currentStep: number;
    totalSteps: number;
}

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
                                                                            onNext,
                                                                            onLogIn,
                                                                            currentStep,
                                                                            totalSteps,
                                                                        }) => (
    <SafeAreaView style={styles.safeArea}>
        <GlowOrb
            size={380}
            color={colors.accent}
            blur={80}
            opacity={0.1}
            style={{top: -100, left: -200}}
        />

        <GlowOrb
            size={380}
            color={colors.accent}
            blur={80}
            opacity={0.1}
            style={{top: 500, left: 100}}
        />

        <StatusBar barStyle="light-content" backgroundColor={colors.background}/>

        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <StepProgress current={currentStep} total={totalSteps}/>

                <View style={styles.headingSection}>
                    <Heading style={styles.heading}>Create Your Account</Heading>
                    <BodyText style={styles.subtitle}>Join the conversation today.</BodyText>
                </View>

                <RegisterForm onNext={onNext}/>

                <TouchableOpacity onPress={onLogIn} hitSlop={{top: 8, bottom: 8}} style={styles.loginRow}>
                    <Text style={styles.loginText}>
                        Already have an account?{' '}
                        <Text style={styles.loginLink}>Log in</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    safeArea: {flex: 1},
    flex: {flex: 1},
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
        gap: spacing.xl,
    },
    headingSection: {
        gap: spacing.xs,
        alignItems: 'center',
    },
    heading: {
        textAlign: 'center',
        fontSize: 30,
    },
    subtitle: {
        marginTop: 2,
        textAlign: 'center',
    },
    loginRow: {alignItems: 'center', marginTop: spacing.sm},
    loginText: {fontSize: typography.sizes.sm, color: colors.textSecondary},
    loginLink: {color: colors.accentDark, fontWeight: '600'},
});