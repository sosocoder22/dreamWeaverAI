// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();
const port = process.env.PORT || 3000;

const api_key = process.env.api_key;
const GOOGLE_LLM = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + api_key;

app.use(express.json());
app.use(cors());

app.post("/get-llm-response", async (req, res) => {
    const { prompt } = req.body;

    try {
        const llmResponse = await fetch(GOOGLE_LLM, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!llmResponse.ok) {
            const errorData = await llmResponse.json();
            // This is the correct placement to log the error
            console.error("LLM API Error:", errorData);
            return res.status(llmResponse.status).json({ error: errorData.error.message || "LLM API Error" });
        }

        const data = await llmResponse.json();
        res.json(data);
    } catch (error) {
        // This catch block only handles network-related errors (e.g., DNS lookup failure)
        console.error("Server Error:", error);
        res.status(500).json({ error: "Failed to fetch data from LLM" });
    }
});

app.listen(port, () => {
    console.log("starting server", port);
});