import { Document, Packer, Paragraph, TextRun } from "docx";
import { PDFDocument, StandardFonts } from "pdf-lib";

const getExtension = (fileName) => {
  if (!fileName) return "txt";
  const match = fileName.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "txt";
};

const normalizeBaseName = (fileName) => {
  if (!fileName) return "output";
  return fileName.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_");
};

export const buildTranslatedFilename = (fileName, extension) => {
  const base = normalizeBaseName(fileName);
  return `translated_${base}.${extension}`;
};

export const makeTxtBlob = (text) => {
  return new Blob([text], { type: "text/plain;charset=utf-8" });
};

export const makeDocxBlob = async (text) => {
  const lines = text.split(/\r?\n/);
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: lines.map(
          (line) => new Paragraph({ children: [new TextRun(line || "")] }),
        ),
      },
    ],
  });

  return await Packer.toBlob(doc);
};

export const makePdfBlob = async (text) => {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const { width, height } = page.getSize();
  const margin = 40;
  const maxWidth = width - margin * 2;

  const lines = text.split(/\r?\n/).flatMap((line) => {
    // Simple word-wrap
    const words = line.split(" ");
    const wrapped = [];
    let current = "";

    words.forEach((word) => {
      const test = current ? `${current} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(test, fontSize);
      if (testWidth <= maxWidth) {
        current = test;
      } else {
        if (current) wrapped.push(current);
        current = word;
      }
    });

    if (current) wrapped.push(current);
    return wrapped;
  });

  const lineHeight = fontSize * 1.4;
  let y = height - margin;

  lines.forEach((line) => {
    if (y < margin) {
      y = height - margin;
      page = pdfDoc.addPage();
    }

    page.drawText(line, {
      x: margin,
      y,
      size: fontSize,
      font,
      lineHeight,
      maxWidth,
    });

    y -= lineHeight;
  });

  const uint8Array = await pdfDoc.save();
  return new Blob([uint8Array], { type: "application/pdf" });
};

export const createTranslatedFileBlob = async ({
  originalFile,
  translatedText,
}) => {
  const extension = getExtension(originalFile?.name);
  const baseName = originalFile?.name || "output";
  const filename = buildTranslatedFilename(baseName, extension);

  switch (extension) {
    case "docx": {
      const blob = await makeDocxBlob(translatedText);
      return { blob, filename };
    }
    case "pdf": {
      const blob = await makePdfBlob(translatedText);
      return { blob, filename };
    }
    case "txt": {
      const blob = makeTxtBlob(translatedText);
      return { blob, filename };
    }
    default: {
      console.warn(`Unsupported file type .${extension}, falling back to .txt`);
      const blob = makeTxtBlob(translatedText);
      return {
        blob,
        filename: buildTranslatedFilename(baseName, "txt"),
      };
    }
  }
};
