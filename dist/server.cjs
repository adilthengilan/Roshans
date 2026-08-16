var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
var DATA_FILE = import_path.default.join(process.cwd(), "data_store.json");
app.get("/api/store", (req, res) => {
  try {
    if (import_fs.default.existsSync(DATA_FILE)) {
      const data = import_fs.default.readFileSync(DATA_FILE, "utf-8");
      return res.json(JSON.parse(data));
    }
    return res.json({ status: "empty" });
  } catch (error) {
    console.error("Error reading data store:", error);
    return res.status(500).json({ error: "Failed to read store" });
  }
});
app.post("/api/store", (req, res) => {
  try {
    import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), "utf-8");
    return res.json({ success: true });
  } catch (error) {
    console.error("Error writing data store:", error);
    return res.status(500).json({ error: "Failed to save store" });
  }
});
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { persona, userMessage, contextSummary, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured in environment variables."
      });
    }
    const ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    let systemInstruction = "";
    switch (persona) {
      case "Coach":
        systemInstruction = `You are PRIME OS AI Coach \u2014 an elite athletic performance and programming advisor built for Muhammed Roshan (Dubai-based Fitness & Athletic Coach).
Your domain: Calisthenics, Boxing, Kickboxing, CrossFit, Wrestling, Acrobatics, Running, Strength & Conditioning, and Recovery.
Analyze Muhammed's recent workout and recovery logs, sleep, soreness, and physical goals.
Provide concise, actionable advice (e.g. readiness analysis, training adaptations, rest interval suggestions).
When recommending a task or log, explicitly format it like:
ACTION_PROPOSAL: {"type": "task", "title": "...", "priority": "Must Do"}`;
        break;
      case "CFO":
        systemInstruction = `You are PRIME OS CFO \u2014 a personal and business financial intelligence advisor for Muhammed Roshan (INTOKINE, Zaki Wellness, KATBA Athletics).
Your domain: Monthly Recurring Revenue (MRR), cash flow analysis, expense leakage detection, client retention impact on revenue, and savings targets in AED.
Analyze financial entries, MRR, transactions, and goals provided in context.
Provide sharp, strategic financial insights in a clear, tabular/bulleted executive style.
When recommending a task or expense check, explicitly format it like:
ACTION_PROPOSAL: {"type": "task", "title": "...", "priority": "Important"}`;
        break;
      case "Mentor":
        systemInstruction = `You are PRIME OS Mentor \u2014 a high-performance mindset, discipline, and life strategy partner for Muhammed Roshan.
Your domain: Daily discipline, Prime Score trends, night reflections, habit consistency, spiritual focus, and long-term vision.
Provide deep, direct, empathetic yet rigorous feedback on patterns, wins, misses, and habit adherence.
When suggesting an action item, format it like:
ACTION_PROPOSAL: {"type": "task", "title": "...", "priority": "Growth"}`;
        break;
      case "Researcher":
        systemInstruction = `You are PRIME OS Researcher \u2014 a sports science, coaching methodology, and business literature synthesizer.
Your domain: Hypertrophy science, biomechanics, combat sports conditioning, recovery protocols, leadership, and athletic brand building.
Summarize research, answer coaching science questions with evidence-backed clarity, and help build Muhammed's knowledge library.
When suggesting a learning item, format it like:
ACTION_PROPOSAL: {"type": "knowledge", "title": "...", "category": "Research"}`;
        break;
      default:
        systemInstruction = "You are PRIME OS AI Assistant for Muhammed Roshan.";
    }
    const fullPrompt = `Context Summary of User Data:
${JSON.stringify(contextSummary, null, 2)}

User Question:
${userMessage}`;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    const replyText = response.text || "No response received from AI.";
    return res.json({ reply: replyText });
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return res.status(500).json({ error: error?.message || "AI Assistant failed to generate response." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PRIME OS Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
