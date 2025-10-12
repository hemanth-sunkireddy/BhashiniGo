import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import {
  VoiceProcessor,
  VoiceProcessorError,
} from "@picovoice/react-native-voice-processor";
import RNFS from "react-native-fs";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";
import { callCanvasAudioAPI } from "./ASR";

interface VoiceRecorderProps {
  sourceLang: string;
  onResult?: (recognizedText: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ sourceLang, onResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const voiceProcessor = VoiceProcessor.instance;
  const audioDataRef = useRef<number[]>([]);
  const processingRef = useRef(false);

  const SAMPLE_RATE = 16000;
  const CHANNELS = 1;
  const BITS_PER_SAMPLE = 16;
  const CHUNK_DURATION = 3; // seconds

  // -----------------------
  // Setup frame listener
  // -----------------------
  useEffect(() => {
    const onFrame = (frame: number[]) => {
      audioDataRef.current.push(...frame);
    };

    const onError = (error: VoiceProcessorError) => {
      console.error("VoiceProcessor Error:", error);
      Alert.alert("Error", error.toString());
    };

    voiceProcessor.addFrameListener(onFrame);
    voiceProcessor.addErrorListener(onError);

    return () => {
      (async () => {
        try {
          await voiceProcessor.stop();
        } catch (e) {
          console.error("Stop error:", e);
        }
      })();
    };
  }, []);

  // -----------------------
  // Periodic chunk processing (every 3 seconds)
  // -----------------------
useEffect(() => {
  let interval: ReturnType<typeof setInterval> | undefined;
  if (isRecording) {
    interval = setInterval(() => {
      processChunk();
    }, CHUNK_DURATION * 1000);
  }
  return () => {
    if (interval) clearInterval(interval);
  };
}, [isRecording]);


  const processChunk = async () => {
  if (audioDataRef.current.length < SAMPLE_RATE * CHUNK_DURATION) return;

  try {
    // Extract chunk (don’t block)
    const chunkSamples = audioDataRef.current.splice(0, SAMPLE_RATE * CHUNK_DURATION);
    const filePath = await writeWavFile(chunkSamples);

    // Send file to ASR — fire-and-forget
    (async () => {
      try {
        const response = await callCanvasAudioAPI(filePath, sourceLang);
        const recognizedText = response?.data?.recognized_text;
        if (recognizedText && onResult) {
          console.log("🎤 Partial Recognized Text:", recognizedText);
          onResult(recognizedText);
        }
      } catch (error) {
        console.error("ASR error:", error);
      }
    })();
  } catch (err) {
    console.error("Chunk processing error:", err);
  }
};

  // -----------------------
  // Request microphone permission
  // -----------------------
  const requestMicPermission = async (): Promise<boolean> => {
    try {
      const permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
      const result = await check(permission);

      if (result === RESULTS.GRANTED) return true;

      if (result === RESULTS.DENIED) {
        const reqResult = await request(permission);
        return reqResult === RESULTS.GRANTED;
      }

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          "Permission Permanently Denied",
          "Please enable microphone permission manually in Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openSettings() },
          ]
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error("Permission request error:", error);
      return false;
    }
  };

  // -----------------------
  // Convert audio samples to WAV
  // -----------------------
  const writeWavFile = async (samples: number[]) => {
    const filePath = `${RNFS.DocumentDirectoryPath}/chunk_${Date.now()}.wav`;
    const numSamples = samples.length;
    const byteRate = (SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE) / 8;
    const blockAlign = (CHANNELS * BITS_PER_SAMPLE) / 8;
    const dataSize = numSamples * (BITS_PER_SAMPLE / 8);
    const headerSize = 44;
    const totalSize = headerSize + dataSize;

    let wav = "";
    wav += "RIFF";
    wav += toLittleEndian(totalSize - 8, 4);
    wav += "WAVE";
    wav += "fmt ";
    wav += toLittleEndian(16, 4);
    wav += toLittleEndian(1, 2);
    wav += toLittleEndian(CHANNELS, 2);
    wav += toLittleEndian(SAMPLE_RATE, 4);
    wav += toLittleEndian(byteRate, 4);
    wav += toLittleEndian(blockAlign, 2);
    wav += toLittleEndian(BITS_PER_SAMPLE, 2);
    wav += "data";
    wav += toLittleEndian(dataSize, 4);

    for (let i = 0; i < numSamples; i++) {
      const s = Math.max(-1, Math.min(1, samples[i] / 32768));
      const val = s < 0 ? s * 0x8000 : s * 0x7fff;
      wav += toLittleEndian(Math.round(val), 2);
    }

    await RNFS.writeFile(filePath, wav, "ascii");
    return filePath;
  };

  const toLittleEndian = (value: number, bytes: number) => {
    let str = "";
    for (let i = 0; i < bytes; i++) {
      str += String.fromCharCode(value & 0xff);
      value >>= 8;
    }
    return str;
  };

  // -----------------------
  // Handle record start/stop
  // -----------------------
  const handleToggleRecording = async () => {
    const frameLength = 512;

    try {
      if (isRecording) {
        await voiceProcessor.stop();
        setIsRecording(false);
        audioDataRef.current = [];
      } else {
        const hasPermission = await requestMicPermission();
        if (!hasPermission) return;

        audioDataRef.current = [];
        await voiceProcessor.start(frameLength, SAMPLE_RATE);
        setIsRecording(true);
      }
    } catch (e) {
      console.error("Recording error:", e);
      Alert.alert("Error", "Unable to start or stop recording.");
    }
  };

    return (
        <TouchableOpacity
            onPress={handleToggleRecording}
            style={{
                backgroundColor: isRecording ? "red" : "#007BFF",
                padding: 14,
                borderRadius: 8,
                alignSelf: "center",
            }}
        >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                {isRecording ? "🛑 Stop Recording" : "🎤 Tap and Speak"}
            </Text>
        </TouchableOpacity>
    );
};

export default VoiceRecorder;
