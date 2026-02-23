import axios from "axios";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const extractTextFromPDF = async (fileUrl) => {
  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const dataBuffer = Buffer.from(response.data);

    const data = await pdf(dataBuffer);

    return data.text || "";
  } catch (error) {
    console.error("PDF extraction failed:", error);
    return "";
  }
};
