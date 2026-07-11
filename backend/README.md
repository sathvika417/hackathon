# FutureProof AI Backend

Production-ready FastAPI backend for FutureProof AI with:

- FastAPI REST APIs
- MySQL via SQLAlchemy ORM
- JWT authentication
- token-based password reset
- Google OAuth configuration scaffolding
- CatBoost prediction service loaded once at startup

## Project Structure

```text
backend/
  app/
    auth.py
    config.py
    crud.py
    database.py
    models.py
    predict.py
    schemas.py
    utils.py
    routers/
      auth.py
      occupation.py
      prediction.py
      profile.py
  data/
    final_dataset.csv
  models/
    best_catboost_model.pkl
    imputer.pkl
    selected_features.pkl
  main.py
  requirements.txt
  .env.example
```

## Setup

1. Create a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and update values.
4. Ensure MySQL is running and the `futureproof_ai` database exists.
5. Start the API:

```bash
uvicorn main:app --reload
```

The app will be available at `http://localhost:8000`.

## API Endpoints

- `GET /`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/google/config`
- `GET /api/occupations`
- `GET /api/occupations/search?q=teacher`
- `GET /api/occupation/{occupation_name}`
- `POST /api/predict`
- `GET /api/profile/me`
- `GET /api/profile/assessments`
- `GET /api/profile/saved-occupations`
- `POST /api/profile/saved-occupations`
- `DELETE /api/profile/saved-occupations/{occupation_name}`

## Notes

- The prediction service loads the model, imputer, selected features, and CSV dataset once during startup.
- Calling `POST /api/predict` with a valid bearer token will also store that prediction in assessment history.
- Logout is implemented through token revocation storage in MySQL so protected routes reject revoked tokens.
