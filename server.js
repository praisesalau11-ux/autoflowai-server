const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// ===== AI ROUTE =====
app.post("/generate", async (req, res) => {
  const { idea, goal, platform } = req.body;

  // ✅ Validate input
  if (!idea || !goal) {
    return res.status(400).json({ error: "Missing idea or goal" });
  }

  try {
    console.log("Incoming:", { idea, goal, platform });

    // ✅ Use built-in fetch (NO node-fetch needed)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `
Create a powerful marketing plan:

Idea: ${idea}
Goal: ${goal}
Platform: ${platform}

Include:
- Hook
- Strategy
- Video Script
- Caption
- Growth tips
            `
          }
        ]
      })
    });

    const data = await response.json();

    console.log("OpenAI response:", data);

    // ❌ Handle OpenAI error
    if (!data.choices) {
      return res.status(500).json({
        error: "OpenAI failed",
        details: data
      });
    }

    const result = data.choices[0].message.content;

    // ✅ Send to frontend
    res.json({ result });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    res.status(500).json({
      error: "Server crashed",
      message: err.message
    });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});