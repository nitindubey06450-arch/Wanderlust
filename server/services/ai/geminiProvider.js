const { GoogleGenerativeAI } = require('@google/generative-ai');
const AIProvider = require('./aiProvider');

class GeminiProvider extends AIProvider {
  constructor() {
    super();
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async generateResponse({ systemPrompt, userMessage, conversation = [] }) {
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY is missing from server .env file.');
      return this.generateFallbackResponse(userMessage, systemPrompt);
    }

    // List of model candidates to try in order
    const candidateModels = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-2.0-flash',
      'gemini-pro',
      'gemini-1.5-flash'
    ];

    // Format conversation history for Gemini chat format
    const formattedHistory = [];
    const recentHistory = conversation.slice(-10);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        formattedHistory.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }

    // Ensure proper turn-taking (must start with user if history provided)
    while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
      formattedHistory.shift();
    }

    let lastError = null;

    // Try candidate models sequentially until one succeeds
    for (const modelName of candidateModels) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt
        });

        const chat = model.startChat({
          history: formattedHistory
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();
        if (text && text.trim()) {
          return text;
        }
      } catch (err) {
        lastError = err;
        // If error is 404 model not found, try next model candidate silently
        if (err.message && err.message.includes('404')) {
          console.warn(`Model ${modelName} returned 404, trying next candidate...`);
          continue;
        } else {
          console.error(`Gemini API Error with ${modelName}:`, err.message);
          break;
        }
      }
    }

    // Direct REST API fallback call if SDK model names fail
    try {
      const restResponse = await this.callGeminiRESTApi(userMessage, systemPrompt);
      if (restResponse) {
        return restResponse;
      }
    } catch (restErr) {
      console.error('REST API Fallback error:', restErr.message);
    }

    return this.generateFallbackResponse(userMessage, systemPrompt, lastError ? lastError.message : '');
  }

  async callGeminiRESTApi(userMessage, systemPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }]
          }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    }
    return null;
  }

  generateFallbackResponse(userMessage, systemPrompt, errorDetails = '') {
    const msg = userMessage.toLowerCase();
    
    let fallbackText = `### ✈️ Wanderlust AI Travel Assistant\n\nI'm ready to help you plan your next journey! `;

    if (msg.includes('goa')) {
      fallbackText += `\n\n**Sample 5-Day Goa Itinerary:**\n- **Day 1**: Arrive in North Goa, relax at Baga Beach, sunset at Aguada Fort.\n- **Day 2**: Water sports at Calangute & Baga, evening dining in Candolim.\n- **Day 3**: Explore Latin Quarter Fontainhas in Panaji, river cruise on Mandovi River.\n- **Day 4**: Visit South Goa - Palolem beach and Old Goa Basilica of Bom Jesus.\n- **Day 5**: Day trip to Dudhsagar Waterfalls & Spice Plantation tour before departure.\n\n*Estimated Budget:* $400 - $600 per person.\n*Best Time to Visit:* November to February.`;
    } else if (msg.includes('manali')) {
      fallbackText += `\n\n**Sample 4-Day Manali Trip:**\n- **Day 1**: Reach Manali, visit Hadimba Temple, stroll Mall Road & Old Manali cafes.\n- **Day 2**: Full day trip to Solang Valley for paragliding & snow activities.\n- **Day 3**: Excursion to Rohtang Pass or Atal Tunnel and Sissu Village.\n- **Day 4**: Trek to Jogini Waterfalls & Vashisht Hot Springs before departure.\n\n*Estimated Budget:* $350 - $550 per person.\n*Best Season:* October to June.`;
    } else if (msg.includes('kashmir')) {
      fallbackText += `\n\n**Sample 5-Day Kashmir Itinerary:**\n- **Day 1**: Arrive Srinagar, Shikara ride on Dal Lake, night in traditional houseboat.\n- **Day 2**: Day trip to Gulmarg, Gondola cable car ride to Phase 2.\n- **Day 3**: Scenic drive to Pahalgam (Valley of Shepherds), visit Betaab Valley.\n- **Day 4**: Explore Sonamarg (Meadow of Gold) & Thajiwas Glacier.\n- **Day 5**: Visit Mughal Gardens (Shalimar & Nishat Bagh) & craft shopping.\n\n*Estimated Budget:* $600 - $850 per person.`;
    } else {
      fallbackText += `\n\n**Here are great travel suggestions for you:**\n\n1. **India Escapes**: Manali (Mountains), Goa (Beaches), Jaipur (Culture), Kashmir (Nature).\n2. **International Highlights**: Bali, Paris, Tokyo, Dubai, Switzerland, Santorini.\n\n*Tell me your destination, budget, or preferred travel dates to build a custom itinerary!*`;
    }

    if (!process.env.GEMINI_API_KEY) {
      fallbackText += `\n\n> ℹ️ *Note: Add your ` + '`GEMINI_API_KEY`' + ` in ` + '`server/.env`' + ` for full live AI responses.*`;
    }

    return fallbackText;
  }
}

module.exports = GeminiProvider;
