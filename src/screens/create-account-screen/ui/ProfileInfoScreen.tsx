import React, {useState} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {ArrowLeftIcon, ArrowRightIcon, User, UserCircle, Users} from 'lucide-react-native';
import {colors, spacing, typography} from '@/shared/styles';
import {StepProgress} from '@/features/step-progress/ui/StepProgress';
import {BodyText, Heading} from '@/shared/ui/Typography';
import {Input} from '@/shared/ui/Input';
import {Button} from '@/shared/ui/Button';
import {GlowOrb} from '@/entities/blue-circle/ui/BlurCircle';
import {ProfileInfoData, validateProfileInfo} from "@/screens/create-account-screen/lib/.schema";

interface ProfileInfoScreenProps {
    onNext: (data: ProfileInfoData) => void;
    onBack: () => void;
    currentStep: number;
    totalSteps: number;
    isLoading?: boolean;
}

export const ProfileInfoScreen: React.FC<ProfileInfoScreenProps> = ({
                                                                        onNext,
                                                                        onBack,
                                                                        currentStep,
                                                                        totalSteps,
                                                                        isLoading = false,
                                                                    }) => {
    const [name, setName] = useState('');
    const [surName, setSurName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNext = () => {
        const data = {
            name: name.trim(),
            surName: surName.trim(),
            patronymic: patronymic.trim(),
        };

        const result = validateProfileInfo(data);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                if (!fieldErrors[field]) {
                    fieldErrors[field] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        onNext(result.data);
    };

    const clearError = (field: string) => {
        setErrors((prev) => {
            const next = {...prev};
            delete next[field];
            return next;
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <GlowOrb size={380} color={colors.accent} blur={80} opacity={0.1} style={{top: -100, left: -200}}/>
            <GlowOrb size={380} color={colors.accent} blur={80} opacity={0.1} style={{top: 500, left: 100}}/>

            <StatusBar barStyle="light-content" backgroundColor={colors.background}/>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <StepProgress current={currentStep} total={totalSteps}/>

                    <View style={styles.headingSection}>
                        <Heading style={styles.heading}>Tell Us About Yourself</Heading>
                        <BodyText style={styles.subtitle}>
                            Let&#39;s set up your profile so others can know who they&#39;re talking to.
                        </BodyText>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Name"
                            placeholder="e.g. Alex"
                            value={name}
                            onChangeText={(t) => {
                                setName(t);
                                clearError('name');
                            }}
                            error={errors.name}
                            leftIcon={<User size={18} color={colors.textMuted}/>}
                            editable={!isLoading}
                            autoCapitalize="words"
                        />

                        <Input
                            label="Surname"
                            placeholder="e.g. Morgan"
                            value={surName}
                            onChangeText={(t) => {
                                setSurName(t);
                                clearError('surName');
                            }}
                            error={errors.surName}
                            leftIcon={<Users size={18} color={colors.textMuted}/>}
                            editable={!isLoading}
                            autoCapitalize="words"
                        />

                        <Input
                            label="Patronymic (optional)"
                            placeholder="e.g. Ivanovich"
                            value={patronymic}
                            onChangeText={(t) => {
                                setPatronymic(t);
                                clearError('patronymic');
                            }}
                            error={errors.patronymic}
                            leftIcon={<UserCircle size={18} color={colors.textMuted}/>}
                            editable={!isLoading}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.actions}>
                        <Button
                            label="Next"
                            onPress={handleNext}
                            size="lg"
                            loading={isLoading}
                            style={styles.nextButton}
                            rightIcon={<ArrowRightIcon size={18} color={colors.background}/>}
                        />

                        <TouchableOpacity onPress={onBack} style={styles.backRow} hitSlop={{top: 8, bottom: 8}}>
                            <ArrowLeftIcon size={14} color={colors.textSecondary}/>
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

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
    headingSection: {gap: spacing.xs},
    heading: {fontSize: 30},
    subtitle: {marginTop: 2},
    form: {gap: spacing.md},
    actions: {gap: spacing.md, alignItems: 'center'},
    nextButton: {width: '100%'},
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