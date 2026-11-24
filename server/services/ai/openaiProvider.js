const AIProvider = require('./aiProvider');

class OpenAIProvider extends AIProvider {
  constructor() {
    super();
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  async generateResponse({ systemPrompt, userMessage, conversation = [] }) {
    if (!this.apiKey) {
      console.warn('OPENAI_API_KEY is missing from server .env file.');
      return this.generateFallbackResponse(userMessage, systemPrompt);
    }

    try {
      const messages = [];

      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }

      // Add conversation history
      const recentHistory = conversation.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }

      // Add current user message
      messages.push({
        role: 'user',
        content: userMessage
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API Error:', response.status, errorData);
        throw new Error(errorData?.error?.message || `OpenAI returned status ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply && reply.trim()) {
        return reply.trim();
      }

      throw new Error('Empty response from OpenAI');
    } catch (err) {
      console.error('OpenAI generateResponse failed:', err.message);
      return this.generateFallbackResponse(userMessage, systemPrompt, err.message);
    }
  }

  generateFallbackResponse(userMessage, systemPrompt, errorDetails = '') {
    return `Namaste! I am your Wanderlust India Explorer AI assistant.

I specialize in Indian tourism across all 28 States and 8 Union Territories—from Kashmir to Kanyakumari, Goa to Arunachal Pradesh!

You asked: "${userMessage}"

Key travel highlights across India:
• **North India**: Manali & Spiti (Himachal), Leh & Pangong Tso (Ladakh), Golden Temple (Punjab), Rishikesh & Kedarnath (Uttarakhand), Taj Mahal & Varanasi (Uttar Pradesh).
• **West India**: Royal Palaces of Jaipur & Udaipur (Rajasthan), White Desert Rann of Kutch (Gujarat), Gateway of India & Ajanta-Ellora (Maharashtra), Sun-kissed beaches of Goa.
• **South India**: Tea hills of Munnar & Backwaters of Alleppey (Kerala), Hampi & Coorg (Karnataka), Dravidian temples of Madurai & Ooty (Tamil Nadu), Araku Valley & Vizag (Andhra Pradesh).
• **East & Northeast**: Living Root Bridges of Cherrapunji (Meghalaya), Rhinos of Kaziranga (Assam), Kanchenjunga views in Darjeeling (West Bengal), Monasteries of Tawang & Gangtok (Sikkim).
• **Islands**: Radhanagar Beach (Andaman) & Coral lagoons (Lakshadweep).

Feel free to ask for specific state itineraries, budgets, best times to visit, or hidden gems!`;
  }
}

module.exports = OpenAIProvider;
