import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

const getCache = new Map();
const CACHE_TTL = 60 * 1000;

const getCacheKey = (config) => {
  const params = config.params ? JSON.stringify(config.params) : '';
  return `${config.baseURL || ''}${config.url || ''}${params}`;
};

// Add token if admin is logged in (for preview mode)
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.request.use((config) => {
  if ((config.method || 'get').toLowerCase() !== 'get' || config.skipCache) return config;

  const key = getCacheKey(config);
  const cached = getCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    config.adapter = () => Promise.resolve({
      data: cached.data,
      status: 200,
      statusText: 'OK',
      headers: cached.headers || {},
      config,
      request: null
    });
  }

  config.metadata = { cacheKey: key };
  return config;
});

api.interceptors.response.use((response) => {
  const method = (response.config?.method || 'get').toLowerCase();
  const key = response.config?.metadata?.cacheKey;
  if (method === 'get' && key && response.status === 200) {
    getCache.set(key, {
      timestamp: Date.now(),
      data: response.data,
      headers: response.headers
    });
  }
  return response;
});

// Career APIs
export const getCareerPage = () => api.get('/careers/page');
export const getJobs = (admin = false) => api.get(`/jobs${admin ? '?admin=true' : ''}`);
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const submitApplication = (formData) => api.post('/applications', formData);

// Case Study APIs
export const getCaseStudies = ({ admin = false, featured = false, industry = '' } = {}) => {
  const params = new URLSearchParams();
  if (admin) params.set('admin', 'true');
  if (featured) params.set('featured', 'true');
  if (industry) params.set('industry', industry);
  const query = params.toString();
  return api.get(`/case-studies${query ? `?${query}` : ''}`);
};
export const getCaseStudyBySlug = (slug) => api.get(`/case-studies/${slug}`);

// White Paper APIs
export const getWhitePapers = ({ admin = false, topic = '' } = {}) => {
  const params = new URLSearchParams();
  if (admin) params.set('admin', 'true');
  if (topic) params.set('topic', topic);
  const query = params.toString();
  return api.get(`/white-papers${query ? `?${query}` : ''}`);
};
export const getWhitePaperBySlug = (slug) => api.get(`/white-papers/${slug}`);
export const trackDownload = (id) => api.post(`/white-papers/${id}/download`);

// Industry APIs
export const getIndustries = (admin = false) => api.get(`/industries${admin ? '?admin=true' : ''}`);
export const getIndustryBySlug = (slug) => api.get(`/industries/${slug}`);

// Tech Stack API
export const getTechStack = () => api.get('/tech-stack');
export const toggleTechStackVisibility = () => api.put('/tech-stack/toggle-visibility');

// How We Work API
export const getHowWeWorkPage = () => api.get('/how-we-work/page');

// SEO
export const updatePageSEO = (pageType, id, seoData) => {
  return api.put(`/${pageType}/${id}/seo`, seoData);
};

// Contact API
export const submitContact = (data) => api.post('/contacts', data);

// Search API
export const searchContent = ({ query, type = 'all', limit = 8 } = {}) => {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (type && type !== 'all') params.set('type', type);
  if (limit) params.set('limit', String(limit));
  return api.get(`/search?${params.toString()}`);
};

export const getPopularSearches = () => api.get('/search/popular');

export default api;
