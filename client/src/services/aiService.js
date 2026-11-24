import API from './api';

export const aiService = {
  chat: async (message, conversation = [], conversationId = null) => {
    const response = await API.post('/ai/chat', {
      message,
      conversation,
      conversationId
    });
    return response.data;
  },

  getStateTouristPlaces: async (state) => {
    const response = await API.post('/ai/state-tourist-places', { state });
    return response.data;
  },

  getConversations: async () => {
    const response = await API.get('/ai/conversations');
    return response.data;
  },

  getConversationById: async (id) => {
    const response = await API.get(`/ai/conversations/${id}`);
    return response.data;
  },

  deleteConversation: async (id) => {
    const response = await API.delete(`/ai/conversations/${id}`);
    return response.data;
  },

  saveTrip: async (tripData) => {
    const response = await API.post('/ai/saved-trips', tripData);
    return response.data;
  },

  getSavedTrips: async () => {
    const response = await API.get('/ai/saved-trips');
    return response.data;
  },

  deleteSavedTrip: async (id) => {
    const response = await API.delete(`/ai/saved-trips/${id}`);
    return response.data;
  }
};
