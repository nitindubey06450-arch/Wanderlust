import API from './api';

export const destinationService = {
  getDestinations: async (params = {}) => {
    const response = await API.get('/destinations', { params });
    return response.data;
  },

  getMyPlaces: async () => {
    const response = await API.get('/destinations/my-places');
    return response.data;
  },

  getDestinationById: async (id) => {
    const response = await API.get(`/destinations/${id}`);
    return response.data;
  },

  createDestination: async (data) => {
    const response = await API.post('/destinations', data);
    return response.data;
  },

  updateDestination: async (id, data) => {
    const response = await API.put(`/destinations/${id}`, data);
    return response.data;
  },

  deleteDestination: async (id) => {
    const response = await API.delete(`/destinations/${id}`);
    return response.data;
  },

  // Favorites
  getFavorites: async () => {
    const response = await API.get('/users/favorites');
    return response.data;
  },

  addFavorite: async (destinationId) => {
    const response = await API.post(`/users/favorites/${destinationId}`);
    return response.data;
  },

  removeFavorite: async (destinationId) => {
    const response = await API.delete(`/users/favorites/${destinationId}`);
    return response.data;
  },

  removeBulkFavorites: async (destinationIds) => {
    const response = await API.post('/users/favorites/bulk-delete', { destinationIds });
    return response.data;
  },

  clearAllFavorites: async () => {
    const response = await API.delete('/users/favorites-all');
    return response.data;
  },

  // Reviews
  getReviews: async (destinationId) => {
    const response = await API.get(`/destinations/${destinationId}/reviews`);
    return response.data;
  },

  addReview: async (destinationId, reviewData) => {
    const response = await API.post(`/destinations/${destinationId}/reviews`, reviewData);
    return response.data;
  }
};
