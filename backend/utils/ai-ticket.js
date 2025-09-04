import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-2.0-flash",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Ticket Triage Assistant",
    system: `You are an expert AI assistant that processes technical supports tickets.
        Your job is to:
        1. Summarize the issue.
        2. Estimates its priority.
        3. Provide helpful notes and resource links for human moderators.
        4. list relevant technical skills required.

        IMPORTANT:
        - Respond with *only* valid raw JSON.
        - Do NOT include markdown, code fences, comments, or any extra formatting.
        - The format must be a raw JSON object.

        You must respond with ONLY a valid JSON object.
        - Do not wrap in code fences.
        - Do not include explanations.
        - Do not include extra text.
        Return a JSON object that can be directly parsed with JSON.parse().

        Repeat: Do not wrap your output in markdown or code fencess.`,
  });

  const response =
    await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no 
        extra text, header, or markdowns.
        
        Analyze the following support ticket and provide a JSON object with: 

        - summary: A short 1-2 sentence summary of the issue.
        - priority: One of "low", "medium", or "high".
        - helpfulNotes: A detailed technical explaination that a moderator can use to solve this issue. Include useful external links or resources if possible.
        - relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

        Respond ONLY in this JSON format and do not include any other text or markdown in the annwer:

        {
        "summary": "Short summary of the ticket",
        "priority": "high",
        "helpfulNotes": "Here are useful tips...",
        "relatedSkills": ["React", "Node.js"]
        }

        ____

        Ticket information:

        - Title: ${ticket.title}
        - Description: ${ticket.description}
        `);

  // Try to robustly extract raw text from the agent response regardless of shape
  const extractText = (resp) => {
    if (!resp) return null;
    if (typeof resp === "string") return resp;
    if (typeof resp?.output_text === "string") return resp.output_text;
    if (Array.isArray(resp?.output) && resp.output.length > 0) {
      const first = resp.output[0];
      if (typeof first === "string") return first;
      if (typeof first?.content === "string") return first.content;
      if (typeof first?.context === "string") return first.context;
      if (typeof first?.text === "string") return first.text;
    }
    if (resp?.response) return extractText(resp.response);
    return null;
  };

  try {
    let raw = extractText(response) || "";
    let jsonString = raw.trim();

    // Remove code fences if present
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/```(json)?/gi, "").replace(/```/g, "").trim();
    }

    // If there is surrounding text, extract the first JSON object
    const objectMatch = jsonString.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      jsonString = objectMatch[0];
    }

    const parsed = JSON.parse(jsonString);

     // Normalize/validate fields to avoid downstream errors
     const normalizedPriority = ["low", "medium", "high"].includes(String(parsed.priority || "").toLowerCase())
     ? String(parsed.priority).toLowerCase()
     : "medium";

     return {
      summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
      priority: normalizedPriority,
      helpfulNotes: typeof parsed.helpfulNotes === "string" ? parsed.helpfulNotes : "",
      relatedSkills: Array.isArray(parsed.relatedSkills) ? parsed.relatedSkills : [],
    };
  } catch (error) {
    console.error("Failed to parse from AI response", error.message);
    return null; //watch out for this
  }
};

export default analyzeTicket;
