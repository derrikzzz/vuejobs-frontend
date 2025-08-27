const API_BASE_URL = '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Job endpoints
  async getJobs() {
    return this.request('/jobs');
  }

  async getJob(id) {
    return this.request(`/jobs/${id}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: jobData,
    });
  }

  async updateJob(id, jobData) {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: jobData,
    });
  }

  async deleteJob(id) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth endpoints (placeholder)
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
export default apiService;