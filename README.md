# 🚀 FutureProof AI
### Predict the Future of Jobs in the AI Era

FutureProof AI is an AI-powered Career Intelligence Platform that predicts the probability of an occupation being automated by Artificial Intelligence using Machine Learning.

The platform analyzes occupations using O*NET occupational data and a trained CatBoost Regression model to estimate AI automation risk while providing personalized career insights, AI exposure analysis, and future skill recommendations.

---

## 🌍 Problem Statement

Artificial Intelligence is transforming industries at an unprecedented pace. Students, professionals, and organizations often struggle to understand:

- Which jobs are most vulnerable to AI?
- Which skills will remain valuable?
- How can they prepare for the future job market?

FutureProof AI addresses these challenges by providing data-driven career intelligence.

---

# 💡 Solution

FutureProof AI combines occupational datasets, feature engineering, and machine learning to predict automation probability for hundreds of occupations.

The platform provides:

- 🤖 AI Automation Risk Prediction
- 📊 Career Intelligence Dashboard
- 📈 AI Exposure Analysis
- 🎯 Personalized Skill Recommendations
- 🔍 Occupation Search
- 📉 Interactive Visualizations
- 👤 Secure User Authentication

---

# ✨ Features

## Career Assessment
- Search occupations
- Predict AI automation probability
- AI Risk Level (Low / Medium / High)
- Career Summary

## Career Intelligence
- Communication Score
- Leadership Score
- Creativity Score
- Technical Score
- Learning Score
- Business Score
- Analytical Score
- AI Exposure Score

## Visual Dashboard
- Automation Gauge
- Radar Chart
- Pie Chart
- Progress Indicators
- Interactive Analytics

## Personalized Recommendations
- Future Skills
- Career Alternatives
- Career Insights

## Authentication
- Email & Password Login
- Google Sign In (Ready)
- Forgot Password
- User Profile
- Assessment History

---

# 🧠 Machine Learning Pipeline

```
O*NET Datasets
        │
        ▼
Data Cleaning
        │
        ▼
Feature Engineering
        │
        ▼
Dataset Merging
        │
        ▼
Missing Value Handling
        │
        ▼
CatBoost Regression Model
        │
        ▼
Automation Probability Prediction
```

---

# 📂 Dataset

The project uses multiple O*NET occupational datasets including:

- Occupations
- Skills
- Knowledge
- Work Activities
- Technology Skills
- Job Zones

### Final Dataset

- Total Occupations: **721**
- Engineered Features: **240**
- Target Variable: **Automation Probability**

---

# 🤖 Machine Learning Model

Model Used:

- CatBoost Regressor

Evaluation Metrics:

| Metric | Score |
|---------|-------|
| MAE | 0.1595 |
| RMSE | 0.2082 |
| R² Score | 0.6927 |

---

# 🏗️ Tech Stack

## Frontend

- React
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons

## Backend

- Python
- FastAPI
- SQLAlchemy

## Machine Learning

- CatBoost
- Scikit-Learn
- Pandas
- NumPy
- Joblib

## Database

- MySQL

## Authentication

- JWT Authentication
- Google Authentication (Ready)

---

# 📁 Project Structure

```
FutureProofAI/

backend/
│
├── app.py
├── database.py
├── config.py
├── models.py
├── schemas.py
├── crud.py
├── predict.py
├── auth.py
│
├── routers/
│   ├── auth.py
│   ├── prediction.py
│   ├── occupation.py
│   └── profile.py
│
├── models/
│   ├── best_catboost_model.pkl
│   ├── imputer.pkl
│   └── selected_features.pkl
│
├── data/
│   └── final_dataset.csv
│
frontend/
│
README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/FutureProofAI.git
```

Navigate into the project

```bash
cd FutureProofAI
```

Install backend dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn app:app --reload
```

Frontend

```bash
npm install
npm run dev
```

---

# 🔮 Future Enhancements

- Resume Analysis
- AI Career Chatbot
- Personalized Learning Roadmaps
- Salary Prediction
- Industry Demand Forecasting
- Resume Skill Gap Analysis
- Multi-language Support
- Mobile Application

---

# 📸 Screenshots

> Add screenshots of:

- Landing Page
- Login Page
- Dashboard
- Prediction Results
- Analytics Charts

---

# 👥 Team

Developed as part of a Predictive Analytics Hackathon.

Team Members:

- Member 1
- Member 2
- Member 3

---

# 🎯 Track

**Predictive Analytics**

---

# 📜 License

This project is developed for educational and hackathon purposes.

---

# ⭐ Acknowledgements

- O*NET Database
- CatBoost
- FastAPI
- React
- Scikit-Learn
- Pandas
- NumPy

---

## 🌟 Vision

> "Empowering individuals to make informed career decisions by leveraging Artificial Intelligence and Predictive Analytics."

FutureProof AI helps users understand the future of work and prepare for the evolving AI-driven job market.
