import { useEffect, useState } from "react";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const useTranslate = (sourceText, sourceLanguage, targetLanguage) => {
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    const handleTranslate = async (sourceText) => {
      try {
        // Clean the text to ensure it's readable
        const cleanText = sourceText
          .replace(/\s+/g, " ") // Replace multiple spaces
          .replace(/[^\w\s\.\,\!\?\;\:\-\'\"\(\)\n\r]/g, "") // Remove special characters
          .trim();

        if (!cleanText) {
          setTargetText("");
          return;
        }

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `You are a professional document translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
              
Text to translate:
${cleanText}

Instructions:
- Preserve the original formatting and structure
- Maintain technical terms where applicable
- Keep the tone and style of the original
- Do not add any explanations or commentary
- Return only the translated text`,
            },
          ],
        });

        const data = response.choices[0].message.content;
        setTargetText(data);
      } catch (error) {
        console.error("Error translating text:", error);
        setTargetText("Error during translation. Please try again.");
      }
    };

    if (sourceText.trim() && sourceLanguage && targetLanguage) {
      const timeoutId = setTimeout(() => {
        handleTranslate(sourceText);
      }, 500); // Adjust the delay as needed

      return () => clearTimeout(timeoutId);
    } else {
      setTargetText("");
    }
  }, [sourceText, sourceLanguage, targetLanguage]);

  return targetText;
};

export default useTranslate;
