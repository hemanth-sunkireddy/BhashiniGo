// Dynamic Machine Translation (English, Hindi, Telugu)
export const callCanvasAPI = async (
  inputText: string,
  sourceLang: string,
  targetLang: string
) => {
  // ✅ Define each language pair → its unique endpoint
  const endpoints: Record<string, string> = {
    "en-hi": "https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b86729b5cc0eb92316383c",
    "hi-en": "https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/687217304f34535ffa89b932",
    "en-te": "https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/6872172f4f34535ffa89b90f",
    "te-en": "https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/67b868a4b5cc0eb92316383f",
    "hi-te": "https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/687217304f34535ffa89b945",
    "te-hi": "https://canvas.iiit.ac.in/sandboxbeprod/check_model_status_and_infer/6872173b4f34535ffa89bb1a",
  };

  const key = `${sourceLang}-${targetLang}`;
  const endpoint = endpoints[key];

  if (!endpoint) {
    throw new Error(
      `Translation from ${sourceLang} → ${targetLang} is not supported.`
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlYTU2ZmViOTNlM2JlYzkwMWZkODhkIiwicm9sZSI6Im1lZ2F0aG9uX3N0dWRlbnQifQ.Td3AIp38r_l4rzy9ImdhqQg3gKH45aSnvriosa-sI6U",
      },
      body: JSON.stringify({
        input_text: inputText,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Translation failed");
    }

    return data;
  } catch (error: any) {
    console.log("API ERROR:", error);
    throw new Error(error.message || "Network error");
  }
};
