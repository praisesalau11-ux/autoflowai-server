const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 🔥 IMPORTANT: add fetch support
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// ===== AI GENERATOR =====
app.post("/generate", async (req, res) => {
  const { idea, goal, platform } = req.body;

  // 🧠 VALIDATION
  if (!idea || !goal) {
    return res.status(400).json({ error: "Missing idea or goal" });
  }

  try {

    console.log("Incoming request:", { idea, goal, platform });

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
Create a HIGH-CONVERTING marketing plan:

Business Idea: ${idea}
Goal: ${goal}
Platform: ${platform}

Make it powerful and detailed.

Include:
1. 🔥 Hook (attention grabbing)
2. 🎯 Strategy
3. 🎬 Short Video Script
4. 📱 Caption (viral style)
5. 🚀 Growth tips
            `
          }
        ]
      })
    });

    const data = await response.json();

    // 🧠 DEBUG LOG
    console.log("OpenAI response:", data);

    // ❗ HANDLE OPENAI ERROR
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        error: "OpenAI failed",
        details: data
      });
    }

    const output = data.choices[0].message.content;

    // ✅ FINAL RESPONSE
    res.json({ result: output });

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