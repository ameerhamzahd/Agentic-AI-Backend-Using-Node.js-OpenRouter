require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeGoal } = require('./ai-agents');

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
        
        res.json
    } catch (error) {
        console.log(error);
    }
})

// ============ SERVER START ============

app.listen(PORT, () => {
    console.log(`AI Task Agent running on http://localhost:${PORT}`);
});