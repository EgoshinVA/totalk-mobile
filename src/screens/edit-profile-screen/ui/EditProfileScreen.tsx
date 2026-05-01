import React, {useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ArrowLeft, Camera, User} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import {useSelector} from 'react-redux';
import {useRouter} from 'expo-router';

import {Input} from '@/shared/ui/Input';
import {Button} from '@/shared/ui/Button';
import {GlowOrb} from '@/entities/blue-circle/ui/BlurCircle';
import {colors, spacing, typography} from '@/shared/styles';
import {RootState} from '@/app/store';

export const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.session.user);

  const [name, setName] = useState(user?.name ?? '');
  const [surName, setSurName] = useState(user?.surName ?? '');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(user?.avatarURL ?? undefined);
  const [isSaving, setIsSaving] = useState(false);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission required', 'Allow photo library access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission required', 'Allow camera access.'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Validation', 'Name is required.'); return; }
    setIsSaving(true);
    try {
      // TODO: dispatch RTK Query mutation (updateProfile)
      await new Promise(r => setTimeout(r, 800)); // placeholder
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Choose source', [
      { text: 'Camera', onPress: pickFromCamera },
      { text: 'Gallery', onPress: pickFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <GlowOrb size={300} color={colors.accent} blur={80} opacity={0.08} style={{ top: -80, left: -100 }} />

      {/* ── Nav ──────────────────────────────────────────── */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Edit Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Avatar ───────────────────────────────────────── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.85}>
            <View style={styles.avatarRing}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <User size={40} color={colors.textMuted} />
              )}
            </View>
            <View style={styles.cameraFab}>
              <Camera size={14} color={colors.textPrimary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoLabel}>Change photo</Text>
        </View>

        {/* ── Form ─────────────────────────────────────────── */}
        <View style={styles.form}>
          <Input
            label="First Name"
            placeholder="e.g. Alex"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={18} color={colors.textMuted} />}
          />
          <Input
            label="Last Name"
            placeholder="e.g. Morgan"
            value={surName}
            onChangeText={setSurName}
            leftIcon={<User size={18} color={colors.textMuted} />}
          />
        </View>

        <Button
          label="Save Changes"
          onPress={handleSave}
          size="lg"
          loading={isSaving}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  navTitle: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  avatarSection: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.md },
  avatarRing: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2, borderColor: colors.accent,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  cameraFab: {
    position: 'absolute', bottom: 2, right: 2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background,
  },
  changePhotoLabel: { fontSize: typography.sizes.sm, color: colors.accent, fontWeight: '500' },
  form: { gap: spacing.md },
  saveButton: { width: '100%' },
});
