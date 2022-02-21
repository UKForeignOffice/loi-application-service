# How signing in works

1. Pressing the sing in link on the top right redirect to the sign in page on the `loi-user-service`

2. After entering an email, password and pressing the `Sign In` button a POST call is made to `/api/user/sign-in`

3. This endpoint autenticates the user using [passport.js](https://www.passportjs.org/)

4. The `next` and `from` query params can be added to the url:
```
/api/user/sign-in?next=serviceSelector&from=start
```

5. The `from` query param can either be `home` or `start`, this will determine what page the site will go to when the back button is pressed

6. The `next` query param is composed as part of the url that is redirected back to the `loi-application-service` as well as an optional message query string.
```
http://localhost:1337/loading-dashboard?name=serviceSelector
```

7. Once back in the application service the `AuthController.loadDashboard` method is called

8. This adds the user data to the session and checks if there is a `name` value in the query param and redirects the user to the relevant page.