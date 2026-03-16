import React from "react";
import { IconDownload } from "@tabler/icons-react";

const DownloadTranslation = ({ translatedText, sourceLanguage, targetLanguage }) => {
  const handleDownload = () => {
    if (!translatedText.trim()) {
      alert("No translation to download");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([translatedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `translation_${sourceLanguage}_to_${targetLanguage}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!translatedText.trim()}
      className="p-1 rounded hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Download translated text"
      aria-label="Download translation"
    >
      <IconDownload size={22} className="text-orange-600 hover:text-orange-700" />
    </button>
  );
};

export default DownloadTranslation;
