import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import { createWriteStream } from 'fs';
import { access } from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';
import { AUDIO_DIR } from '../constants/audio';
import { pipeline } from 'stream/promises';

const apiKey = process.env.ELEVENLABS_API_KEY;

const engVoiceId = "JBFqnCBsd6RMkjVDRZzb";
const ukrVoiceId = "2OXYbN1uGomXXJtv9Dq6";
const modelId = "eleven_v3_conversational";
const outputFormat = "mp3_44100_128";

async function generateUniqueAudioFilename(): Promise<string> {
    while (true) {
        const filename = `${crypto.randomUUID()}.mp3`;
        const filepath = path.join(AUDIO_DIR, filename);

        try {
            await access(filepath);
        } catch {
            return filename;
        }
    }
}

export default async function textToAudio(text: string, language: "en" | "uk"
) {
    const elevenlabs = new ElevenLabsClient({
        apiKey
    });

    const voiceId = language === "en" ? engVoiceId : ukrVoiceId;
    const audio = await elevenlabs.textToSpeech.convert(
    voiceId,
    {
        text,
        modelId,
        outputFormat
    }
    );

    const filename = await generateUniqueAudioFilename();
    const filepath = path.join(AUDIO_DIR, filename);

    const stream = Readable.fromWeb(audio as any);
    await pipeline(
        stream,
        createWriteStream(filepath),
    );

    return filename;
}