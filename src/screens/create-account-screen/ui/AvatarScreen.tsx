import React, {useState} from 'react';
import {Alert, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Camera, GalleryHorizontal} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import {colors, spacing, typography} from '@/shared/styles';
import {StepProgress} from '@/features/step-progress/ui/StepProgress';
import {BodyText, Heading} from '@/shared/ui/Typography';
import {Button} from '@/shared/ui/Button';
import {GlowOrb} from '@/entities/blue-circle/ui/BlurCircle';

interface AvatarScreenProps {
    onFinish: (avatarUri?: string) => void;
    onBack: () => void;
    onSkip: () => void;
    currentStep: number;
    totalSteps: number;
    isLoading?: boolean;
}

export const AvatarScreen: React.FC<AvatarScreenProps> = ({
    onFinish,
    onBack,
    onSkip,
    currentStep,
    totalSteps,
    isLoading = false,
}) => {
    const [avatarUri, setAvatarUri] = useState<string | undefined>();

    const pickFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to your photo library.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) setAvatarUri(result.assets[0].uri);
    };

    const pickFromCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to your camera.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) setAvatarUri(result.assets[0].uri);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <GlowOrb size={380} color={colors.accent} blur={80} opacity={0.1} style={{ top: -100, left: -200 }} />
            <GlowOrb size={380} color={colors.accent} blur={80} opacity={0.1} style={{ top: 500, left: 100 }} />

            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <View style={styles.container}>
                <StepProgress current={currentStep} total={totalSteps} />

                <View style={styles.headingSection}>
                    <Heading style={styles.heading}>Add Your Profile Picture</Heading>
                    <BodyText style={styles.subtitle}>
                        Personalize your ToTalk profile so friends can recognize you.
                    </BodyText>
                </View>

                {/* ── Avatar preview ───────────────────────── */}
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarRing}>
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarPlaceholderIcon}>👤</Text>
                            </View>
                        )}
                    </View>

                    {/* Camera FAB */}
                    <TouchableOpacity style={styles.cameraFab} onPress={pickFromCamera}>
                        <Camera size={16} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* ── Source pickers ───────────────────────── */}
                <View style={styles.pickerRow}>
                    <TouchableOpacity style={styles.pickerCard} onPress={pickFromCamera}>
                        <Camera size={28} color={colors.textSecondary} />
                        <Text style={styles.pickerLabel}>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pickerCard} onPress={pickFromGallery}>
                        <GalleryHorizontal size={28} color={colors.textSecondary} />
                        <Text style={styles.pickerLabel}>Gallery</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Actions ──────────────────────────────── */}
                <View style={styles.actions}>
                    <View style={styles.bottomRow}>
                        <Button
                            label="Back"
                            onPress={onBack}
                            variant="secondary"
                            size="lg"
                            style={styles.backButton}
                            disabled={isLoading}
                        />
                        <Button
                            label="Finish"
                            onPress={() => onFinish(avatarUri)}
                            size="lg"
                            loading={isLoading}
                            style={styles.finishButton}
                        />
                    </View>

                    <TouchableOpacity onPress={onSkip} hitSlop={{ top: 8, bottom: 8 }} disabled={isLoading}>
                        <Text style={styles.skipText}>Skip for now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
        gap: spacing.xl,
    },
    headingSection: { gap: spacing.xs },
    heading: { textAlign: 'center', fontSize: 30 },
    subtitle: { textAlign: 'center', marginTop: 2 },

    // Avatar
    avatarWrapper: {
        alignSelf: 'center',
        position: 'relative',
    },
    avatarRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: colors.accent,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarPlaceholderIcon: {
        fontSize: 48,
        opacity: 0.4,
    },
    cameraFab: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },

    // Pickers
    pickerRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    pickerCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 14,
        paddingVertical: spacing.lg,
        alignItems: 'center',
        gap: spacing.sm,
    },
    pickerLabel: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
        fontWeight: '500',
    },

    // Actions
    actions: { gap: spacing.md, alignItems: 'center' },
    bottomRow: {
        flexDirection: 'row',
        gap: spacing.md,
        width: '100%',
    },
    backButton: { flex: 1 },
    finishButton: { flex: 1 },
    skipText: {
        fontSize: typography.sizes.sm,
        color: colors.textSecondary,
    },
});
