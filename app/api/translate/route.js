async function handler({ text, targetLanguage = "en" }) {
  if (!text) {
    return {
      error: "Text is required",
    };
  }

  const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (!GOOGLE_TRANSLATE_API_KEY) {
    return {
      error: "Translation service configuration is missing",
    };
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();

    return {
      translatedText: data.data.translations[0].translatedText,
      detectedSourceLanguage: data.data.translations[0].detectedSourceLanguage,
    };
  } catch (error) {
    return {
      error: "Failed to translate text",
    };
  }
}
