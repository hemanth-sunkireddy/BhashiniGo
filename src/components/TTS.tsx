export const callCanvasTTSAPI = async (text: string, gender: "male" | "female") => {
  const endpoint =
    "https://canvas.iiit.ac.in/sandboxbeprod/generate_tts/67bca8b3e0b95a6a1ea34a93";

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
