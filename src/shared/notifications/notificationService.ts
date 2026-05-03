import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/entities/tasks/model/types';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

const STORAGE_KEY = 'notification_ids'; // { taskId: notificationId }

async function getStoredIds(): Promise<Record<number, string>> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

async function saveStoredIds(ids: Record<number, string>) {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
}

export async function requestNotificationPermission(): Promise<boolean> {
    if (!Device.isDevice) return false;
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function scheduleTaskNotification(
    task: Task,
    minutesBefore: number
): Promise<string | null> {
    if (!task.scheduledAt) return null;

    const scheduledAt = new Date(task.scheduledAt);
    const notifyAt = new Date(scheduledAt.getTime() - minutesBefore * 60 * 1000);
    if (notifyAt <= new Date()) return null;

    // Отменяем старое уведомление для этой задачи если было
    const ids = await getStoredIds();
    if (ids[task.id]) {
        try {
            await Notifications.cancelScheduledNotificationAsync(ids[task.id]);
        } catch {}
    }

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: task.title,
            body: minutesBefore === 0
                ? 'Время выполнить задачу!'
                : `Напоминание за ${minutesBefore} мин`,
            data: { taskId: task.id },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: notifyAt,
        },
    });

    // Сохраняем новый ID
    ids[task.id] = id;
    await saveStoredIds(ids);

    return id;
}

export async function cancelTaskNotification(taskId: number) {
    const ids = await getStoredIds();
    if (ids[taskId]) {
        try {
            await Notifications.cancelScheduledNotificationAsync(ids[taskId]);
        } catch {}
        delete ids[taskId];
        await saveStoredIds(ids);
    }
}

// Вызывать при смене reminderOffset в настройках
export async function rescheduleAllNotifications(
    tasks: Task[],
    minutesBefore: number | null
) {
    // Отменяем все текущие
    await Notifications.cancelAllScheduledNotificationsAsync();
    await saveStoredIds({});

    if (minutesBefore === null) return; // "не напоминать"

    const now = new Date();
    const newIds: Record<number, string> = {};

    for (const task of tasks) {
        if (!task.scheduledAt || task.status !== 'pending') continue;

        const scheduledAt = new Date(task.scheduledAt);
        const notifyAt = new Date(scheduledAt.getTime() - minutesBefore * 60 * 1000);
        if (notifyAt <= now) continue;

        try {
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: task.title,
                    body: minutesBefore === 0
                        ? 'Время выполнить задачу!'
                        : `Напоминание за ${minutesBefore} мин`,
                    data: { taskId: task.id },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: notifyAt,
                },
            });
            newIds[task.id] = id;
        } catch {}
    }

    await saveStoredIds(newIds);
}