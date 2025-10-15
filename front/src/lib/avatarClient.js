// src/lib/avatarClient.js
// npm i @heygen/streaming-avatar
import StreamingAvatar, {
    AvatarQuality,
    StreamingEvents,
    TaskMode,
    TaskType,
    VoiceEmotion,
} from '@heygen/streaming-avatar';

/**
 * HeyGen 아바타를 "읽기 전용(SPEAK)" 모드로 시작하고,
 * sayText 로 넘긴 텍스트만 정확히 말하게 합니다.
 */
export async function createAvatar({
                                       videoEl,
                                       clientToken,
                                       avatarId,
                                       language = 'ko',
                                   }) {
    if (!videoEl) throw new Error('videoEl이 없습니다.');
    if (!clientToken) throw new Error('clientToken이 없습니다.');

    const avatar = new StreamingAvatar({ token: clientToken });

    // <video> 바인딩
    const handleReady = (evt) => {
        const media = evt?.detail;
        if (media && videoEl) {
            try {
                videoEl.srcObject = media;
                videoEl.onloadedmetadata = () => videoEl.play().catch(() => {});
            } catch (e) {
                console.warn('비디오 바인딩 실패:', e);
            }
        }
    };
    const handleDisconnected = () => {
        if (videoEl) videoEl.srcObject = null;
    };

    avatar.on(StreamingEvents.STREAM_READY, handleReady);
    avatar.on(StreamingEvents.STREAM_DISCONNECTED, handleDisconnected);

    // ★ 핵심: Voice-Chat이 아니라 "SPEAK" 모드로 고정
    await avatar.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: avatarId || 'default',
        language,
        // SDK 버전에 따라 taskMode / task_mode 중 하나만 먹을 수 있어 둘 다 전달(무해)
        taskMode: TaskMode?.SPEAK ?? 'SPEAK',
        task_mode: TaskMode?.SPEAK ?? 'SPEAK',
        voice: {
            rate: 1.0,
            emotion: VoiceEmotion?.EXCITED ?? 'EXCITED',
        },
    });

    // 아바타 재시작(아바타 교체 시 사용)
    const restart = async ({ newAvatarId, newLanguage = language }) => {
        try { await avatar.stopAvatar(); } catch {}
        await avatar.createStartAvatar({
            quality: AvatarQuality.High,
            avatarName: newAvatarId || 'default',
            language: newLanguage,
            taskMode: TaskMode?.SPEAK ?? 'SPEAK',
            task_mode: TaskMode?.SPEAK ?? 'SPEAK',
            voice: { rate: 1.0, emotion: VoiceEmotion?.EXCITED ?? 'EXCITED' },
        });
    };

    return {
        /** 우리가 준 문장만 정확히 읽음 (LLM 대화 X) */
        async sayText(text) {
            const t = String(text || '').trim();
            if (!t) return;
            // ★ TALK 대신 SPEAK로 지정해 "낭독"만 수행
            await avatar.speak({ text: t, task_type: TaskType?.SPEAK ?? 'SPEAK' });
        },

        /** 시각 아바타 교체(세션 재시작) */
        async restartAvatar(newAvatarId) {
            await restart({ newAvatarId });
        },

        /** 세션 종료 */
        async destroy() {
            try { await avatar.stopAvatar(); } catch {}
            avatar.off?.(StreamingEvents.STREAM_READY, handleReady);
            avatar.off?.(StreamingEvents.STREAM_DISCONNECTED, handleDisconnected);
            if (videoEl) videoEl.srcObject = null;
        },

        // 안전 no-op(메서드가 없어도 에러 방지)
        emotion() {},
        gesture() {},
    };
}

export function destroyAvatar(ctrl) {
    try { ctrl?.destroy?.(); } catch {}
}
