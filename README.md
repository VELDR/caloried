# Caloried - Meal Planner & Nutrition Tracker App

Caloried is a diet and nutrition tracker app designed to assist users in managing their daily food consumption. The app allows users to log their meals on any given date within a personalized diary, providing a convenient method for tracking their daily recommended calorie and macronutrient intake.

## Key Tech Stack

- React
- Redux Saga
- Express
- Sequelize (MySQL)
- Nivo
- Redis

## Environment Variables

### Backend

```
PORT=8080
SECRET_KEY=dUKG6*&kvD5%$v23r
EMAIL_ADDRESS = melvernardell@gmail.com
PASSWORD = unhe kkoy xgnz ktio

BACKEND_BASE_URL = http://localhost:8080
FRONTEND_BASE_URL = http://localhost:3000

CRYPTOJS_SECRET=O*&DSAiv7w6iaiVAW3

NUTRITIONIX_BASE_URL = https://trackapi.nutritionix.com/v2
NUTRITIONIX_APP_ID = e3fae816
NUTRITIONIX_API_KEY = 3d36eee63f42f5c44a99e25b6b3c7ccb
```

## Frontend Setup

1. Install dependencies:

```
npm install
```

2. Start the application:

```
npm run start
```

## Backend Setup

1. Install dependencies:

```
npm install
```

2. Create the database:

```
npx sequelize-cli db:create
```

3. Migrate the database:

```
npx sequelize-cli db:migrate
```

4. Seed the database:

```
npx sequelize-cli db:seed:all
```

5. Start the development server:

```
npm run dev
```

---
