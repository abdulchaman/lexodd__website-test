import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token if admin is logged in (for preview mode)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Career APIs
export const getCareerPage = () => api.get('/careers/page');
export const getJobs = (showAll = false) => api.get(`/jobs${showAll ? '?showAll=true' : ''}`);
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const submitApplication = (formData) => api.post('/applications', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Case Study APIs
export const getCaseStudies = (showAll = false, featured = false) => {
  const params = new URLSearchParams();
  if (showAll) params.set('showAll', 'true');
  if (featured) params.set('featured', 'true');
  const query = params.toString();
  return api.get(`/case-studies${query ? `?${query}` : ''}`);
};
export const getCaseStudyBySlug = (slug) => api.get(`/case-studies/${slug}`);

// White Paper APIs
export const getWhitePapers = (showAll = false) => api.get(`/white-papers${showAll ? '?showAll=true' : ''}`);
export const getWhitePaperBySlug = (slug) => api.get(`/white-papers/${slug}`);
export const trackDownload = (id) => api.post(`/white-papers/${id}/download`);

// Industry APIs
export const getIndustries = () => api.get('/industries');
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

export default api;
