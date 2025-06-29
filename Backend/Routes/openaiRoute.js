import axios from "axios";
import dotenv from "dotenv";
import express from "express"

const router = express.Router();
dotenv.config();

router.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GPT error", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

export default router;