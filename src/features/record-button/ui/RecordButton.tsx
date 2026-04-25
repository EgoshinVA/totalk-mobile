import React, { useCallback, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, Vibration } from 'react-native';
import { Mic } from 'lucide-react-native';
import { colors } from '@/shared/styles';
import { GlowOrb } from '@/entities/blue-circle/ui/BlurCircle';
import {useDispatch, useSelector} from 'react-redux';
import { tasksApi } from '@/entities/tasks/api/tasksApi';
import LiveAudioStream from 'react-native-live-audio-stream';
import {Task} from "@/entities/tasks/model/types";
import {RootState} from "@/app/store";

type WSMessage =
    | { type: 'task_created'; payload: Task }
    | { type: 'error'; payload: { message: string } };

interface Props {
    size?: number;
}

type RecordState = 'idle' | 'recording' | 'processing';

export const RecordButton: React.FC<Props> = ({ size = 88 }) => {
    const dispatch = useDispatch();
    const socket = useRef<WebSocket | null>(null);
    const pulse = useRef(new Animated.Value(1)).current;
    const recordingAnim = useRef(new Animated.Value(1)).current;
    const [state, setState] = useState<RecordState>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const ORB_SIZE = 150;

    const messageReceived = useRef(false);

    const accessToken = useSelector((state: RootState) => state.session.accessToken);

    // Пульс в idle
    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.12, duration: 1400, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    // Пульс при записи — быстрый
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

    const startStreaming = useCallback(async () => {
        setErrorMsg(null);
        setState('recording');
        Vibration.vibrate(40); // короткий тактильный отклик
        startRecordingAnim();

        socket.current = new WebSocket(`ws://192.168.31.88:8080/api/v1/ws/audio?token=${accessToken}`);

        // В startStreaming, перед new WebSocket:
        messageReceived.current = false;

        socket.current.onmessage = (event) => {
            console.log('WS message received:', event.data);
            messageReceived.current = true; // помечаем что ответ получен
            try {
                const msg: WSMessage = JSON.parse(event.data);
                if (msg.type === 'task_created') {
                    Vibration.vibrate([0, 40, 60, 40]);
                    dispatch(tasksApi.util.invalidateTags(['Task']));
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
            // Игнорируем ошибку если уже получили ответ
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

        socket.current.onopen = () => {
            LiveAudioStream.init({
                sampleRate: 16000,
                channels: 1,
                bitsPerSample: 16,
                audioSource: 6,
                bufferSize: 4096,
                wavFile: '',
            });
            LiveAudioStream.on('data', (data) => {
                if (socket.current?.readyState === WebSocket.OPEN) {
                    socket.current.send(data);
                }
            });
            LiveAudioStream.start();
        };
    }, []);

    const stopStreaming = useCallback(() => {
        LiveAudioStream.stop();
        stopRecordingAnim();
        setState('processing');

        if (socket.current?.readyState === WebSocket.OPEN) {
            socket.current.send('END_OF_STREAM');
        }
    }, []);

    const isRecording = state === 'recording';
    const isProcessing = state === 'processing';
    const scale = isRecording ? recordingAnim : pulse;

    return (
        <View style={{ alignItems: 'center', gap: 16 }}>
            {/* Сообщение об ошибке */}
            {errorMsg && (
                <View style={styles.errorBubble}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            )}

            {/* Подсказка состояния */}
            <Text style={styles.hint}>
                {isRecording ? 'Слушаю...' : isProcessing ? 'Обрабатываю...' : 'Удержи для записи'}
            </Text>

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
                <Pressable
                    onPressIn={startStreaming}
                    onPressOut={stopStreaming}
                    disabled={isProcessing}
                    style={[
                        styles.button,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            borderColor: isRecording ? '#FF4444' : colors.accent,
                            opacity: isProcessing ? 0.5 : 1,
                        },
                    ]}
                >
                    <Mic size={size * 0.2} color={isRecording ? '#FF4444' : colors.accent} strokeWidth={2} />
                </Pressable>
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