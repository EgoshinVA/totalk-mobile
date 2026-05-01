import { Stack } from 'expo-router';

export default function DashboardLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="language" />
            <Stack.Screen name="privacy-policy" />
        </Stack>
    );
}