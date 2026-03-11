const buildSystemPrompt = (task) => {
  const base = "You are CampusHub AI Study Helper. Give concise, student-friendly and accurate explanations.";

  if (task === "quiz") {
    return `${base} Create MCQ quizzes with answer keys.`;
  }

  if (task === "summary") {
    return `${base} Summarize notes into key bullet points and revision checklist.`;
  }

  if (task === "programming") {
    return `${base} Explain programming concepts with short examples.`;
  }

  if (task === "exam") {
    return `${base} Provide exam preparation plans with timeline and priority.`;
  }

  return base;
};

const fallbackResponse = (prompt, task) => {
  if (task === "quiz") {
    return `Sample quiz generated for: ${prompt}\n\n1) Question A\nA. Option 1\nB. Option 2\nC. Option 3\nD. Option 4\nAnswer: B`;
  }

  if (task === "summary") {
    return `Summary for: ${prompt}\n- Key concept 1\n- Key concept 2\n- Key concept 3\n- Final quick revision point`;
  }

  return `Study guidance for: ${prompt}\n\n1. Understand core definitions\n2. Break topic into subtopics\n3. Practice likely exam questions\n4. Revise using spaced repetition`;
};

const askStudyHelper = async (req, res, next) => {
  try {
    const { prompt, task } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        answer: fallbackResponse(prompt, task),
        mode: "fallback",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: buildSystemPrompt(task) },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      return res.status(500).json({ message: `AI request failed: ${message}` });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "No response generated.";

    return res.json({ answer, mode: "openai" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  askStudyHelper,
};
