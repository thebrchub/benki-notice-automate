import api from './api';

export const caseService = {

  // ✅ UNIFIED FUNCTION: Standardized name 'getCases'
  getCases: async (status = '', page = 1, limit = 10) => {
    const params = { page, limit };

    // Handle Status Mapping (Frontend 'WAITING' -> Backend 'pending')
    if (status && status !== 'ALL') {
        const statusMap = {
            'WAITING': 'pending',
            'PENDING': 'pending',
            'IN_PROGRESS': 'pending',
            'COMPLETED': 'completed',
            'FAILED': 'failed'
        };
        // Use mapped value or fallback to lowercase
        params.status = statusMap[status.toUpperCase()] || status.toLowerCase();
    }
    
    // If status is empty (''), we don't send 'params.status', fetching ALL.
    const response = await api.get('/api/cases/filter', { params });
    return response.data; 
  },

  // DATE RANGE
  getByDateRange: async (startDate, endDate) => {
    const formatDate = (date) => {
      const [y, m, d] = date.split('-');
      return `${d}-${m}-${y}`;
    };

    const response = await api.get('/api/cases/range', {
      params: {
        start: formatDate(startDate),
        end: formatDate(endDate)
      }
    });

    return response.data;
  },

  // UPDATE CASE
  updateCase: async (caseData) => {
    const response = await api.put('/api/cases/update', caseData);
    return response.data;
  }
};