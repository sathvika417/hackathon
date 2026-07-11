import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
export const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = "fp-auth-token";

const TOP_AI_FACTORS = [
  { id: "ai-literacy", name: "AI Literacy", importance: 92, icon: "sparkles", trend: [52, 61, 73, 84, 92] },
  { id: "critical-thinking", name: "Critical Thinking", importance: 88, icon: "brain-circuit", trend: [58, 66, 74, 82, 88] },
  { id: "communication", name: "Communication", importance: 84, icon: "message-circle", trend: [55, 62, 69, 77, 84] },
  { id: "technical-fluency", name: "Technical Fluency", importance: 81, icon: "cpu", trend: [48, 58, 66, 74, 81] },
  { id: "adaptability", name: "Adaptability", importance: 79, icon: "network", trend: [50, 57, 64, 71, 79] },
];

const SCORE_META = [
  { key: "communication", label: "Communication", icon: "message-circle", field: "communication_score" },
  { key: "leadership", label: "Leadership", icon: "crown", field: "leadership_score" },
  { key: "creativity", label: "Creativity", icon: "palette", field: "creativity_score" },
  { key: "technical", label: "Technical", icon: "cpu", field: "technical_score" },
  { key: "learning_ability", label: "Learning", icon: "graduation-cap", field: "learning_score" },
  { key: "ai_exposure", label: "AI Exposure", icon: "sparkles", field: "ai_exposure_score" },
];

export const apiClient = axios.create({
  baseURL: API,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

const makeOccupationId = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const toDisplayScore = (value) => Math.max(0, Math.min(100, Number(value || 0) * 20));

const buildTrend = (probabilityPct) => {
  const base = Math.max(8, probabilityPct * 0.45);
  const mid = Math.min(96, probabilityPct * 0.82);
  return [
    { year: 2025, probability: Number(base.toFixed(1)) },
    { year: 2027, probability: Number((base + (mid - base) * 0.4).toFixed(1)) },
    { year: 2030, probability: Number((base + (mid - base) * 0.8).toFixed(1)) },
    { year: 2035, probability: Number(Math.min(99, probabilityPct).toFixed(1)) },
  ];
};

const buildRadar = (prediction) => [
  { axis: "Communication", value: toDisplayScore(prediction.communication_score) },
  { axis: "Leadership", value: toDisplayScore(prediction.leadership_score) },
  { axis: "Technical", value: toDisplayScore(prediction.technical_score) },
  { axis: "Learning", value: toDisplayScore(prediction.learning_score) },
  { axis: "Creativity", value: toDisplayScore(prediction.creativity_score) },
  { axis: "Business", value: toDisplayScore(prediction.business_score) },
];

const buildPie = (prediction) => {
  const values = [
    { name: "Communication", value: toDisplayScore(prediction.communication_score) },
    { name: "Technical", value: toDisplayScore(prediction.technical_score) },
    { name: "Leadership", value: toDisplayScore(prediction.leadership_score) },
    { name: "Creativity", value: toDisplayScore(prediction.creativity_score) },
    { name: "Learning", value: toDisplayScore(prediction.learning_score) },
    { name: "Business", value: toDisplayScore(prediction.business_score) },
  ];
  const total = values.reduce((sum, item) => sum + item.value, 0) || 1;
  return values.map((item) => ({
    ...item,
    value: Number(((item.value / total) * 100).toFixed(1)),
  }));
};

const buildScoreCards = (prediction) =>
  SCORE_META.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    value: toDisplayScore(prediction[item.field]),
  }));

const buildSkillRecommendations = (skills) =>
  (skills || []).map((name, index) => ({
    id: makeOccupationId(name),
    name,
    learning_weeks: 4 + index * 2,
    difficulty: Math.min(5, 2 + index),
    demand: Math.max(70, 92 - index * 5),
    icon: index % 2 === 0 ? "sparkles" : "code-2",
  }));

const CAREER_ALTERNATIVES = {
  high: [
    {
      id: "ai-product-manager",
      name: "AI Product Manager",
      category: "AI Strategy",
      median_salary_usd: 148000,
      growth_pct_10y: 18.2,
      automation_probability: 34,
      risk_level: "Medium",
    },
    {
      id: "ml-ops-engineer",
      name: "MLOps Engineer",
      category: "AI Infrastructure",
      median_salary_usd: 156000,
      growth_pct_10y: 21.4,
      automation_probability: 29,
      risk_level: "Low",
    },
    {
      id: "cybersecurity-analyst",
      name: "Cybersecurity Analyst",
      category: "Security",
      median_salary_usd: 120000,
      growth_pct_10y: 31.5,
      automation_probability: 25,
      risk_level: "Low",
    },
  ],
  medium: [
    {
      id: "data-product-analyst",
      name: "Data Product Analyst",
      category: "Analytics",
      median_salary_usd: 108000,
      growth_pct_10y: 16.8,
      automation_probability: 31,
      risk_level: "Low",
    },
    {
      id: "automation-consultant",
      name: "Automation Consultant",
      category: "Operations",
      median_salary_usd: 118000,
      growth_pct_10y: 14.5,
      automation_probability: 37,
      risk_level: "Medium",
    },
    {
      id: "ux-researcher",
      name: "UX Researcher",
      category: "Human Insight",
      median_salary_usd: 112000,
      growth_pct_10y: 13.1,
      automation_probability: 28,
      risk_level: "Low",
    },
  ],
  low: [
    {
      id: "ai-team-lead",
      name: "AI Team Lead",
      category: "Leadership",
      median_salary_usd: 162000,
      growth_pct_10y: 17.6,
      automation_probability: 22,
      risk_level: "Low",
    },
    {
      id: "domain-ai-specialist",
      name: "Domain AI Specialist",
      category: "Applied AI",
      median_salary_usd: 134000,
      growth_pct_10y: 19.3,
      automation_probability: 27,
      risk_level: "Low",
    },
    {
      id: "learning-experience-designer",
      name: "Learning Experience Designer",
      category: "Education Tech",
      median_salary_usd: 96000,
      growth_pct_10y: 11.9,
      automation_probability: 30,
      risk_level: "Low",
    },
  ],
};

const buildCareerAlternatives = (riskLevel) => {
  const key = String(riskLevel || "").toLowerCase();
  return CAREER_ALTERNATIVES[key] || CAREER_ALTERNATIVES.medium;
};

const normalizePrediction = (prediction, occupationName) => {
  const probabilityPct = Number((Number(prediction.automation_probability || 0) * 100).toFixed(1));

  return {
    occupation: {
      id: makeOccupationId(occupationName || prediction.occupation),
      name: occupationName || prediction.occupation,
      category: `AI readiness analysis`,
    },
    automation_probability: probabilityPct,
    risk_level: prediction.risk_level,
    score_cards: buildScoreCards(prediction),
    radar: buildRadar(prediction),
    pie: buildPie(prediction),
    trend: buildTrend(probabilityPct),
    top_ai_factors: TOP_AI_FACTORS,
    skill_recommendations: buildSkillRecommendations(prediction.recommended_skills),
    career_alternatives: buildCareerAlternatives(prediction.risk_level),
    insights: [prediction.career_summary],
  };
};

const normalizeUser = (user) => ({
  ...user,
  name: user.full_name,
});

export const fetchOccupations = async () => {
  const { data } = await apiClient.get("/occupations");
  return data.map((item) => ({
    id: makeOccupationId(item.title),
    name: item.title,
    category: item.soc_code || `Job Zone ${item.job_zone ?? "-"}`,
    description: item.description,
    soc_code: item.soc_code,
    job_zone: item.job_zone,
  }));
};

export const predictAutomation = async (payload) => {
  const occupationName = payload.occupation || payload.name;
  const { data } = await apiClient.post("/predict", {
    occupation: occupationName,
  });
  return normalizePrediction(data, occupationName);
};

export const signupUser = async (payload) => {
  const { data } = await apiClient.post("/auth/signup", payload);
  return {
    ...data,
    user: normalizeUser(data.user),
  };
};

export const loginUser = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return {
    ...data,
    user: normalizeUser(data.user),
  };
};

export const logoutUser = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

export const forgotPassword = async (payload) => {
  const { data } = await apiClient.post("/auth/forgot-password", payload);
  return data;
};

export const fetchGoogleConfig = async () => {
  const { data } = await apiClient.get("/auth/google/config");
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get("/profile/me");
  return normalizeUser(data);
};
