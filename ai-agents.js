const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

async function main() {
  const completion = await openai.chat.completions.create({
    model: "stepfun/step-3.5-flash:free",
    messages: [
      { role: "user", content: "What is Agentic AI?" }
    ],
  })

  console.log(completion.choices[0].message)
}

const analyzeGoal = async () => {
  const goalText = "Learn python";
  const durationDays = "7";

  const userPrompt = `
  User wants to ${goalText} within ${durationDays} days.
  Create a structured learning/execution plan with:
  1. Main milestones for each day.
  2. Success matrices
  3. Add some potential challenges
  4. Motivational approaches

  RETURN AS JSON WITH THIS STRUCTURE:
  {
    "milestones: ["milestone_01", "milestone_02", "milestone_03"],
    "dailyTasks": [
      {
        "day": 1,
        "title": "..."
        "description": "..."
      }
    ],
    "successMetrics": ["metric_01", "metric_02", "metric_03"],
    "challenges": ["challenge_01", "challenge_02", "challenge_03"],
    "motivationalApproach": "..."
  }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "stepfun/step-3.5-flash:free",
      messages: [
        { role: "user", content: userPrompt }
      ],
    })

    console.log(completion.choices[0].message.content)
  } catch (error) {
    console.log(error)
  }
}

analyzeGoal();