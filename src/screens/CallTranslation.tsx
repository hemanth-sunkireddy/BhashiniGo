import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from "react-native";
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
} from "react-native-agora";
import RNFS from "react-native-fs";
import Sound from "react-native-sound";
import { callCanvasAudioAPI } from "../components/ASR"; // your ASR function
import {  callCanvasTTSAPI } from "../components/TTS"; // your existing APIs
import {callCanvasAPI} from "../components/MT"

const APP_ID = "80d31fcd548a464facd4643903ad068b";
const CHANNEL_NAME = "voice_test";
const TOKEN = ""; // leave empty if token authentication is disabled
const UID = 0; // auto-assigned UID

const VoiceCall = () => {
  const [engine, setEngine] = useState<any>(null);
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);

  // 🔸 Ask for mic permission
  const requestPermission = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
    }
  };

  useEffect(() => {
    requestPermission();

    const agoraEngine = createAgoraRtcEngine();
    setEngine(agoraEngine);
    agoraEngine.initialize({ appId: APP_ID });
    agoraEngine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
    agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
    agoraEngine.enableAudioVolumeIndication(1000, 3, true);

    // ✅ Event handlers
    agoraEngine.registerEventHandler({
      onJoinChannelSuccess: (connection, elapsed) => {
        console.log("✅ Joined channel successfully:", connection);
        setJoined(true);
      },
      onUserJoined: (connection, uid, elapsed) => {
        console.log("🎧 Remote user joined:", uid);
        setRemoteUid(uid);
      },
      onUserOffline: (connection, uid, reason) => {
        console.log("❌ Remote user left:", uid);
        setRemoteUid(null);
      },
      onError: (err, msg) => {
        console.log("🚨 Agora error:", err, msg);
      },
    });

    return () => {
      agoraEngine.leaveChannel();
      agoraEngine.release();
    };
  }, []);

  // Join/Leave
  const joinChannel = () => {
    if (!engine) return;
    engine.enableAudio();
    engine.setDefaultAudioRouteToSpeakerphone(true);
    engine.joinChannel(TOKEN, CHANNEL_NAME, UID, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });

    // 🔁 Start periodic translation every 3 seconds
    startPeriodicTranslation();
  };

  const leaveChannel = () => {
    if (!engine) return;
    engine.leaveChannel();
    setJoined(false);
    setRemoteUid(null);
    stopPeriodicTranslation();
  };

  // -----------------------
  // 🎧 Audio Translation Loop
  // -----------------------

  let translationTimer: ReturnType<typeof setInterval> | null = null;

  const startPeriodicTranslation = () => {
    if (translationTimer) return;
    translationTimer = setInterval(async () => {
      try {
        console.log("🎤 Capturing 3s audio chunk...");

        // 🟢 1️⃣ Record short audio chunk (simulate or integrate with Agora audio frame)
        const filePath = `${RNFS.DocumentDirectoryPath}/chunk_${Date.now()}.wav`;
        // For now, assume you already have a short WAV captured via another recorder or engine
        // In real use, you’d write the PCM buffer here

        // 🟢 2️⃣ Send to ASR (English speech → text)
        const asrResponse = await callCanvasAudioAPI(filePath, "en");
        const recognizedText = asrResponse?.data?.recognized_text?.trim();

        if (!recognizedText) {
          console.log("⚠️ No speech recognized.");
          return;
        }

        console.log("🗣️ Recognized:", recognizedText);

        // 🟢 3️⃣ Translate English → Hindi
        const translationResponse = await callCanvasAPI(
          recognizedText,
          "en",
          "hi"
        );
        const translatedText =
          translationResponse?.data?.output_text || "नमस्ते, आप कैसे हैं?";
        console.log("🌍 Translated:", translatedText);

        // 🟢 4️⃣ Convert translated Hindi → Speech
        const ttsResponse = await callCanvasTTSAPI(
          translatedText,
          "male",
          "hi"
        );
        const audioUrl = ttsResponse?.data?.s3_url;

        // 🟢 5️⃣ Play translated audio
        if (audioUrl) await playAudioFromUrl(audioUrl);
      } catch (err) {
        console.error("🚨 Translation chain error:", err);
      }
    }, 3000);
  };

  const stopPeriodicTranslation = () => {
    if (translationTimer) {
      clearInterval(translationTimer);
      translationTimer = null;
    }
  };

  // 🔊 Play translated speech
  const playAudioFromUrl = async (url: string) => {
    return new Promise<void>((resolve, reject) => {
      const sound = new Sound(url, null, (error) => {
        if (error) {
          console.error("Error loading TTS audio:", error);
          reject(error);
          return;
        }
        sound.play(() => {
          sound.release();
          resolve();
        });
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agora Voice Call + Live Translation</Text>
      <Text style={styles.info}>
        {joined
          ? remoteUid
            ? `Connected to UID: ${remoteUid}`
            : "Waiting for remote user..."
          : "Not joined"}
      </Text>

      {!joined ? (
        <Button title="Join Channel" onPress={joinChannel} />
      ) : (
        <Button title="Leave Channel" color="red" onPress={leaveChannel} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  info: { marginBottom: 20 },
});

export default VoiceCall;
