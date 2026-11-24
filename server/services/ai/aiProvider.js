/**
 * Base AI Provider Abstraction Interface
 * All concrete providers (e.g. Gemini, OpenAI) must implement generateResponse.
 */
class AIProvider {
  /**
   * Generate AI completion text from prompt and conversation history
   * @param {Object} options
   * @param {string} options.systemPrompt - System instruction for AI behavior
   * @param {string} options.userMessage - Current user message
   * @param {Array} options.conversation - Previous conversation context [{role: 'user'|'assistant', content: ''}]
   * @returns {Promise<string>}
   */
  async generateResponse({ systemPrompt, userMessage, conversation = [] }) {
    throw new Error('AIProvider generateResponse() method must be implemented by subclass');
  }
}

module.exports = AIProvider;
