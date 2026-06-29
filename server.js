const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ status: "IdeaBloom server is running" });
});

function cleanJson(output) {
  const cleaned = output.replace(/```json/g, "").replace(/```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("AI response was not valid JSON");
  }

  return JSON.parse(match[0]);
}

app.post("/analyze", async (req, res) => {
  try {
    const { text, history } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are IdeaBloom, an AI Creative Recovery Workflow.

Your task:
- Analyze the user's creative block
- Detect the block type
- Detect the mood
- Generate practical recommendations
- Create one writing prompt
- Create one small action task
- Use Georgian language for user-facing text
- Return ONLY valid JSON
- No markdown
- No extra explanation

User creative block:
${text}

User previous history:
${JSON.stringify(history || [])}

Return this exact JSON structure:

{
  "blockType": "Idea Block | Story Block | Motivation Block | Character Block | Dialogue Block | Burnout Block | Research Block",
  "mood": "short mood description",
  "summary": "short explanation of what is blocking the user",
  "recommendations": {
    "books": ["book 1", "book 2"],
    "movies": ["movie 1", "movie 2"],
    "music": ["music 1", "music 2"],
    "exercises": ["exercise 1", "exercise 2"]
  },
  "writingPrompt": "specific creative writing prompt",
  "actionTask": "small practical task user can do today"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const json = cleanJson(response.text());

    res.json({
      blockType: json.blockType || "Creative Block",
      mood: json.mood || "Unknown mood",
      summary: json.summary || "სისტემამ ამოიცნო კრეატიული ბლოკი.",
      recommendations: json.recommendations || {
        books: [],
        movies: [],
        music: [],
        exercises: []
      },
      writingPrompt: json.writingPrompt || "დაწერე მოკლე სცენა იმ იდეის შესახებ, რომელიც ახლა ყველაზე მეტად გაბრკოლებს.",
      actionTask: json.actionTask || "დაწერე 100 სიტყვა შენს იდეაზე."
    });

  } catch (err) {
    console.error("AI ERROR:", err.message);

    res.status(500).json({
      error: "AI workflow failed",
      details: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("IdeaBloom server running on http://localhost:3000");
});