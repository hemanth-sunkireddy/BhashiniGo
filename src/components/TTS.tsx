export const callCanvasTTSAPI = async (text: string, gender: "male" | "female", targetLang: string,) => {
  
  const endpoints: Record<string, string> = {
    en: "https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca8b3e0b95a6a1ea34a93", // English TTS
    hi: "https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca89ae0b95a6a1ea34a92", // Hindi TTS
    te: "https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca880e0b95a6a1ea34a91", // Telugu TTS
  };
  targetLang = "hi";
  const endpoint = endpoints[targetLang];
  console.log(targetLang);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlYTU2ZmViOTNlM2JlYzkwMWZkODhkIiwicm9sZSI6Im1lZ2F0aG9uX3N0dWRlbnQifQ.Td3AIp38r_l4rzy9ImdhqQg3gKH45aSnvriosa-sI6U",
      },
      body: JSON.stringify({
        text,
        gender,
      }),
    });

    const data = await response.json();
    console.log("DATA: ", data);
    if (!response.ok) {
      throw new Error(data.message || "TTS request failed");
    }

    console.log("✅ TTS Response:", data);
    return data;
  } catch (error: any) {
    console.error("🔊 TTS API ERROR:", error);
    throw new Error(error.message || "Network error");
  }
};
