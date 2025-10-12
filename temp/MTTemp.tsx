import { accessToken, mtAPI } from "../../constants";

// Dynamic Machine Translation (English, Hindi, Telugu)
export const callCanvasAPI = async (
  inputText: string,
  sourceLang: string,
  targetLang: string
) => {
  const endpoint = mtAPI;

  if (!endpoint) {
    throw new Error(
      `Translation from ${sourceLang} → ${targetLang} is not supported.`
    );
  }

  // ✅ Build request body dynamically
  const requestBody = {
    pipelineTasks: [
      {
        taskType: "translation",
        config: {
          language: {
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
          },
          serviceId: "ai4bharat/indictrans-v2-all-gpu--t4",
          numTranslation: "True",
        },
      },
    ],
    inputData: {
      input: [
        {
          source: inputText,
        },
      ],
      audio: [
        {
          audioContent: null,
        },
      ],
    },
  };
  console.log("REQUEST BODY: ", requestBody);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": accessToken,
      },
      body: JSON.stringify(requestBody),
    });
    console.log("RESPONSE: ", response);

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
