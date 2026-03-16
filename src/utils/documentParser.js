'use client';

import * as mammoth from "mammoth";
import * as XLSX from "xlsx";

export const parseDocument = async (file) => {
  const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  const fileType = file.type;

  try {
    if (fileExtension === ".pdf" || fileType === "application/pdf") {
      return await parsePDF(file);
    } else if (
      fileExtension === ".docx" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await parseDOCX(file);
    } else if (
      fileExtension === ".doc" ||
      fileType === "application/msword"
    ) {
      return await parseDOC(file);
    } else if (
      fileExtension === ".xlsx" ||
      fileExtension === ".xls" ||
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "application/vnd.ms-excel"
    ) {
      return await parseExcel(file);
    } else if (
      fileExtension === ".txt" ||
      fileType === "text/plain"
    ) {
      return await parseTXT(file);
    } else if (
      fileExtension === ".rtf" ||
      fileType === "text/rtf" ||
      fileType === "application/rtf"
    ) {
      return await parseRTF(file);
    } else {
      // Try to read as text for unknown formats
      return await parseTXT(file);
    }
  } catch (error) {
    console.error("Document parsing error:", error);
    throw new Error(`Failed to parse ${fileExtension} file: ${error.message}`);
  }
};

const parsePDF = async (file) => {
  try {
    // Dynamically import pdfjs-dist only when needed (in browser)
    const pdfjsLib = await import("pdfjs-dist");
    
    // Set up PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        text += pageText + "\n";
      } catch (pageError) {
        console.warn(`Could not extract text from page ${i}:`, pageError);
      }
    }

    if (!text.trim()) {
      throw new Error("No text could be extracted from PDF. The PDF may be image-based or encrypted.");
    }

    return text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw error;
  }
};

const parseDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const parseDOC = async (file) => {
  // For older .doc files, we'll try to read as text
  // Note: True .doc parsing requires specialized libraries
  return await parseTXT(file);
};

const parseExcel = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  let text = "";

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const sheetText = XLSX.utils.sheet_to_csv(worksheet);
    text += `Sheet: ${sheetName}\n${sheetText}\n\n`;
  });

  return text;
};

const parseTXT = async (file) => {
  return await file.text();
};

const parseRTF = async (file) => {
  // For RTF, try to extract as text
  const text = await file.text();
  // Remove RTF formatting
  return text.replace(/\\[a-z0-9]+/g, "").replace(/{[^}]*}/g, "");
};
