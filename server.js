// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "25mb" }));
app.use(express.static("public"));

const NANO_API_KEY = process.env.NANO_API_KEY;

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, image } = req.body;
    if (!prompt || !image) return res.status(400).json({ error: "Missing prompt or image" });

    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", buffer, "input.png");

    const response = await fetch("https://api.nanobanana.ai/v1/image/generate", {
      method: "POST",
      headers: { Authorization: `Bearer ${NANO_API_KEY}` },
      body: formData
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: text });
    }

    const imgBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(imgBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
