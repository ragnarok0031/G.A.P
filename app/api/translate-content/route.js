async function handler({ content, targetLanguage = "en" }) {
  if (!content) {
    return {
      error: "Content is required",
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
          q: content,
          target: targetLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();

    return {
      translatedContent: data.data.translations[0].translatedText,
      sourceLanguage: data.data.translations[0].detectedSourceLanguage,
    };
  } catch (error) {
    return {
      error: "Failed to translate content",
    };
  }
}
