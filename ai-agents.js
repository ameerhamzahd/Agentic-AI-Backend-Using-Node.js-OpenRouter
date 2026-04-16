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

const analyzeGoal = async (goalText, durationDays) => {
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
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You're are an expert personal productivity coach and learning specialist" },
        { role: "user", content: userPrompt }
      ],
      // 0 - 0.2 -> Very deterministic; the model tends to give nearly the same answer for the same question.
      // 0.3 - 0.6 -> Balanced between consistency and creativity.
      // 0.7 - 1 -> More creative and varied responses.
      // 1+ -> Highly random and unpredictable outputs.
      temperature: 0.7
    })

    const content = completion.choices[0].message.content;
    const JSONMatched = content.match(/\{[\s\S]*\}/);

    return JSON.parse(JSONMatched);
  } catch (error) {
    console.log(error)
  }
}

const evaluateProgress = async(goal, completedTasks, totalTasks, days) => {
  const completionRate = ((completedTasks / totalTasks) * 100).toFixed(2);
  const expectedRate = ((days / goal.durationDays) * 100).toFixed(2);
  const onTrack = completionRate >= expectedRate - 10;

  const prompt = `
  Learning Goal: "${goal.title}"
  Duration: "${goal.durationDays} days"
  Days Elapsed: ${days} days
  Task Completion Rate: ${completionRate}
  Expected task completion rate: ${expectedRate}
  Status: ${onTrack ? "ON TRACK" : "BEHIND"}
  
  Generate:
  1. Performance Analysis
  2. Specific Encouragement
  3. Recommend Next Action (just 1-3 lines)
  4. Weekly Tips
  `
}

module.exports = {
  analyzeGoal
}