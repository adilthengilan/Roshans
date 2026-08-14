import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side database file path
const DATA_FILE = path.join(process.cwd(), "data_store.json");

// API: Get persistent state
app.get("/api/store", (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return res.json(JSON.parse(data));
    }
    return res.json({ status: "empty" });
  } catch (error) {
    console.error("Error reading data store:", error);
    return res.status(500).json({ error: "Failed to read store" });
  }
});

// API: Save persistent state
app.post("/api/store", (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), "utf-8");
    return res.json({ success: true });
  } catch (error) {
    console.error("Error writing data store:", error);
    return res.status(500).json({ error: "Failed to save store" });
  }
});

// API: Gemini AI Assistants (Coach, CFO, Mentor, Researcher)
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { persona, userMessage, contextSummary, history } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured in environment variables.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let systemInstruction = "";
    switch (persona) {
      case "Coach":
        systemInstruction = `You are PRIME OS AI Coach — an elite athletic performance and programming advisor built for Muhammed Roshan (Dubai-based Fitness & Athletic Coach).
Your domain: Calisthenics, Boxing, Kickboxing, CrossFit, Wrestling, Acrobatics, Running, Strength & Conditioning, and Recovery.
Analyze Muhammed's recent workout and recovery logs, sleep, soreness, and physical goals.
Provide concise, actionable advice (e.g. readiness analysis, training adaptations, rest interval suggestions).
When recommending a task or log, explicitly format it like:
ACTION_PROPOSAL: {"type": "task", "title": "...", "priority": "Must Do"}`;
        break;

      case "CFO":
        systemInstruction = `You are PRIME OS CFO — a personal and business financial intelligence advisor for Muhammed Roshan (INTOKINE, Zaki Wellness, KATBA Athletics).
Your domain: Monthly Recurring Revenue (MRR), cash flow analysis, expense leakage detection, client retention impact on revenue, and savings targets in AED.
Analyze financial entries, MRR, transactions, and goals provided in context.
Provide sharp, strategic financial insights in a clear, tabular/bulleted executive style.
When recommending a task or expense check, explicitly format it like:
ACTION_PROPOSAL: {"type": "task", "title": "...", "priority": "Important"}`;
        break;

      case "Mentor":
        systemInstruction = `You are PRIME OS Mentor — a high-performance mindset, discipline, and life strategy partner for Muhammed Roshan.
Your domain: Daily discipline, Prime Score trends, night reflections, habit consistency, spiritual focus, and long-term vision.
Provide deep, direct, empathetic yet rigorous feedback on patterns, wins, misses, and habit adherence.
When suggesting an action item, format it like:
ACTION_PROPOSAL: {"type": "task", "title": "...", "priority": "Growth"}`;
        break;

      case "Researcher":
        systemInstruction = `You are PRIME OS Researcher — a sports science, coaching methodology, and business literature synthesizer.
Your domain: Hypertrophy science, biomechanics, combat sports conditioning, recovery protocols, leadership, and athletic brand building.
Summarize research, answer coaching science questions with evidence-backed clarity, and help build Muhammed's knowledge library.
When suggesting a learning item, format it like:
ACTION_PROPOSAL: {"type": "knowledge", "title": "...", "category": "Research"}`;
        break;

      default:
        systemInstruction = "You are PRIME OS AI Assistant for Muhammed Roshan.";
    }

    const fullPrompt = `Context Summary of User Data:\n${JSON.stringify(contextSummary, null, 2)}\n\nUser Question:\n${userMessage}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "No response received from AI.";
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    return res.status(500).json({ error: error?.message || "AI Assistant failed to generate response." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PRIME OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
