const OpenAIProvider = require('./ai/openaiProvider');
const GeminiProvider = require('./ai/geminiProvider');
const Destination = require('../models/Destination');

const SYSTEM_PROMPT = `You are Wanderlust AI, an expert travel consultant powered by OpenAI for Wanderlust India.

Your primary mission is to help travelers explore, plan, and discover amazing tourist places across ALL 28 States and 8 Union Territories of India (from Kashmir to Kanyakumari, Gujarat to Arunachal Pradesh, Andaman to Lakshadweep).

When user asks for tourist places in any Indian state or union territory:
1. Provide a comprehensive, exciting overview of the top tourist destinations in that state.
2. For each destination, mention:
   - Why it is famous & key attractions
   - Best time to visit
   - Ideal trip duration
   - Famous local food & cultural specialties
3. Group places by vibe/type (e.g., Hill Stations, Spiritual/Heritage, Beaches/Lakes, Wildlife/Nature, Adventure).
4. Provide practical travel tips (how to reach, nearest airport/railway station, local transport).

Be enthusiastic, culturally knowledgeable, well-structured with clear headings, bullet points, and emojis.`;

class AIService {
  constructor() {
    const providerType = (process.env.AI_PROVIDER || '').toLowerCase();
    if (providerType === 'gemini' && !process.env.OPENAI_API_KEY) {
      this.provider = new GeminiProvider();
      this.backupProvider = new OpenAIProvider();
    } else {
      // Default to OpenAI as requested
      this.provider = new OpenAIProvider();
      this.backupProvider = new GeminiProvider();
    }
  }

  /**
   * Process chat request with destination database context integration
   */
  async processChat({ message, conversation = [] }) {
    let matchedDestinations = [];
    let fullDbSummaryText = '';

    try {
      const msgLower = message.toLowerCase();

      // Check if user is asking for full database / all destinations / specific states
      const isGeneralOrFullDataQuery =
        msgLower.includes('all') ||
        msgLower.includes('full') ||
        msgLower.includes('database') ||
        msgLower.includes('list') ||
        msgLower.includes('india') ||
        msgLower.includes('states') ||
        msgLower.includes('destinations') ||
        msgLower.includes('tourist');

      if (isGeneralOrFullDataQuery) {
        matchedDestinations = await Destination.find({})
          .sort({ rating: -1 })
          .limit(12)
          .select('name country region category rating estimatedBudget images description attractions bestTimeToVisit');
      } else {
        const words = message.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2);
        
        if (words.length > 0) {
          const regexConditions = words.map(w => ({
            $or: [
              { name: { $regex: w, $options: 'i' } },
              { country: { $regex: w, $options: 'i' } },
              { region: { $regex: w, $options: 'i' } },
              { category: { $regex: w, $options: 'i' } },
              { description: { $regex: w, $options: 'i' } }
            ]
          }));

          matchedDestinations = await Destination.find({ $or: regexConditions.flatMap(c => c.$or) })
            .limit(6)
            .select('name country region category rating estimatedBudget images description attractions bestTimeToVisit');
        }

        if (matchedDestinations.length === 0) {
          matchedDestinations = await Destination.find({})
            .sort({ rating: -1 })
            .limit(5)
            .select('name country region category rating estimatedBudget images description attractions bestTimeToVisit');
        }
      }

      if (matchedDestinations.length > 0) {
        fullDbSummaryText = matchedDestinations.map(d =>
          `- ${d.name} (${d.region}, ${d.country}): Category=${d.category}, Rating=${d.rating}/5, Est Budget=$${d.estimatedBudget}, Best Time=${d.bestTimeToVisit}. Key Attractions: ${d.attractions ? d.attractions.join(', ') : 'N/A'}. Description: ${d.description.substring(0, 150)}...`
        ).join('\n');
      }
    } catch (dbErr) {
      console.warn('Could not retrieve DB destinations for AI context:', dbErr.message);
    }

    const enhancedSystemPrompt = `${SYSTEM_PROMPT}

[CURRENT WANDERLUST VERIFIED PLACES IN DATABASE]:
${fullDbSummaryText || 'Database currently features all 28 States and 8 Union Territories across India.'}

Always highlight these authentic places and recommend visiting them on Wanderlust!`;

    try {
      const response = await this.provider.generateResponse({
        systemPrompt: enhancedSystemPrompt,
        userMessage: message,
        conversation
      });

      return {
        responseText: response,
        matchedDestinations: matchedDestinations.slice(0, 3),
        reply: response,
        recommendations: matchedDestinations.slice(0, 3)
      };
    } catch (err) {
      console.warn('Primary AI provider failed, trying backup provider:', err.message);
      try {
        const fallbackResp = await this.backupProvider.generateResponse({
          systemPrompt: enhancedSystemPrompt,
          userMessage: message,
          conversation
        });
        return {
          responseText: fallbackResp,
          matchedDestinations: matchedDestinations.slice(0, 3),
          reply: fallbackResp,
          recommendations: matchedDestinations.slice(0, 3)
        };
      } catch (backupErr) {
        const fallbackText = this.provider.generateFallbackResponse(message, enhancedSystemPrompt);
        return {
          responseText: fallbackText,
          matchedDestinations: matchedDestinations.slice(0, 3),
          reply: fallbackText,
          recommendations: matchedDestinations.slice(0, 3)
        };
      }
    }
  }

  /**
   * Dedicated State Tourist Places AI Explorer
   * Input: stateName (e.g., 'Rajasthan', 'Kerala', 'Gujarat', 'Uttarakhand')
   * Output: Deep tourist breakdown from OpenAI + matched database destinations
   */
  async getStateTouristPlaces(stateName) {
    if (!stateName || !stateName.trim()) {
      throw new Error('Please provide an Indian State or Union Territory name.');
    }

    const cleanState = stateName.trim();

    // Find all matching destinations in our MongoDB database for this state
    let matchedInDb = [];
    try {
      matchedInDb = await Destination.find({
        $or: [
          { region: { $regex: cleanState, $options: 'i' } },
          { name: { $regex: cleanState, $options: 'i' } },
          { description: { $regex: cleanState, $options: 'i' } }
        ]
      }).select('name region category rating estimatedBudget images description attractions thingsToDo bestTimeToVisit');
    } catch (e) {
      console.error('Error finding destinations for state:', e);
    }

    const prompt = `Give me a comprehensive, detailed guide of ALL top tourist places to visit in the Indian state/UT of "${cleanState}".

Include:
1. 🏛️ Overview of ${cleanState} (Capital, Nickname, Best season to visit)
2. 🌟 Top 6 to 8 Tourist Cities / Destinations with key attractions for each
3. 🌄 Categorized Highlights (Heritage & Palaces, Nature & Hill Stations, Spiritual, Adventure)
4. 🍲 Famous Traditional Foods & Delicacies to try
5. 🚗 How to Reach (Main Airports, Train Hubs, Road routes)
6. 💡 Insider Travel Tips for tourists

Format with clear headers (###), bullet points, and engaging travel-friendly emojis.`;

    let aiGuide = '';
    try {
      aiGuide = await this.provider.generateResponse({
        systemPrompt: SYSTEM_PROMPT,
        userMessage: prompt,
        conversation: []
      });
    } catch (err) {
      console.warn('OpenAI state guide failed, attempting backup:', err.message);
      try {
        aiGuide = await this.backupProvider.generateResponse({
          systemPrompt: SYSTEM_PROMPT,
          userMessage: prompt,
          conversation: []
        });
      } catch (backupErr) {
        aiGuide = `### Tourist Guide for ${cleanState}, India\n\n${cleanState} is one of India's most captivating travel destinations. Explore its incredible heritage, breathtaking landscapes, and rich cultural traditions. Visit our Explore page to see listings across ${cleanState}!`;
      }
    }

    return {
      state: cleanState,
      guide: aiGuide,
      matchedDestinations: matchedInDb
    };
  }
}

module.exports = new AIService();
