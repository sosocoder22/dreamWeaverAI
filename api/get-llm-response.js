// This is your serverless function running on Vercel
const GOOGLE_LLM = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

export default async function handler(req, res) {
  // Check for the correct method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  // Get the API key from the secure environment variables
  const apiKey = process.env.api_key;
  if (!apiKey) {
    return res.status(500).json({ error: "API key is not configured" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const llmResponse = await fetch(`${GOOGLE_LLM}?key=${apiKey}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!llmResponse.ok) {
      const errorData = await llmResponse.json();
      console.error("LLM API Error:", errorData);
      return res.status(llmResponse.status).json({ error: errorData.error.message || "LLM API Error" });
    }

    const data = await llmResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch data from LLM" });
  }
}