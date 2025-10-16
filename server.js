// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "25mb" }));
app.use(express.static("public"));

// Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, image } = req.body;
    if (!prompt || !image) return res.status(400).json({ error: "Missing prompt or image" });

    // Prepare prompt array for Gemini
    const promptArray = [
      { text: prompt },
      { inlineData: { mimeType: "image/png", data: image.split(",")[1] } },
    ];

    // Generate image
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: promptArray,
    });

    // Extract the image from response
    const parts = response.candidates[0].content.parts;
    let imageBase64 = null;
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!imageBase64) return res.status(500).json({ error: "No image returned" });

    res.json({ image_base64: imageBase64 });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
