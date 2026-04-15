require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeGoal } = require('./ai-agents');
const storage = require('./storage');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//API Endpoints
app.post("/api/goals", async (req, res) => {
    try {
        const {goalText, durationDays} = req.body;

        if(!goalText || !durationDays) {
            return res.status(400).json({
                error: "Goal & Duration are required!!!"
            })
        }

        const plan = await analyzeGoal(goalText, durationDays);

        const goal = storage.saveGoal({
            title: goalText,
            durationDays,
            plan,
            status: "active"
        });;

        //SAVE TASKS
        const tasks = storage.saveTasks(goal.id, plan.dailyTasks);

        // INITIAL PROGRESS TRACKING
        storage.saveProgress(goal.id, {
            goalId: goal.id,
            completedTasks: 0,
            totalTasks: tasks.length,
            progressPercentage: 0
        })
        
        res.json(plan);
    } catch (error) {
        console.log(error);
    }
})

app.post("/api/goals/:goalId/evaluate", async(req, res) => {
    try {
        const goal = storage.getGoal(req.params.goalId);

        if(!goal) {
            return res.status(404).json({
                error: "Goal not found!"
            });
        }

        const task = storage.getTasksByGoal(goal.id);
        const completedCount = tasks.filter(t => t.completed).length;
        const started = Math.ceil((Date.now() - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24));

        
    } catch (error) {
        console.log(error);
    }
})

// ============ SERVER START ============

app.listen(PORT, () => {
    console.log(`AI Task Agent running on http://localhost:${PORT}`);
});