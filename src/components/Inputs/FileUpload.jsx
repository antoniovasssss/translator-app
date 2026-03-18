import React, { useState } from "react";
import { IconPaperclip, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { parseDocument } from "@/utils/documentParser";

const FileUpload = ({ handleFileUpload }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess(false);
    setIsLoading(true);

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError("File size exceeds 100MB limit");
      setIsLoading(false);
      return;
    }

    try {
      // Parse document using the new document parser
      const content = await parseDocument(file);

      if (!content || content.trim().length === 0) {
        setError("Unable to extract text from this file");
        setIsLoading(false);
        return;
      }

      // Call parent handler with the extracted content and original file
      handleFileUpload({
        file,
        content,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setIsLoading(false);
    } catch (err) {
      console.error("File processing error:", err);
      setError(`Error processing file: ${err.message}`);
      setIsLoading(false);
    }

    // Reset input
    e.target.value = "";
  };

  return (
    <div className="relative group">
      <label 
        htmlFor="file-upload" 
        className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1" 
        title="Upload any document (PDF, DOCX, Excel, TXT, RTF, etc.)"
      >
        <IconPaperclip size={21} />
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
      </label>
      
      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full left-0 mb-2 bg-red-600 text-white text-xs p-2 rounded whitespace-nowrap z-50 flex items-center gap-1 shadow-lg">
          <IconAlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Success tooltip */}
      {success && (
        <div className="absolute bottom-full left-0 mb-2 bg-green-600 text-white text-xs p-2 rounded whitespace-nowrap z-50 flex items-center gap-1 shadow-lg">
          <IconCheck size={14} />
          Document loaded!
        </div>
      )}

      {isLoading && (
        <span className="text-xs text-blue-500 animate-pulse">Processing...</span>
      )}
    </div>
  );
};

export default FileUpload;
