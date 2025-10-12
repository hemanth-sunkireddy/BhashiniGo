// import React, { useEffect, useState } from "react";
// import { View, Text, Button, StyleSheet, PermissionsAndroid, Platform, Alert } from "react-native";
// import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from "react-native-agora";
// import RNFS from "react-native-fs";

// const APP_ID = "80d31fcd548a464facd4643903ad068b";
// const CHANNEL_NAME = "voice_test";
// const TOKEN = ""; // Leave empty if token authentication is disabled on your Agora project
// const UID = 0; // Auto-assigned UID


// import Sound from "react-native-sound";

// export const playAudioFromUrl = async (filePath) => {
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 5000));
//     const exists = await RNFS.exists(filePath);
//     if (!exists) {
//       console.error("❌ File not found:", filePath);
//       Alert.alert("Error", "Recording file not found.");
//       return;
//     }

//     // ✅ Prefix with "file://" for Android local file playback
//     const localFile = `file://${filePath}`;

//     const sound = new Sound(localFile, Sound.MAIN_BUNDLE, (error) => {
//       if (error) {
//         console.error("🔴 Failed to load sound:", error);
//         Alert.alert("Playback Error", "Failed to load recorded audio.");
//         return;
//       }
//       console.log("✅ Loaded sound successfully, playing now...");
//       sound.play((success) => {
//         if (success) console.log("✅ Audio played successfully");
//         else console.error("🔴 Playback failed");
//         sound.release();
//       });
//     });
//   } catch (err) {
//     console.error("🔥 Audio playback error:", err);
//   }
// };

// const VoiceCall = () => {
//   const [engine, setEngine] = useState(null);
//   const [joined, setJoined] = useState(false);
//   const [remoteUid, setRemoteUid] = useState(null);

//   // 🔸 Request microphone permission (Android)
//   const requestPermission = async () => {
//     if (Platform.OS === "android") {
//       await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
//     }
//   };

//   useEffect(() => {
//     requestPermission();

//     const agoraEngine = createAgoraRtcEngine();
//     setEngine(agoraEngine);

//     agoraEngine.initialize({ appId: APP_ID });

//     // Set channel profile to "Communication"
//     agoraEngine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);

//     // Set user role (broadcaster)
//     // agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
//     agoraEngine.setClientRole(ClientRoleType.ClientRoleAudience);


//     // agoraEngine.enableAudioVolumeIndication(1000, 3, true);

//     // Event listeners
//     agoraEngine.registerEventHandler({
//       onJoinChannelSuccess: (connection, elapsed) => {
//         console.log("✅ Joined channel successfully:", connection);
//         setJoined(true);
//       },
//       onUserJoined: (connection, uid, elapsed) => {
//         console.log("🎧 Remote user joined:", uid);
//         setRemoteUid(uid);
//       },
//       onUserOffline: (connection, uid, reason) => {
//         console.log("❌ Remote user left:", uid);
//         setRemoteUid(null);
//       },
//       onError: (err, msg) => {
//         console.log("🚨 Agora error:", err, msg);
//       },

//       onAudioVolumeIndication: (connection, speakers, totalVolume) => {
//         if (speakers.length > 0) {
//           console.log(
//             "🎤 Speaking UID:",
//             speakers[0].uid,
//             "Volume:",
//             speakers[0].volume
//           );
//         }
//       },
//     });

//     return () => {
//       agoraEngine.leaveChannel();
//       agoraEngine.release();
//     };
//   }, []);

//   // const joinChannel = () => {
//   //   if (!engine) return;
//   //   engine.enableAudio();
//   //   engine.muteAllRemoteAudioStreams(false);
//   //   engine.joinChannel(TOKEN, CHANNEL_NAME, UID, { clientRoleType: ClientRoleType.ClientRoleBroadcaster });
//   // };

//   const joinChannel = async () => {
//     if (!engine) return;

//     // engine.enableAudio();
//     engine.muteLocalAudioStream(true);
//     engine.muteAllRemoteAudioStreams(false);
//     engine.setEnableSpeakerphone(true);
//   engine.setEnableSpeakerphone(true); 

//     // 🔸 Start recording audio to a .wav file

//     engine.joinChannel(TOKEN, CHANNEL_NAME, UID, {
//       clientRoleType: ClientRoleType.ClientRoleAudience, 
//     });

    

//     console.log("🎧 Recording started at:", filePath);
//   };

//   const leaveChannel = () => {
//     if (!engine) return;
//     engine.leaveChannel();
//     setJoined(false);
//     setRemoteUid(null);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Agora Voice Call</Text>
//       <Text style={styles.info}>
//         {joined
//           ? remoteUid
//             ? `Connected to UID: ${remoteUid}`
//             : "Waiting for remote user..."
//           : "Not joined"}
//       </Text>

//       {!joined ? (
//         <Button title="Join Channel" onPress={joinChannel} />
//       ) : (
//         <Button title="Leave Channel" color="red" onPress={leaveChannel} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
//   info: { marginBottom: 20 },
// });

// export default VoiceCall;


import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, PermissionsAndroid, Platform } from "react-native";
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from "react-native-agora";

const APP_ID = "80d31fcd548a464facd4643903ad068b";
const CHANNEL_NAME = "voice_test";
const TOKEN = ""; // Leave empty if token authentication is disabled on your Agora project
const UID = 0; // Auto-assigned UID

const VoiceCall = () => {
  const [engine, setEngine] = useState(null);
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(null);

  // 🔸 Request microphone permission (Android)
  const requestPermission = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    }
  };

  useEffect(() => {
    requestPermission();

    const agoraEngine = createAgoraRtcEngine();
    setEngine(agoraEngine);

    agoraEngine.initialize({ appId: APP_ID });

    // Set channel profile to "Communication"
    agoraEngine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);

    // Set user role (broadcaster)
    agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);


     agoraEngine.enableAudioVolumeIndication(1000, 3, true);

    // Event listeners
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

      onAudioVolumeIndication: (connection, speakers, totalVolume) => {
      if (speakers.length > 0) {
        console.log(
          "🎤 Speaking UID:",
          speakers[0].uid,
          "Volume:",
          speakers[0].volume
        );
      }
    },
    });

    return () => {
      agoraEngine.leaveChannel();
      agoraEngine.release();
    };
  }, []);

  const joinChannel = () => {
    if (!engine) return;
    engine.enableAudio();
  engine.setDefaultAudioRouteToSpeakerphone(true);
    engine.joinChannel(TOKEN, CHANNEL_NAME, UID, { clientRoleType: ClientRoleType.ClientRoleBroadcaster });
  };

  const leaveChannel = () => {
    if (!engine) return;
    engine.leaveChannel();
    setJoined(false);
    setRemoteUid(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agora Voice Call</Text>
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
