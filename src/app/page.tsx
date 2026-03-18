"use client";
import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { IconCopy } from "@tabler/icons-react";
import FileUpload from "@/components/Inputs/FileUpload";
import DownloadTranslation from "@/components/Buttons/DownloadTranslation";
import useTranslate from "@/hooks/useTranslate";
import { detectLanguage } from "@/utils/languageDetection";
import SvgDecorations from "@/components/SvgDecorations";
import Notification from "@/components/Notification";

const Home: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<{
    file: File;
    name: string;
    size: number;
    type: string;
    url: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: string;
  } | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string>("English");
  const [targetLanguage, setTargetLanguage] = useState<string>("Spanish");
  const [displayMode, setDisplayMode] = useState<
    "original" | "translation" | "both"
  >("both");

  const targetText = useTranslate(sourceText, sourceLanguage, targetLanguage);

  const handleFileUpload = async (payload: {
    file?: File;
    content?: string;
  }) => {
    try {
      const content = payload.content || "";
      const file = payload.file;

      if (!content || content.trim().length === 0) {
        setNotification({
          message: "No text content found in the document.",
          type: "error",
        });
        return;
      }

      // Clean the text
      let text = content
        .replace(/\s+/g, " ")
        .replace(/[^\w\s\.\,\!\?\;\:\-\'\"\(\)\n\r]/g, "")
        .trim();

      // Extract first 5000 characters
      const limitedText = text.substring(0, 5000);
      setSourceText(limitedText);

      // Store metadata about the uploaded file (for showing a preview/download link)
      if (file) {
        if (uploadedFile?.url) {
          URL.revokeObjectURL(uploadedFile.url);
        }
        const url = URL.createObjectURL(file);
        setUploadedFile({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          url,
        });
      }

      // Detect language
      try {
        const detected = await detectLanguage(limitedText);
        if (detected) {
          setSourceLanguage(detected);
          setNotification({
            message: `📄 Document loaded! Detected language: ${detected}`,
            type: "success",
          });
        }
      } catch (error) {
        console.error("Language detection error:", error);
        setNotification({
          message: "Document loaded successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setNotification({
        message: "Error processing file. Please try again.",
        type: "error",
      });
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white relative flex items-center justify-center min-h-screen">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="relative overflow-hidden w-full">
        <div className="max-w-full lg:max-w-[85rem] mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-poppins text-slate-900">
              Sabio<span className="text-[#007bff]"> Document Translator</span>
            </h1>

            <p className="mt-2 xs:mt-3 sm:mt-4 text-xs xs:text-sm sm:text-base text-slate-600 font-roboto px-2">
              Upload any document and translate it to your desired language
            </p>

            <div className="mt-8 sm:mt-12 mx-auto max-w-2xl">
              {/* File Upload Section */}
              {!sourceText && (
                <div className="bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-dashed border-blue-300 rounded-lg p-6 xs:p-8 sm:p-10 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-4xl sm:text-5xl">📄</div>
                    <div>
                      <h2 className="text-lg xs:text-xl sm:text-2xl font-poppins font-bold text-slate-900 mb-2">
                        Upload Document
                      </h2>
                      <p className="text-xs xs:text-sm sm:text-base text-slate-600 mb-4">
                        Supports: PDF, Word, Excel, TXT, RTF and more
                      </p>
                    </div>
                    <FileUpload handleFileUpload={handleFileUpload} />
                  </div>
                </div>
              )}

              {/* Translation Display */}
              {sourceText && (
                <div className="space-y-4">
                  {/* Uploaded document info */}
                  {uploadedFile && (
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 mb-4 text-sm text-slate-700">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-800">
                            Uploaded document
                          </p>
                          <p className="text-xs text-slate-600">
                            {uploadedFile.name} •{" "}
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={uploadedFile.url}
                            download={uploadedFile.name}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                          >
                            Download original
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => setDisplayMode("original")}
                      className={`px-4 py-2 rounded-lg transition-colors font-roboto text-sm sm:text-base ${
                        displayMode === "original"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-200 text-blue-900 hover:bg-blue-300"
                      }`}
                    >
                      Original
                    </button>
                    <button
                      onClick={() => setDisplayMode("translation")}
                      className={`px-4 py-2 rounded-lg transition-colors font-roboto text-sm sm:text-base ${
                        displayMode === "translation"
                          ? "bg-orange-600 text-white"
                          : "bg-orange-200 text-orange-900 hover:bg-orange-300"
                      }`}
                    >
                      Translation
                    </button>
                    <button
                      onClick={() => setDisplayMode("both")}
                      className={`px-4 py-2 rounded-lg transition-colors font-roboto text-sm sm:text-base ${
                        displayMode === "both"
                          ? "bg-yellow-600 text-white"
                          : "bg-yellow-200 text-yellow-900 hover:bg-yellow-300"
                      }`}
                    >
                      Both
                    </button>
                  </div>

                  <div
                    className={`grid gap-4 ${displayMode === "both" ? "md:grid-cols-2" : "md:grid-cols-1"}`}
                  >
                    {/* Source */}
                    {(displayMode === "original" || displayMode === "both") && (
                      <div className="border-2 border-blue-300 rounded-lg p-4 bg-white shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-poppins font-bold text-slate-900 text-sm sm:text-base">
                            Original ({sourceLanguage})
                          </h3>
                        </div>
                        <div className="text-xs xs:text-sm sm:text-base text-slate-700 max-h-48 overflow-y-auto bg-blue-50 p-3 rounded font-roboto">
                          {sourceText}
                        </div>
                      </div>
                    )}

                    {/* Target */}
                    {(displayMode === "translation" ||
                      displayMode === "both") && (
                      <div className="border-2 border-orange-300 rounded-lg p-4 bg-white shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-poppins font-bold text-slate-900 text-sm sm:text-base">
                            Translation ({targetLanguage})
                          </h3>
                        </div>
                        <div className="text-xs xs:text-sm sm:text-base text-slate-700 max-h-48 overflow-y-auto bg-orange-50 p-3 rounded font-roboto">
                          {targetText || (
                            <span className="text-slate-400 italic">
                              Translating...
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        setSourceText("");
                        if (uploadedFile?.url) {
                          URL.revokeObjectURL(uploadedFile.url);
                        }
                        setUploadedFile(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto text-sm sm:text-base"
                    >
                      Upload Another
                    </button>
                    <button
                      onClick={handleCopyToClipboard}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-roboto text-sm sm:text-base flex items-center gap-2"
                    >
                      <IconCopy size={18} /> Copy
                    </button>
                    <DownloadTranslation
                      translatedText={targetText}
                      originalFile={uploadedFile?.file}
                    />
                  </div>
                  {copied && (
                    <p className="text-center text-green-600 text-sm font-roboto">
                      ✓ Copied to clipboard!
                    </p>
                  )}
                </div>
              )}

              <SvgDecorations />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
