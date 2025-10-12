// Bhasani OCR API integration for React Native
// Usage: import { callBhasaniOCR } from './OCR';

export const callBhasaniOCR = async (file: any, lang: string) => {
  // file: { uri, name, type }
  // lang: 'en', 'hi', 'te'
  const endpoints: Record<string, string> = {
    en: "https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/687f420802ae0a1948845594",
    hi: "https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/6711fe751595b8ffe97adc1f",
    te: "https://canvas.iiit.ac.in/sandboxbeprod/check_ocr_status_and_infer/687f65f502ae0a19488455b5",
  };
  const endpoint = endpoints[lang];
  if (!endpoint) throw new Error("Unsupported language for OCR");
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name || "image.jpg",
      type: file.type || "image/jpeg",
    });
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhlYTU2ZmViOTNlM2JlYzkwMWZkODhkIiwicm9sZSI6Im1lZ2F0aG9uX3N0dWRlbnQifQ.Td3AIp38r_l4rzy9ImdhqQg3gKH45aSnvriosa-sI6U",
      },
      body: formData,
    });
    const data = await response.json();
    console.log("DATA: ", data);
    if (!response.ok) {
      throw new Error(data.message || "OCR failed");
    }
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Network error");
  }
};
