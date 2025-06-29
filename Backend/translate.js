import axios from "axios";
export const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post("https://libretranslate.de/translate", {
      q: text,
      source: "en",
      target: targetLang,
      format: "text"
    }, {
      headers: { "Content-Type": "application/json" }
    });

    console.log("Translation success:", response.data);
    return response.data.translatedText;
  } catch (err) {
    console.error("Translation error:", err.response?.data || err.message);
    return "⚠️ Translation failed";
  }
};
