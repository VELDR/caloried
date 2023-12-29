## Routes

| Path                        | Name          | Protected | Admin Only | Component     | Layout            |
| --------------------------- | ------------- | --------- | ---------- | ------------- | ----------------- |
| `/`                         | LandingPage   | No        | No         | LandingPage   | LandingPageLayout |
| `/sign-up`                  | SignUp        | No        | No         | SignUp        | AuthLayout        |
| `/sign-in`                  | SignIn        | No        | No         | SignIn        | AuthLayout        |
| `/diary`                    | Diary         | Yes       | No         | Diary         | MainLayout        |
| `/search`                   | FoodSearch    | Yes       | No         | FoodSearch    | MainLayout        |
| `/food/:foodType/:foodName` | FoodDetails   | Yes       | No         | FoodDetails   | MainLayout        |
| `/profile`                  | Profile       | Yes       | No         | Profile       | MainLayout        |
| `/dashboard`                | Dashboard     | Yes       | No         | Dashboard     | MainLayout        |
| `/admin`                    | Admin         | Yes       | Yes        | Admin         | AdminLayout       |
| `/:token/reset-password`    | ResetPassword | No        | No         | ResetPassword | AuthLayout        |
| `*`                         | Not Found     | No        | No         | NotFound      | MainLayout        |

---

## Setup locally

1. Install dependencies:

```
npm install
```

2. Start the application:

```
npm run start
```

---

## Testing

To run tests, use the following command:

```
npm test
```
