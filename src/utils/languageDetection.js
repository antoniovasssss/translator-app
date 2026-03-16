import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SUPPORTED_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Portuguese",
  "Italian",
  "Dutch",
  "Russian",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Turkish",
  "Polish",
];

export const detectLanguage = async (text) => {
  if (!text || text.trim().length === 0) {
    return null;
  }

  try {
    // Clean the text first to avoid binary data
    let cleanText = text
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[^\w\s\.\,\!\?\;\:\-\'\"\(\)\n\r]/g, "") // Remove special characters
      .trim();

    // If after cleaning there's no text, return null
    if (cleanText.length === 0) {
      return null;
    }

    // Use a sample of the text for faster detection (first 500 chars)
    const sampleText = cleanText.substring(0, 500);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Detect the language of the following text and respond with ONLY the language name from this list: ${SUPPORTED_LANGUAGES.join(
            ", "
          )}.

If the language is not in the list, respond with the closest match from the list.

Text:
${sampleText}

Respond with only the language name, nothing else.`,
        },
      ],
    });

    const detectedLanguage = response.choices[0].message.content?.trim();

    // Validate that the detected language is in our supported list
    if (
      detectedLanguage &&
      SUPPORTED_LANGUAGES.includes(detectedLanguage)
    ) {
      return detectedLanguage;
    }

    // If detection fails, return null
    return null;
  } catch (error) {
    console.error("Error detecting language:", error);
    return null;
  }
};

export const getSupportedLanguages = () => SUPPORTED_LANGUAGES;
