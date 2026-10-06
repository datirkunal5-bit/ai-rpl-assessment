const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getAuthHeaders() {
  const token = localStorage.getItem('rpl_token');
  const headers = {
    'Content-IO': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('rpl_token');
  const headers = {
    ...options.headers
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  demoLogin: (role) => request('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
  getCurrentUser: () => request('/auth/me'),

  // Worker
  getWorkerProfile: () => request('/workers/profile'),
  updateWorkerProfile: (profile) => request('/workers/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  getWorkerExperience: () => request('/workers/experience'),
  submitWorkerExperience: (data) => request('/workers/experience', { method: 'POST', body: JSON.stringify(data) }),
  getWorkerDashboardStats: () => request('/workers/dashboard-stats'),

  // AI & Matching
  extractSkills: (payload) => request('/ai/extract-skills', { method: 'POST', body: JSON.stringify(payload) }),
  matchQualifications: (skills) => request('/mapping/match', { method: 'POST', body: JSON.stringify({ skills }) }),
  analyzeEvidence: (payload) => request('/ai/analyze-evidence', { method: 'POST', body: JSON.stringify(payload) }),
  getStandardizedCriteria: () => request('/ai/standardized-criteria'),
  calculateScore: (criteriaScores) => request('/ai/calculate-score', { method: 'POST', body: JSON.stringify({ criteriaScores }) }),

  // Assessments
  getAssessments: () => request('/assessments'),
  getAssessmentById: (id) => request(`/assessments/${id}`),
  updateTaskProgress: (assessmentId, taskId, payload) => request(`/assessments/${assessmentId}/tasks/${taskId}`, { method: 'POST', body: JSON.stringify(payload) }),
  submitAssessment: (assessmentId) => request(`/assessments/${assessmentId}/submit`, { method: 'POST' }),
  submitAssessorScores: (assessmentId, payload) => request(`/assessments/${assessmentId}/scores`, { method: 'POST', body: JSON.stringify(payload) }),

  // Evidence
  uploadEvidence: (formData) => request('/evidence/upload', { method: 'POST', body: formData }),
  reviewEvidence: (evidenceId, payload) => request(`/evidence/${evidenceId}/review`, { method: 'PUT', body: JSON.stringify(payload) }),

  // Competency
  getCompetencyProfile: (workerId) => request(`/competency/${workerId || ''}`),
  getCompetencyByAssessmentId: (assessmentId) => request(`/competency/assessment/${assessmentId}`),

  // Admin
  getAdminStats: () => request('/admin/analytics'),
  getConsistencyAnalytics: () => request('/admin/consistency'),
  getAuditLogs: () => request('/admin/audit-logs'),
  getUsers: () => request('/admin/users'),
  getQualifications: () => request('/admin/qualifications'),
  addQualification: (qp) => request('/admin/qualifications', { method: 'POST', body: JSON.stringify(qp) }),
  updateQualification: (id, qp) => request(`/admin/qualifications/${id}`, { method: 'PUT', body: JSON.stringify(qp) }),
  deleteQualification: (id) => request(`/admin/qualifications/${id}`, { method: 'DELETE' }),

  // Offline Sync
  syncQueue: (queueItems) => request('/sync', { method: 'POST', body: JSON.stringify({ queueItems }) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' })
};
