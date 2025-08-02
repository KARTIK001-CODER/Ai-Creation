const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Replace this with your actual Gemini API key
const GEMINI_API_KEY = "AIzaSyBaK8mPkPCxllAvktx08NMDqQVy5N9aLog";

app.post("/predict", async (req, res) => {
  const { skills } = req.body;

  if (!skills) {
    return res.status(400).json({ error: "No skills provided" });
  }

  const prompt = `
You are a master career advisor.

Your task is to take the given skill(s) and match them to the most suitable professions from the fixed list below.

Fixed Professions:
[
  "Software Engineer", "Teacher", "Driver", "Construction Worker", "Painter",
  "Accountant", "Nurse", "Electrician", "Plumber", "Tailor", "Director", "Actor",
  "Mechanic", "Civil Engineer", "Doctor", "Police Officer", "Farmer",
  "Chef", "Data Analyst", "Graphic Designer", "Sales Executive", "Shopkeeper"
]

Return a JSON array of 3–5 professions that best match the user’s skills. Each object must include:
- profession (string)
- match (percentage from 50–100)

Respond only with the JSON array. No explanation.

User skills: ${skills}
`;

  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyBaK8mPkPCxllAvktx08NMDqQVy5N9aLog`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = text.match(/\[\s*{[^]*?}\s*\]/);
    if (!jsonMatch) throw new Error("❌ No JSON array found in Gemini response");

    const result = JSON.parse(jsonMatch[0]);
    res.json({ professions: result });
  } catch (err) {
    console.error("❌ Error in /predict route:", err);
    res.status(500).json({ error: "Failed to generate profession list", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
