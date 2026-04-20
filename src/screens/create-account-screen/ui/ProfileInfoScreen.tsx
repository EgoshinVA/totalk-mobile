import React, { useState } from 'react';
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
import { User, MapPin, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react-native';
import { colors, spacing, typography } from '@/shared/styles';
import { StepProgress } from '@/features/step-progress/ui/StepProgress';
import { BodyText, Heading } from '@/shared/ui/Typography';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { GlowOrb } from '@/entities/blue-circle/ui/BlurCircle';

interface ProfileInfoScreenProps {
    onNext: (data: ProfileInfoData) => void;
    onBack: () => void;
    currentStep: number;
    totalSteps: number;
    isLoading?: boolean;
}

export interface ProfileInfoData {
    fullName: string;
    city: string;
}

export const ProfileInfoScreen: React.FC<ProfileInfoScreenProps> = ({
    onNext,
    onBack,
    currentStep,
    totalSteps,
    isLoading = false,
}) => {
    const [fullName, setFullName] = useState('');
    const [city, setCity] = useState('');
    const [errors, setErrors] = useState<{ fullName?: string }>({});

    const validate = (): boolean => {
        const next: typeof errors = {};
        if (!fullName.trim()) next.fullName = 'Full name is required';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext({ fullName: fullName.trim(), city: city.trim() });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <GlowOrb size={380} color={colors.accent} blur={80} opacity={0.1} style={{ top: -100, left: -200 }} />
            <GlowOrb size={380} color={colors.accent} blur={80} opacity={0.1} style={{ top: 500, left: 100 }} />

            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <StepProgress current={currentStep} total={totalSteps} />

                    <View style={styles.headingSection}>
                        <Heading style={styles.heading}>Tell Us About Yourself</Heading>
                        <BodyText style={styles.subtitle}>
                            Let&#39;s set up your profile so others can know who they&#39;re talking to.
                        </BodyText>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="e.g. Alex Morgan"
                            value={fullName}
                            onChangeText={t => { setFullName(t); setErrors(e => ({ ...e, fullName: undefined })); }}
                            error={errors.fullName}
                            leftIcon={<User size={18} color={colors.textMuted} />}
                            editable={!isLoading}
                        />

                        <Input
                            label="City"
                            placeholder="e.g. Seattle, WA"
                            value={city}
                            onChangeText={setCity}
                            leftIcon={<MapPin size={18} color={colors.textMuted} />}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.actions}>
                        <Button
                            label="Next"
                            onPress={handleNext}
                            size="lg"
                            loading={isLoading}
                            style={styles.nextButton}
                            rightIcon={<ArrowRightIcon size={18} color={colors.background} />}
                        />

                        <TouchableOpacity onPress={onBack} style={styles.backRow} hitSlop={{ top: 8, bottom: 8 }}>
                            <ArrowLeftIcon size={14} color={colors.textSecondary} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    flex: { flex: 1 },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
        gap: spacing.xl,
    },
    headingSection: { gap: spacing.xs },
    heading: { fontSize: 30 },
    subtitle: { marginTop: 2 },
    form: { gap: spacing.md },
    actions: { gap: spacing.md, alignItems: 'center' },
    nextButton: { width: '100%' },
    backRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    backText: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
    },
});
