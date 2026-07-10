"""
Occupation feature dataset used to train the CatBoost automation risk model.

Features (0-100 scale):
    communication      - How much verbal/written interaction the job requires
    leadership         - Managing people, decisions, strategic thinking
    creativity         - Novel problem solving, artistic expression
    technical          - Domain-specific hard skills, engineering, tools
    learning_ability   - Continuous learning demand, adaptability
    ai_exposure        - How exposed the role is to AI-driven change
    manual_dexterity   - Fine motor, hands-on physical work
    social_perception  - Empathy, reading emotions, negotiation

Target: `automation_probability` (0-100) — approximates Frey & Osborne + updated
2024-2026 LLM-era research (McKinsey, Goldman Sachs, OpenAI GPTs paper).
"""

OCCUPATIONS = [
    # id, name, category, features..., automation_probability
    {"id": "software_engineer", "name": "Software Engineer", "category": "Technology",
     "communication": 62, "leadership": 55, "creativity": 78, "technical": 92,
     "learning_ability": 88, "ai_exposure": 90, "manual_dexterity": 20, "social_perception": 48,
     "automation_probability": 48.0, "median_salary_usd": 118000, "growth_pct_10y": 22.0},

    {"id": "ai_engineer", "name": "AI Engineer", "category": "Technology",
     "communication": 60, "leadership": 60, "creativity": 82, "technical": 96,
     "learning_ability": 95, "ai_exposure": 98, "manual_dexterity": 15, "social_perception": 45,
     "automation_probability": 22.0, "median_salary_usd": 165000, "growth_pct_10y": 44.0},

    {"id": "ml_engineer", "name": "Machine Learning Engineer", "category": "Technology",
     "communication": 58, "leadership": 55, "creativity": 80, "technical": 95,
     "learning_ability": 94, "ai_exposure": 96, "manual_dexterity": 15, "social_perception": 42,
     "automation_probability": 25.0, "median_salary_usd": 158000, "growth_pct_10y": 40.0},

    {"id": "cloud_engineer", "name": "Cloud Engineer", "category": "Technology",
     "communication": 60, "leadership": 55, "creativity": 65, "technical": 92,
     "learning_ability": 88, "ai_exposure": 78, "manual_dexterity": 18, "social_perception": 45,
     "automation_probability": 35.0, "median_salary_usd": 135000, "growth_pct_10y": 28.0},

    {"id": "solutions_architect", "name": "Solutions Architect", "category": "Technology",
     "communication": 82, "leadership": 78, "creativity": 78, "technical": 90,
     "learning_ability": 85, "ai_exposure": 70, "manual_dexterity": 12, "social_perception": 72,
     "automation_probability": 18.0, "median_salary_usd": 172000, "growth_pct_10y": 20.0},

    {"id": "bi_analyst", "name": "Business Intelligence Analyst", "category": "Technology",
     "communication": 72, "leadership": 52, "creativity": 62, "technical": 82,
     "learning_ability": 78, "ai_exposure": 82, "manual_dexterity": 15, "social_perception": 60,
     "automation_probability": 42.0, "median_salary_usd": 98000, "growth_pct_10y": 18.0},

    {"id": "data_scientist", "name": "Data Scientist", "category": "Technology",
     "communication": 68, "leadership": 55, "creativity": 78, "technical": 92,
     "learning_ability": 90, "ai_exposure": 92, "manual_dexterity": 15, "social_perception": 55,
     "automation_probability": 30.0, "median_salary_usd": 128000, "growth_pct_10y": 32.0},

    {"id": "cybersecurity_analyst", "name": "Cybersecurity Analyst", "category": "Technology",
     "communication": 65, "leadership": 60, "creativity": 72, "technical": 90,
     "learning_ability": 88, "ai_exposure": 75, "manual_dexterity": 18, "social_perception": 55,
     "automation_probability": 20.0, "median_salary_usd": 122000, "growth_pct_10y": 32.0},

    {"id": "teacher", "name": "Teacher", "category": "Education",
     "communication": 92, "leadership": 78, "creativity": 78, "technical": 45,
     "learning_ability": 80, "ai_exposure": 55, "manual_dexterity": 30, "social_perception": 92,
     "automation_probability": 15.0, "median_salary_usd": 62000, "growth_pct_10y": 8.0},

    {"id": "doctor", "name": "Doctor (Physician)", "category": "Healthcare",
     "communication": 88, "leadership": 78, "creativity": 68, "technical": 92,
     "learning_ability": 92, "ai_exposure": 62, "manual_dexterity": 82, "social_perception": 92,
     "automation_probability": 8.0, "median_salary_usd": 240000, "growth_pct_10y": 12.0},

    {"id": "nurse", "name": "Registered Nurse", "category": "Healthcare",
     "communication": 88, "leadership": 62, "creativity": 55, "technical": 72,
     "learning_ability": 78, "ai_exposure": 45, "manual_dexterity": 85, "social_perception": 95,
     "automation_probability": 12.0, "median_salary_usd": 82000, "growth_pct_10y": 15.0},

    {"id": "lawyer", "name": "Lawyer", "category": "Legal",
     "communication": 95, "leadership": 82, "creativity": 72, "technical": 68,
     "learning_ability": 88, "ai_exposure": 85, "manual_dexterity": 12, "social_perception": 88,
     "automation_probability": 38.0, "median_salary_usd": 148000, "growth_pct_10y": 8.0},

    {"id": "paralegal", "name": "Paralegal", "category": "Legal",
     "communication": 72, "leadership": 42, "creativity": 45, "technical": 55,
     "learning_ability": 62, "ai_exposure": 88, "manual_dexterity": 15, "social_perception": 68,
     "automation_probability": 78.0, "median_salary_usd": 58000, "growth_pct_10y": 1.0},

    {"id": "marketing_manager", "name": "Marketing Manager", "category": "Business",
     "communication": 90, "leadership": 82, "creativity": 88, "technical": 60,
     "learning_ability": 78, "ai_exposure": 82, "manual_dexterity": 15, "social_perception": 82,
     "automation_probability": 30.0, "median_salary_usd": 138000, "growth_pct_10y": 10.0},

    {"id": "designer", "name": "UX/UI Designer", "category": "Design",
     "communication": 78, "leadership": 55, "creativity": 95, "technical": 72,
     "learning_ability": 82, "ai_exposure": 82, "manual_dexterity": 25, "social_perception": 82,
     "automation_probability": 32.0, "median_salary_usd": 105000, "growth_pct_10y": 13.0},

    {"id": "graphic_designer", "name": "Graphic Designer", "category": "Design",
     "communication": 65, "leadership": 45, "creativity": 92, "technical": 68,
     "learning_ability": 72, "ai_exposure": 90, "manual_dexterity": 35, "social_perception": 62,
     "automation_probability": 55.0, "median_salary_usd": 60000, "growth_pct_10y": 3.0},

    {"id": "accountant", "name": "Accountant", "category": "Finance",
     "communication": 65, "leadership": 55, "creativity": 32, "technical": 78,
     "learning_ability": 62, "ai_exposure": 92, "manual_dexterity": 15, "social_perception": 55,
     "automation_probability": 82.0, "median_salary_usd": 78000, "growth_pct_10y": 4.0},

    {"id": "financial_analyst", "name": "Financial Analyst", "category": "Finance",
     "communication": 72, "leadership": 55, "creativity": 55, "technical": 85,
     "learning_ability": 78, "ai_exposure": 88, "manual_dexterity": 12, "social_perception": 60,
     "automation_probability": 48.0, "median_salary_usd": 96000, "growth_pct_10y": 8.0},

    {"id": "bank_teller", "name": "Bank Teller", "category": "Finance",
     "communication": 78, "leadership": 25, "creativity": 15, "technical": 45,
     "learning_ability": 40, "ai_exposure": 90, "manual_dexterity": 45, "social_perception": 68,
     "automation_probability": 92.0, "median_salary_usd": 38000, "growth_pct_10y": -12.0},

    {"id": "mechanical_engineer", "name": "Mechanical Engineer", "category": "Engineering",
     "communication": 62, "leadership": 55, "creativity": 78, "technical": 92,
     "learning_ability": 78, "ai_exposure": 65, "manual_dexterity": 55, "social_perception": 45,
     "automation_probability": 28.0, "median_salary_usd": 102000, "growth_pct_10y": 10.0},

    {"id": "civil_engineer", "name": "Civil Engineer", "category": "Engineering",
     "communication": 65, "leadership": 62, "creativity": 68, "technical": 88,
     "learning_ability": 72, "ai_exposure": 58, "manual_dexterity": 45, "social_perception": 55,
     "automation_probability": 22.0, "median_salary_usd": 92000, "growth_pct_10y": 6.0},

    {"id": "electrician", "name": "Electrician", "category": "Skilled Trades",
     "communication": 55, "leadership": 42, "creativity": 55, "technical": 82,
     "learning_ability": 62, "ai_exposure": 30, "manual_dexterity": 92, "social_perception": 55,
     "automation_probability": 15.0, "median_salary_usd": 62000, "growth_pct_10y": 7.0},

    {"id": "plumber", "name": "Plumber", "category": "Skilled Trades",
     "communication": 52, "leadership": 38, "creativity": 55, "technical": 78,
     "learning_ability": 55, "ai_exposure": 25, "manual_dexterity": 92, "social_perception": 52,
     "automation_probability": 10.0, "median_salary_usd": 60000, "growth_pct_10y": 5.0},

    {"id": "truck_driver", "name": "Truck Driver", "category": "Transportation",
     "communication": 40, "leadership": 22, "creativity": 15, "technical": 42,
     "learning_ability": 38, "ai_exposure": 55, "manual_dexterity": 78, "social_perception": 32,
     "automation_probability": 78.0, "median_salary_usd": 52000, "growth_pct_10y": -5.0},

    {"id": "cashier", "name": "Cashier", "category": "Retail",
     "communication": 62, "leadership": 18, "creativity": 12, "technical": 25,
     "learning_ability": 30, "ai_exposure": 88, "manual_dexterity": 45, "social_perception": 62,
     "automation_probability": 95.0, "median_salary_usd": 28000, "growth_pct_10y": -8.0},

    {"id": "customer_support", "name": "Customer Support Rep", "category": "Service",
     "communication": 82, "leadership": 32, "creativity": 42, "technical": 55,
     "learning_ability": 55, "ai_exposure": 95, "manual_dexterity": 15, "social_perception": 82,
     "automation_probability": 72.0, "median_salary_usd": 40000, "growth_pct_10y": -6.0},

    {"id": "chef", "name": "Chef", "category": "Culinary",
     "communication": 62, "leadership": 78, "creativity": 90, "technical": 78,
     "learning_ability": 72, "ai_exposure": 25, "manual_dexterity": 92, "social_perception": 65,
     "automation_probability": 18.0, "median_salary_usd": 58000, "growth_pct_10y": 12.0},

    {"id": "journalist", "name": "Journalist", "category": "Media",
     "communication": 92, "leadership": 55, "creativity": 88, "technical": 62,
     "learning_ability": 82, "ai_exposure": 92, "manual_dexterity": 15, "social_perception": 82,
     "automation_probability": 58.0, "median_salary_usd": 55000, "growth_pct_10y": -3.0},

    {"id": "product_manager", "name": "Product Manager", "category": "Business",
     "communication": 92, "leadership": 88, "creativity": 82, "technical": 72,
     "learning_ability": 88, "ai_exposure": 78, "manual_dexterity": 12, "social_perception": 88,
     "automation_probability": 22.0, "median_salary_usd": 148000, "growth_pct_10y": 18.0},

    {"id": "psychologist", "name": "Psychologist", "category": "Healthcare",
     "communication": 95, "leadership": 62, "creativity": 72, "technical": 55,
     "learning_ability": 85, "ai_exposure": 45, "manual_dexterity": 12, "social_perception": 98,
     "automation_probability": 8.0, "median_salary_usd": 92000, "growth_pct_10y": 14.0},

    {"id": "hr_manager", "name": "HR Manager", "category": "Business",
     "communication": 92, "leadership": 82, "creativity": 55, "technical": 55,
     "learning_ability": 72, "ai_exposure": 70, "manual_dexterity": 12, "social_perception": 92,
     "automation_probability": 32.0, "median_salary_usd": 118000, "growth_pct_10y": 7.0},

    {"id": "data_entry", "name": "Data Entry Clerk", "category": "Administrative",
     "communication": 35, "leadership": 15, "creativity": 10, "technical": 42,
     "learning_ability": 32, "ai_exposure": 95, "manual_dexterity": 55, "social_perception": 28,
     "automation_probability": 96.0, "median_salary_usd": 34000, "growth_pct_10y": -22.0},

    {"id": "translator", "name": "Translator", "category": "Language",
     "communication": 88, "leadership": 32, "creativity": 68, "technical": 55,
     "learning_ability": 82, "ai_exposure": 96, "manual_dexterity": 12, "social_perception": 78,
     "automation_probability": 82.0, "median_salary_usd": 55000, "growth_pct_10y": -2.0},

    {"id": "sales_manager", "name": "Sales Manager", "category": "Business",
     "communication": 92, "leadership": 88, "creativity": 65, "technical": 55,
     "learning_ability": 72, "ai_exposure": 65, "manual_dexterity": 12, "social_perception": 90,
     "automation_probability": 25.0, "median_salary_usd": 132000, "growth_pct_10y": 5.0},

    {"id": "architect", "name": "Architect", "category": "Design",
     "communication": 72, "leadership": 62, "creativity": 92, "technical": 85,
     "learning_ability": 78, "ai_exposure": 62, "manual_dexterity": 32, "social_perception": 65,
     "automation_probability": 20.0, "median_salary_usd": 88000, "growth_pct_10y": 3.0},
]

FEATURE_COLUMNS = [
    "communication",
    "leadership",
    "creativity",
    "technical",
    "learning_ability",
    "ai_exposure",
    "manual_dexterity",
    "social_perception",
]

# Skill catalog for recommendations (learning time in weeks, difficulty 1-5, demand 0-100)
SKILL_CATALOG = [
    {"id": "prompt_engineering", "name": "Prompt Engineering", "learning_weeks": 4,
     "difficulty": 2, "demand": 96, "icon": "sparkles"},
    {"id": "generative_ai", "name": "Generative AI", "learning_weeks": 10,
     "difficulty": 4, "demand": 98, "icon": "brain-circuit"},
    {"id": "machine_learning", "name": "Machine Learning", "learning_weeks": 16,
     "difficulty": 5, "demand": 92, "icon": "network"},
    {"id": "cloud", "name": "Cloud (AWS/GCP/Azure)", "learning_weeks": 12,
     "difficulty": 4, "demand": 90, "icon": "cloud"},
    {"id": "cybersecurity", "name": "Cybersecurity", "learning_weeks": 14,
     "difficulty": 4, "demand": 88, "icon": "shield"},
    {"id": "business_analytics", "name": "Business Analytics", "learning_weeks": 8,
     "difficulty": 3, "demand": 82, "icon": "bar-chart-3"},
    {"id": "python", "name": "Python", "learning_weeks": 8, "difficulty": 3,
     "demand": 94, "icon": "code-2"},
    {"id": "critical_thinking", "name": "Critical Thinking", "learning_weeks": 6,
     "difficulty": 3, "demand": 86, "icon": "lightbulb"},
    {"id": "data_storytelling", "name": "Data Storytelling", "learning_weeks": 6,
     "difficulty": 3, "demand": 80, "icon": "presentation"},
    {"id": "ai_ethics", "name": "AI Ethics & Governance", "learning_weeks": 5,
     "difficulty": 3, "demand": 76, "icon": "scale"},
]

TOP_AI_FACTORS = [
    {"id": "learning", "name": "Learning Ability", "icon": "graduation-cap",
     "importance": 94, "trend": [40, 55, 68, 78, 88, 94]},
    {"id": "critical", "name": "Critical Thinking", "icon": "lightbulb",
     "importance": 90, "trend": [50, 60, 68, 76, 84, 90]},
    {"id": "creativity", "name": "Creativity", "icon": "palette",
     "importance": 86, "trend": [55, 62, 70, 75, 82, 86]},
    {"id": "communication", "name": "Communication", "icon": "message-circle",
     "importance": 82, "trend": [60, 65, 70, 74, 78, 82]},
    {"id": "technology", "name": "Technology Fluency", "icon": "cpu",
     "importance": 92, "trend": [45, 58, 70, 80, 88, 92]},
]
