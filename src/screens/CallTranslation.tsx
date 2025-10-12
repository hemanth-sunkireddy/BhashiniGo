// CallScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from "react-native-agora";

const AGORA_APP_ID = "adac1c3d81f54c258d3089fda64c3641";
const TOKEN = "007eJxTYKg6li30V2VhqG3+o/SgL86zhEW+CCzbYNAgqpi1SPaccrsCg4mxhYVJsgUQWqaYJCabWphbGhgnp6WZGZqbp6RYpGn9fJXREMjIUPV8BgsjAwSC+FwMuanpiSUZ+XlGpgwMALA7IPY="; // temporary token
const CHANNEL_NAME = "megathon25";

const CallScreen = ({ navigation }: any) => {
  const [engine, setEngine] = useState<RtcEngine | null>(null);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const rtcEngine = await RtcEngine.create(AGORA_APP_ID);
      setEngine(rtcEngine);

      await rtcEngine.enableAudio();

      // Listen for remote user joining
      rtcEngine.addListener("UserJoined", (uid) => {
        console.log("Remote user joined:", uid);
        setRemoteUid(uid);
      });

      // Listen for remote user leaving
      rtcEngine.addListener("UserOffline", (uid) => {
        console.log("Remote user left:", uid);
        setRemoteUid(null);
      });

      await rtcEngine.joinChannel(TOKEN, CHANNEL_NAME, null, 0);
    };

    init();

    return () => {
      engine?.leaveChannel();
      engine?.destroy();
    };
  }, []);

  const endCall = () => {
    engine?.leaveChannel();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
  <Text style={styles.title}>Call Screen</Text>
  <Text>Connected to channel: {CHANNEL_NAME}</Text>
  {remoteUid && <Text>Remote User ID: {remoteUid}</Text>}

  <TouchableOpacity style={styles.endButton} onPress={endCall}>
    <Text style={{ color: "#fff", fontWeight: "bold" }}>End Call</Text>
  </TouchableOpacity>
</View>

  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, marginBottom: 20 },
  videoContainer: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center" },
  localVideo: { width: 100, height: 150, position: "absolute", top: 10, left: 10 },
  remoteVideo: { width: "100%", height: "100%" },
  endButton: { backgroundColor: "red", padding: 15, borderRadius: 50, marginBottom: 30 },
});
