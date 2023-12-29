# Server Endpoints

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

---

## Setup locally

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

## Testing

1. Create test database:

```
npx sequelize-cli db:create --env test
```

2. Migrate the test database:

```
npx sequelize-cli db:migrate --env test
```

3. Run the test:

```
npm test
```

---

## Global Response

_Response (500 - Internal Server Error)_

```
{
  "message": "Internal Server Error"
}
```

_Response (400 - Authentication Error)_

```
{
  "message": "User is not authenticated"
}
```

_Response (403 - Admin Authorization Error)_

```
{
  "message": "Access forbidden. Admin authorization required."
}
```

---

# RESTful Endpoints

## Auth Endpoints

### POST /api/auth/register

> Registers a new user.

_Request Body_

```json
{
  "username": "<username>",
  "email": "<email>",
  "password": "<password>",
  "sex": "<sex>",
  "dob": "<dob>",
  "height": "<height>",
  "weight": "<weight>",
  "goal": "<goal>",
  "activityLevel": "<activityLevel>"
}
```

_Response (400)_

```json
{
  "message": "Username or email already exists"
}
```

_Response (201)_

```json
{
  "user": "<user>",
  "message": "Registration Successful! Please verify your email."
}
```

---

### POST api/auth/resend-verification

> Resend email verification OTP

_Request Header_

```
not needed
```

_Request Body_

```json
{
  "email": "<email>"
}
```

_Response (200)_

```json
{
  "message": "Verification OTP resent."
}
```

_Response (400)_

```json
{
  "message": "User not found."
}
{
  "message": "Email already verified."
}
```

---

### POST api/auth/verify-email

> Verify email with OTP

_Request Header_

```json
not needed
```

_Request Body_

```json
{
  "otp": "<verification_otp>",
  "email": "<email>"
}
```

_Response (200)_

```json
{
  "message": "Verification Success!"
}
```

_Response (400)_

```json
{
  "message": "Invalid OTP."
}
{
  "message": "Verification failed. OTP is expired."
}
{
  "message": "User not found."
}
```

---

### POST api/auth/login

> User login

_Request Header_

```json
not needed
```

_Request Body_

```json
{
  "email": "<email>",
  "password": "<password>"
}
```

_Response (200)_

```json
{
  "token": "<auth_token>",
  "firstLogin": false,
  "message": "Successfully signed in!"
}
```

_Response (400)_

```json
{
  "message": "Invalid email or password."
}
{
  "message": "Your email address is not verified. Please check your email for the verification OTP."
}
```

---

### POST api/auth/admin-login

> Admin login

_Request Header_

```json
not needed
```

_Request Body_

```json
{
  "email": "<email>",
  "password": "<password>"
}
```

_Response (200)_

```json
{
  "token": "<auth_token>",
  "message": "Successfully signed in!"
}
```

_Response (400)_

```json
{
  "message": "Invalid email or password."
}
```

---

### POST api/auth/change-password

> Change user password

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Body_

```json
{
  "currentPassword": "<current_password>",
  "newPassword": "<new_password>"
}
```

_Response (200)_

```json
{
  "message": "Password changed successfully"
}
```

_Response (400)_

```json
{
  "message": "Current password is incorrect"
}
```

---

### POST api/auth/forgot-password

> Request to reset password via email

_Request Header_

```json
not needed
```

_Request Body_

```json
{
  "email": "<email>"
}
```

_Response (200)_

```json
{
  "message": "Reset password link sent via email"
}
```

_Response (404)_

```json
{
  "message": "Email not registered."
}
```

---

### POST api/auth/reset-password

> Reset password with provided token

_Request Header_

```json
not needed
```

_Request Body_

```json
{
  "email": "<email>",
  "newPassword": "<new_password>",
  "token": "<reset_password_token>"
}
```

_Response (200)_

```json
{
  "message": "Password reset successful."
}
```

_Response (400)_

```json
{
  "message": "Token expired."
}
{
  "message": "Email not registered."
}
```

---

## Diary Endpoints

### GET /diary/meal

> Get meals for a specific date

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Query Params_

```json
date=<date>
```

_Response (200)_

```json
[
  {
    "id": <meal_id>,
    "date": "<date>",
    "mealType": "<meal_type>",
    "foodLogs": [
    {
      "id": <food_log_id>,
      "quantity": <quantity>,
      "food": {
        "id": <food_id>,
        "name": "<food_name>",
        "servingSize": <serving_size>,
        "servingUnit": "<serving_unit>",
        "image": "<food_image>",
        "calories": <calories>,
        "fat": <fat>,
        "carbs": <carbs>,
        "protein": "protein>
      }
    },
    ...
    ]
  },
  ...
]
```

_Response (404)_

```json
{
  "message": "Meals not found."
}
```

---

### POST /diary/add

> Add food to diary

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Body_

```json
{
  "name": "<food_name>",
  "servingSize": <serving_size>,
  "servingUnit": "<serving_unit>",
  "image": "<food_image>",
  "calories": <calories>,
  "fat": <fat>,
  "carbs": <carbs>,
  "protein": <protein>,
  "quantity": <quantity>,
  "date": "<date>",
  "mealType": "<meal_type>"
}
```

_Response (200)_

```json
{
  "message": "Food added to diary."
}
```

_Response (400)_

```json
{
  "message": "<validation_error_message>"
}
```

---

### PUT /diary/edit/:foodLogId

> Edit food in diary

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Params_

```json
{
  "foodLogId": <food_log_id>
}
```

_Request Body_

```json
{
  "quantity": <quantity>,
  "date": "<date>",
  "mealType": "<meal_type>"
}
```

_Response (200)_

```json
{
  "message": "Meal updated.",
  "updatedFoodLogData": {
    "id": <meal_id>,
    "date": "<date>",
    "mealType": "<meal_type>",
    "foodLogs": [
      {
      "id": <food_log_id>,
      "quantity": <quantity>,
        "food": {
          "id": <food_id>,
          "name": "<food_name>",
          "servingSize": <serving_size>,
          "servingUnit": "<serving_unit>",
          "image": "<food_image>",
          "calories": <calories>,
          "fat": <fat>,
          "carbs": <carbs>,
          "protein": <protein>
        }
      },
      ...
    ]
  }
}
```

_Response (400)_

```json
{
  "message": "<validation_error_message>"
}
```

_Response (404)_

```json
{
  "message": "Meal not found."
}
```

---

### DELETE /diary/delete/:foodLogId

> Delete food from diary

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Params_

```json
{
  "foodLogId": <food_log_id>
}
```

_Response (200)_

```json
{
  "message": "Meal removed."
}
```

_Response (404)_

```json
{
  "message": "Meal not found."
}
```

---

### GET /diary/activity

> Get user's yearly activity

_Request Header_

```json
Authorization: Bearer <token>
```

_Response (200)_

```json
[
  {
    "day": "<formatted_date>",
    "value": <activity_count>
  },
  ...
]
```

_Response (404)_

```json
{
  "message": "No activity found."
}
```

---

### GET /diary/calories-consumed

> Get user's calories consumed over a period

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Query Params_

```json
days=<number_of_days>
```

_Response (200)_

```json
[
  {
    "x": "<formatted_date>",
    "y": <calories_consumed>
  },
  ...
]
```

_Response (404)_

```json
{
  "message": "No data found."
}
```

---

## Food Controller Endpoints

### POST /food/search

> Search and fetch foods

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Body_

```json
{
  "query": "<search_query>",
  "category": "<food_category>"
}
```

_Request Query Params_

```json
page=<page_number>
pageSize=<page_size>
```

_Response (200)_

```json
{
  "totalItems": "<total_items>",
  "items": [
    {
      "id": <food_id>,
      "name": "<food_name>",
      "servingSize": <serving_size>,
      "servingUnit": "<serving_unit>",
      "image": "<food_image>",
      "calories": "<calories>",
      "fat": <fat>,
      "carbs": <carbs>,
      "protein": <protein>,
      "type": "<food_category>"
    },
  ...
  ]
}
```

_Response (400)_

```json
{
  "message": "<validation_error_message>"
}
```

---

### GET /food/:foodType/:foodName

> Fetch details of a specific food

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Params_

```json
{
  "foodType": "<common/branded/custom>",
  "foodName": "<food_name>"
}
```

_Response (200)_

```json
{
  "id": <food_id>,
  "name": "<food_name>",
  "servingSize": <serving_size>,
  "servingUnit": "<serving_unit>",
  "image": "<food_image>",
  "calories": <calories>,
  "fat": <fat>,
  "carbs": <carbs>,
  "protein": <protein>,
  "type": "<food_category>"
}
```

_Response (404)_

```json
{
  "message": "Custom food not found."
}
```

_Response (400)_

```json
{
  "message": "Invalid food type specified."
}
```

---

### POST /food/create

> Create a custom food

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Body_

```json
{
  "name": "<food_name>",
  "servingSize": <serving_size>,
  "servingUnit": "<serving_unit>",
  "calories": <calories>,
  "fat": <fat>,
  "carbs": <carbs>,
  "protein": <protein>
}
```

_Response (201)_

```json
{
  "message": "Food created successfully!",
  "food": {
    "id": <food_id>,
    "name": "<food_name>",
    "servingSize": <serving_size>,
    "servingUnit": "<serving_unit>",
    "image": "<food_image>",
    "calories": <calories>,
    "fat": <fat>,
    "carbs": <carbs>,
    "protein": <protein>,
    "type": "custom"
  }
}
```

_Response (400)_

```json
{
  "message": "<validation_error_message>"
}
```

---

## User Controller Endpoints

### GET /user

> Get user profile information

_Request Header_

```json
Authorization: Bearer <token>
```

_Response (200)_

```json
{
  "id": <user_id>,
  "username": "<username>",
  "email": "<email>",
  "sex": "<sex>",
  "dob": "<date_of_birth>",
  "height": <height>,
  "weight": <weight>,
  "activityLevel": <activity_level>,
  "goal": "<goal>",
  "avatar": "<avatar_url>"
}
```

---

### PUT /user/profile

> Edit user profile

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Body_

```json
{
"username": "<username>",
"email": "<email>",
"sex": "<sex>",
"dob": "<date_of_birth>",
"height": <height>,
"weight": <weight>,
"activityLevel": <activity_level>,
"goal": "<goal>"
}
```

_Response (200)_

```json
{
  "user": {
    "id": <user_id>,
    "username": "<username>",
    "email": "<email>",
    "sex": "<sex>",
    "dob": "<date_of_birth>",
    "height": <height>,
    "weight": <weight>,
    "activityLevel": <activity_level>,
    "goal": "<goal>",
    "avatar": "<avatar_url>"
  },
  "message": "Profile updated successfully!"
}
```

_Response (400)_

```json
{
  "message": "<validation_error_message>"
}
```

_Response (404)_

```json
{
  "message": "User not found."
}
```

---

### GET /user/all

> Get all users paginated

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Query Params_

```json
page=<page_number>
pageSize=<page_size>
sort=<sort_field>
order=<sort_order>
```

_Response (200)_

```json
{
  "total": <total_users>,
  "users": [
    {
      "id": <user_id>,
      "username": "<username>",
      "email": "<email>",
      "sex": "<sex>",
      "dob": "<date_of_birth>",
      "height": <height>,
      "weight": <weight>,
      "activityLevel": <activity_level>,
      "goal": "<goal>",
      "avatar": "<avatar_url>"
    },
    ...
  ],
  "page": <page_number>,
  "pageSize": <page_size>
}
```

_Response (404)_

```json
{
  "message": "No users found."
}
```

---

### DELETE /user/delete/:userId

> Delete a user by ID

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Params_

```json
{
  "userId": "<user_id>"
}
```

_Response (200)_

```json
{
  "deletedUser": {
    "id": <user_id>,
    "username": "<username>",
    "email": "<email>",
    "sex": "<sex>",
    "dob": "<date_of_birth>",
    "height": <height>,
    "weight": <weight>,
    "activityLevel": <activity_level>,
    "goal": "<goal>",
    "avatar": "<avatar_url>"
  },
  "message": "User deleted successfully."
}
```

_Response (404)_

```json
{
  "message": "User not found."
}
```

---

### GET /user/demographic

> Get users by age group

_Request Header_

```json
Authorization: Bearer <token>
```

_Response (200)_

```json
[
  {
    "ageGroup": "<age_group>",
    "male": <male_count>,
    "female": <female_count>
  },
  ...
]
```

---

### GET /user/sex-distribution

> Get user sex distribution

_Request Header_

```json
Authorization: Bearer <token>
```

_Response (200)_

```json
[
  { "id": "Male", "value": <male_count> },
  { "id": "Female", "value": <female_count> }
]
```

---

### GET /user/weight-tracking

> Get user weight entries

_Request Header_

```json
Authorization: Bearer <token>
```

_Request Query Params_

```json
days=<number_of_days>
```

_Response (200)_

```json
[
  {
    "x": "<date>",
    "y": <weight>
  },
  ...
]
```
