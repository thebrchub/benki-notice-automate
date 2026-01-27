import api from './api';

export const caseService = {
  // 1. Filter API
  getCases: async (status = '', page = 1, limit = 10) => {
    const params = { page, limit };
    if (status && status !== 'ALL') params.status = status;
    const response = await api.get('/api/cases/filter', { params });
    return response.data;
  },

  // 2. Date Range API [NEW]
  getByDateRange: async (startDate, endDate) => {
    // API expects DD-MM-YYYY, inputs give YYYY-MM-DD
    const formatDate = (date) => {
      const [y, m, d] = date.split('-');
      return `${d}-${m}-${y}`;
    };

    const params = {
      start: formatDate(startDate),
      end: formatDate(endDate)
    };
    
    const response = await api.get('/api/cases/range', { params });
    // This endpoint returns an Array directly, not a paginated object
    return response.data; 
  }
};