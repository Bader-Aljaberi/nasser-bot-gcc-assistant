import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "../frontend")));

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "";

  if (!userMessage.trim()) {
    return res.json({ reply: "Please enter a message." });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful GCC travel assistant. Answer questions about Bahrain, Kuwait, Oman, Qatar, Saudi Arabia, UAE.",
            },
            { role: "user", content: userMessage },
          ],
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response from AI.";
    res.json({ reply });
  } catch (error) {
    res.json({ reply: "Error: " + error.message });
  }
});

const PORT = 4809;
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
