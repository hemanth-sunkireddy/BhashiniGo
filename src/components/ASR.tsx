import RNFS from "react-native-fs";

export const callCanvasAudioAPI = async (filePath: string) => {
  const endpoint =
    "https://canvas.iiit.ac.in/sandboxbeprod/infer_asr/67100d22a0397bc812dacb27"; // 🔁 replace with ASR model id
  console.log("FILE PATH: ", filePath);
  try {
    // Create FormData payload
    const formData = new FormData();
    formData.append("audio_file", {
      uri: `file://${filePath}`, // required for React Native
      name: "recorded_audio.wav",
      type: "audio/wav",
    } as any);

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
    console.error("🎧 ASR API ERROR:", error);
    throw new Error(error.message || "Network error");
  }
};
