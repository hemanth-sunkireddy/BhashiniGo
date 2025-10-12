import RNFS from "react-native-fs";

export const callCanvasAudioAPI = async (filePath: string,  sourceLang: string) => {
     const endpoints: Record<string, string> = {
    en: "https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67127dcbb1a6984f0c5e7d35", // English ASR
    hi: "https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67100d22a0397bc812dacb27", // Hindi ASR
    te: "https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67b840e29c21bec07537674b", // Telugu ASR
  };
  console.log("FILE PATH: ", filePath);
   const endpoint = endpoints[sourceLang];
  try {
    // Create FormData payload
    const formData = new FormData();
    formData.append("audio_file", {
      uri: `file://${filePath}`, // required for React Native
      name: "recorded_audio.wav",
      type: "audio/wav",
    } as any);
    console.log("SOURCE LANG: ", sourceLang);
    console.log("🎧 FILE PATH:", filePath);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlYTU2ZmViOTNlM2JlYzkwMWZkODhkIiwicm9sZSI6Im1lZ2F0aG9uX3N0dWRlbnQifQ.Td3AIp38r_l4rzy9ImdhqQg3gKH45aSnvriosa-sI6U",
        // ❌ Do NOT set Content-Type manually — fetch will handle multipart boundaries
      },
      body: formData,
    });
    console.log("RESPONSE: ", response);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "ASR request failed");
    }

    console.log("✅ ASR Response:", data);
    return data;
  } catch (error: any) {
    console.error("🚨 ASR API ERROR CAUGHT 🚨");
    console.error("🔹 Name:", error.name);
    console.error("🔹 Message:", error.message);
    console.error("🔹 Stack:", error.stack);
    console.error("🔹 Full Error Object:", JSON.stringify(error, null, 2));
    throw new Error(error.message || "Network error");
  }
};
