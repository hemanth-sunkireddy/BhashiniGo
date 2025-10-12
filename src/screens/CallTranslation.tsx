import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  PermissionsAndroid, 
  Alert 
} from "react-native";
import RtcEngine, { ChannelProfile, ClientRole } from "react-native-agora";

const AGORA_APP_ID = "adac1c3d81f54c258d3089fda64c3641";
const TOKEN = "007eJxTYKg6li30V2VhqG3+o/SgL86zhEW+CCzbYNAgqpi1SPaccrsCg4mxhYVJsgUQWqaYJCabWphbGhgnp6WZGZqbp6RYpGn9fJXREMjIUPV8BgsjAwSC+FwMuanpiSUZ+XlGpgwMALA7IPY=";
const CHANNEL_NAME = "megathon25";

const CallScreen = ({ navigation }: any) => {
  const [engine, setEngine] = useState<RtcEngine | null>(null);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);

  // Request microphone permission (Android)
  const requestAudioPermission = async () => {
    if (Platform.OS === "android") {
      console.log("[PERMISSION] Requesting microphone permission...");
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "App needs access to your microphone for voice call",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("[PERMISSION] Microphone permission denied");
          Alert.alert("Permission Denied", "Cannot start call without microphone permission");
          return false;
        } else {
          console.log("[PERMISSION] Microphone permission granted ✅");
        }
      } catch (err) {
        console.warn("[PERMISSION] Error requesting permission:", err);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const init = async () => {
      console.log("[INIT] Starting Agora initialization...");
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        console.log("[INIT] Initialization aborted — no permission.");
        return;
      }

      try {
        console.log("[INIT] Creating Agora engine...");
        const rtcEngine = await RtcEngine.create(AGORA_APP_ID);
        setEngine(rtcEngine);
        console.log("[INIT] Agora engine created successfully ✅");

        console.log("[INIT] Setting channel profile to Communication...");
        await rtcEngine.setChannelProfile(ChannelProfile.Communication);

        console.log("[INIT] Setting client role to Broadcaster...");
        await rtcEngine.setClientRole(ClientRole.Broadcaster);

        console.log("[INIT] Enabling audio...");
        await rtcEngine.enableAudio();

        console.log("[INIT] Starting local audio capture...");
        await rtcEngine.startPreview();

        // --- Agora event listeners ---
        console.log("[LISTENER] Adding Agora event listeners...");

        rtcEngine.addListener("JoinChannelSuccess", (channel, uid, elapsed) => {
          console.log(`[EVENT] Joined channel: ${channel} | UID: ${uid} | Elapsed: ${elapsed}ms ✅`);
        });

        rtcEngine.addListener("UserJoined", (uid) => {
          console.log(`[EVENT] Remote user joined: UID = ${uid} 🎧`);
          setRemoteUid(uid);
        });

        rtcEngine.addListener("UserOffline", (uid, reason) => {
          console.log(`[EVENT] Remote user left: UID = ${uid}, Reason = ${reason} ❌`);
          setRemoteUid(null);
        });

        rtcEngine.addListener("LeaveChannel", (stats) => {
          console.log(`[EVENT] Local user left channel. Duration: ${stats.duration}s, Total Users: ${stats.userCount}`);
        });

        rtcEngine.addListener("Error", (err) => {
          console.log(`[ERROR] Agora SDK Error: ${err}`);
        });

        rtcEngine.addListener("Warning", (warn) => {
          console.log(`[WARNING] Agora SDK Warning: ${warn}`);
        });

        // --- Join channel ---
        console.log(`[JOIN] Joining channel: ${CHANNEL_NAME} with token...`);
        await rtcEngine.joinChannel(TOKEN, CHANNEL_NAME, null, 0);
        console.log("[JOIN] Channel join request sent ✅");

      } catch (err) {
        console.error("[INIT ERROR] Error initializing Agora:", err);
      }
    };

    init();

    return () => {
      console.log("[CLEANUP] Leaving channel and destroying engine...");
      engine?.leaveChannel().then(() => console.log("[CLEANUP] Left channel ✅"));
      engine?.destroy().then(() => console.log("[CLEANUP] Engine destroyed ✅"));
    };
  }, []);

  const endCall = async () => {
    console.log("[ACTION] End call pressed.");
    await engine?.leaveChannel();
    await engine?.destroy();
    console.log("[ACTION] Call ended. Navigating back.");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Call</Text>
      <Text>Connected to channel: {CHANNEL_NAME}</Text>
      {remoteUid ? (
        <Text>Remote User ID: {remoteUid}</Text>
      ) : (
        <Text>Waiting for remote user...</Text>
      )}
      <TouchableOpacity style={styles.endButton} onPress={endCall}>
        <Text style={styles.endButtonText}>End Call</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, marginBottom: 20 },
  endButton: { backgroundColor: "red", padding: 15, borderRadius: 50, marginTop: 30 },
  endButtonText: { color: "#fff", fontWeight: "bold" },
});
