function normalize(line) {
  return line.replace(/\t/g, " ").replace(/\s+/g, " ").trim();
}

// Example: "11.DUAL NATURE..." OR "11. DUAL NATURE..."
function isTopicHeading(line) {
  return /^\d+\.\s*[A-Z]/.test(line);
}

// Question formats:
// 1. Question...
// 1 . Question...
// 1) Question...
// 1 ) Question...
function isQuestionStart(line) {
  return /^\d+\s*[\.\)]\s+/.test(line);
}

// Option formats:
// a) text
// a. text
// a ) text
function isOption(line) {
  return /^[a-dA-D][\.\)]\s+/.test(line);
}

// For inline options in one line
// Example: "a) opt1   b) opt2   c) opt3   d) opt4"
function extractInlineOptions(rawLine) {
  const parts = rawLine.split(/(?=[a-dA-D][\.\)])/g);
  return parts
    .map(p => p.replace(/^[a-dA-D][\.\)]\s*/, "").trim())
    .filter(p => p);
}

// Statement lines:
// I. ...   II. ...   III. ...
function isStatementLine(line) {
  return /^(I|II|III|IV|V)\./.test(line);
}

function parseDocxText(text, sourceFile) {
  const rawLines = text.split("\n").map(l => l.replace(/\r/g, "").trim());
  const lines = rawLines.filter(l => l.length > 0);

  let currentTopic = "General";
  let currentQuestion = null;
  const questions = [];

  function saveQuestion() {
    if (currentQuestion) {
      currentQuestion.text = currentQuestion.text.trim();
      questions.push(currentQuestion);
    }
  }

  for (let raw of lines) {
    const line = normalize(raw);

    // -----------------------------
    // Detect Topic Heading
    // -----------------------------
    if (isTopicHeading(line)) {
      saveQuestion();
      currentTopic = line.replace(/^\d+\.\s*/, "").trim();
      continue;
    }

    // -----------------------------
    // Detect Question Start
    // -----------------------------
    if (isQuestionStart(line)) {
      saveQuestion();
      currentQuestion = {
        topic: currentTopic,
        text: line.replace(/^\d+\s*[\.\)]\s+/, "").trim(),
        options: [],
        sourceFile
      };
      continue;
    }

    // -----------------------------
    // Statement lines (I. II. etc)
    // -----------------------------
    if (currentQuestion && isStatementLine(line)) {
      currentQuestion.text += " " + raw;
      continue;
    }

    // -----------------------------
    // Inline options (multiple in one line)
    // -----------------------------
    if (currentQuestion && raw.match(/[a-dA-D][\.\)]/g)?.length > 1) {
      const opts = extractInlineOptions(raw);
      currentQuestion.options.push(...opts);
      continue;
    }

    // -----------------------------
    // Single option on one line
    // -----------------------------
    if (currentQuestion && isOption(line)) {
      const optionText = raw.replace(/^[a-dA-D][\.\)]\s*/, "").trim();
      currentQuestion.options.push(optionText);
      continue;
    }

    // -----------------------------
    // Otherwise → Part of Question text
    // -----------------------------
    if (currentQuestion) {
      currentQuestion.text += " " + raw;
    }
  }

  // Save final question
  saveQuestion();
  return questions;
}

// Remove duplicates across chapters
function removeDuplicates(questions) {
  const map = new Map();
  for (const q of questions) {
    const key = `${q.topic}::${q.text}`;
    if (!map.has(key)) map.set(key, q);
  }
  return Array.from(map.values());
}

module.exports = {
  parseDocxText,
  removeDuplicates
};
