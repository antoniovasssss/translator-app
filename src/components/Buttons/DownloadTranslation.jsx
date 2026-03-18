import React from "react";
import { IconDownload } from "@tabler/icons-react";
import { createTranslatedFileBlob } from "@/utils/exportTranslation";

const DownloadTranslation = ({ translatedText, originalFile }) => {
  const handleDownload = async () => {
    if (!translatedText.trim()) {
      alert("No translation to download");
      return;
    }

    try {
      const { blob, filename } = await createTranslatedFileBlob({
        originalFile,
        translatedText,
      });

      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    } catch (error) {
      console.error("Download error:", error);
      alert("Unable to generate download file. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!translatedText.trim()}
      className="p-1 rounded hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Download translated text"
      aria-label="Download translation"
    >
      <IconDownload
        size={22}
        className="text-orange-600 hover:text-orange-700"
      />
    </button>
  );
};

export default DownloadTranslation;
