import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, PermissionsAndroid, Platform, StyleSheet, Text, Vibration, View } from 'react-native';
import { Mic } from 'lucide-react-native';
import { colors } from '@/shared/styles';
import { GlowOrb } from '@/entities/blue-circle/ui/BlurCircle';
import { useDispatch, useSelector } from 'react-redux';
import { tasksApi } from '@/entities/tasks/api/tasksApi';
import LiveAudioStream from 'react-native-live-audio-stream';
import { Task } from '@/entities/tasks/model/types';
import { RootState } from '@/app/store';
import { requestNotificationPermission, scheduleTaskNotification } from '@/shared/notifications/notificationService';

type WSMessage =
    | { type: 'task_created'; payload: Task }
    | { type: 'error'; payload: { message: string } };

type RecordState = 'idle' | 'recording' | 'processing' | 'no_permission';

interface Props {
    size?: number;
}

// Запрашиваем разрешение и инитим AudioStream один раз глобально
let audioInitialized = false;

async function ensureAudioPermissionAndInit(): Promise<boolean> {
    if (audioInitialized) return true;

    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: 'Разрешение на микрофон',
                message: 'ToTalk нужен доступ к микрофону для создания задач голосом.',
                buttonPositive: 'ОК',
                buttonNegative: 'Отмена',
            }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return false;
    }

    // Инитим ПОСЛЕ получения разрешения
    LiveAudioStream.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 6,
        bufferSize: 8192,
        wavFile: '',
    });

    audioInitialized = true;
    return true;
}

export const RecordButton: React.FC<Props> = ({ size = 88 }) => {
    const dispatch = useDispatch();
    const socket = useRef<WebSocket | null>(null);
    const pulse = useRef(new Animated.Value(1)).current;
    const recordingAnim = useRef(new Animated.Value(1)).current;
    const [state, setState] = useState<RecordState>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const ORB_SIZE = 150;

    const messageReceived = useRef(false);
    const isProcessingRef = useRef(false);
    const startStreamingRef = useRef<() => void>(() => {});
    const stopStreamingRef = useRef<() => void>(() => {});

    const accessToken = useSelector((s: RootState) => s.session.accessToken);
    const reminderOffset = useSelector((s: RootState) => s.settings.reminderOffset);

    const isRecording = state === 'recording';
    const isProcessing = state === 'processing';

    // Запрашиваем разрешение и инитим при монтировании
    useEffect(() => {
        ensureAudioPermissionAndInit().then(ok => {
            if (!ok) setState('no_permission');
        });

        return () => {
            try { LiveAudioStream.stop(); } catch {}
        };
    }, []);

    useEffect(() => {
        isProcessingRef.current = isProcessing;
    }, [isProcessing]);

    // Idle пульс
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.12, duration: 1400, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const startRecordingAnim = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(recordingAnim, { toValue: 1.25, duration: 400, useNativeDriver: true }),
                Animated.timing(recordingAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            ])
        ).start();
    };

    const stopRecordingAnim = () => {
        recordingAnim.stopAnimation();
        recordingAnim.setValue(1);
    };

    const stopStreaming = useCallback(() => {
        try { LiveAudioStream.stop(); } catch (e) { console.warn('stop error:', e); }
        stopRecordingAnim();
        setState('processing');
        if (socket.current?.readyState === WebSocket.OPEN) {
            socket.current.send('END_OF_STREAM');
        }
    }, []);

    const startStreaming = useCallback(async () => {
        if (state === 'no_permission') {
            setErrorMsg('Нет разрешения на микрофон');
            return;
        }

        // Убеждаемся что инит прошёл
        const ok = await ensureAudioPermissionAndInit();
        if (!ok) {
            setState('no_permission');
            setErrorMsg('Нет разрешения на микрофон');
            return;
        }

        setErrorMsg(null);
        setState('recording');
        Vibration.vibrate(40);
        startRecordingAnim();
        messageReceived.current = false;

        // Подписываемся на данные перед коннектом
        LiveAudioStream.on('data', (data: string) => {
            if (socket.current?.readyState === WebSocket.OPEN) {
                socket.current.send(data);
            }
        });

        socket.current = new WebSocket(
            `ws://192.168.31.88:8080/api/v1/ws/audio?token=${accessToken}`
        );

        socket.current.onopen = () => {
            LiveAudioStream.start();
        };

        socket.current.onmessage = async (event) => {
            messageReceived.current = true;
            try {
                const msg: WSMessage = JSON.parse(event.data);
                if (msg.type === 'task_created') {
                    Vibration.vibrate([0, 40, 60, 40]);
                    dispatch(tasksApi.util.invalidateTags(['Task']));
                    if (reminderOffset !== null && msg.payload.scheduledAt) {
                        const granted = await requestNotificationPermission();
                        if (granted) await scheduleTaskNotification(msg.payload, reminderOffset);
                    }
                    setState('idle');
                    setErrorMsg(null);
                } else if (msg.type === 'error') {
                    setErrorMsg(msg.payload.message);
                    setState('idle');
                }
            } catch {
                setErrorMsg('Ошибка обработки ответа');
                setState('idle');
            }
        };

        socket.current.onerror = () => {
            if (messageReceived.current) return;
            setState('idle');
            setErrorMsg('Ошибка соединения');
        };

        socket.current.onclose = () => {
            if (messageReceived.current) return;
            setState(prev => {
                if (prev === 'processing') {
                    setErrorMsg('Соединение прервано');
                    return 'idle';
                }
                return prev;
            });
        };
    }, [accessToken, reminderOffset, state]);

    useEffect(() => {
        startStreamingRef.current = startStreaming;
        stopStreamingRef.current = stopStreaming;
    }, [startStreaming, stopStreaming]);

    const buttonPan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                if (!isProcessingRef.current) startStreamingRef.current();
            },
            onPanResponderRelease: () => {
                if (!isProcessingRef.current) stopStreamingRef.current();
            },
            onPanResponderTerminate: () => {
                if (!isProcessingRef.current) stopStreamingRef.current();
            },
        })
    ).current;

    const scale = isRecording ? recordingAnim : pulse;
    const hint = state === 'no_permission'
        ? 'Нет доступа к микрофону'
        : isRecording ? 'Слушаю...'
            : isProcessing ? 'Обрабатываю...'
                : 'Удержи для записи';

    return (
        <View style={{ alignItems: 'center', gap: 16 }}>
            {errorMsg && (
                <View style={styles.errorBubble}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            )}

            <Text style={styles.hint}>{hint}</Text>

            <Animated.View style={{
                transform: [{ scale }],
                width: ORB_SIZE,
                height: ORB_SIZE,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <GlowOrb
                    size={ORB_SIZE}
                    color={isRecording ? '#FF4444' : colors.accent}
                    blur={80}
                    opacity={isRecording ? 0.5 : 0.35}
                    style={StyleSheet.absoluteFillObject}
                />
                <Animated.View
                    {...buttonPan.panHandlers}
                    style={[
                        styles.button,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            borderColor: isRecording ? '#FF4444' : colors.accent,
                            opacity: (isProcessing || state === 'no_permission') ? 0.5 : 1,
                        },
                    ]}
                >
                    <Mic
                        size={size * 0.2}
                        color={isRecording ? '#FF4444' : colors.accent}
                        strokeWidth={2}
                    />
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.recordColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 18,
        elevation: 12,
    },
    hint: {
        fontSize: 13,
        color: colors.textMuted,
        letterSpacing: 0.3,
    },
    errorBubble: {
        backgroundColor: 'rgba(255,68,68,0.12)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,68,68,0.3)',
        maxWidth: 280,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 13,
        textAlign: 'center',
    },
});