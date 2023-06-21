# Appointment management API
This project is an open-source appointment manager RESTful API built with [NodeJS](https://nodejs.org/en/), [ExpressJS](https://expressjs.com/), [JWT](https://github.com/auth0/node-jsonwebtoken), [TypeORM](https://typeorm.io/) and [Typescript](https://www.typescriptlang.org/). It does have a complete authentication system that includes a role middleware, all data that goes through all endpoints are validated using [express-validator](https://express-validator.github.io/docs). 24 hours (also known as one day) before the scheduled date the user will receive an automated email with details about their appointment, the date check is done by a Cron Job that runs every 10 minutes. Feel free to contribute and suggest changes. The full documentation can be found below. :)

## Setting up the project
The project was built using Typescript `v4.9.4` and NodeJS `v18.15.0`. There are two ways to setup this project, you can see both below:

### Setting up through NPM
- Clone this repository
- Duplicate the `.env.example` file, rename it to `.env`, and enter your database and email server credentials
- Run `npm install`
- Run `npm run dev`

### Setting up through Docker
- Clone this repository
- Duplicate the `.env.example` file, rename it to `.env`, and enter your email server credentials
- Run `docker-compose up`

## Authentication route

### `POST` /api/login
Authenticate the user and return a JSON Web Token that should be used in the request header in all endpoints.

Payload example:
```
{
    "email": "john@email.com",
    "password": "123"
}
```

Return example:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

All endpoints are protected in a way that a user can only have access to their data.

## User routes
All user endpoints are protected with authentication and role middlewares. There are currently two roles:
- `1` -> Administrator
- `2` -> Regular user

### `POST` /api/user
Create a new user. Roles allowed: `1` and `2`, all users are assigned with role `2` by default.

Payload example:
```
{
    "name": "John Doe",
    "email": "john@email.com",
    "password": "123"
}
```

### `GET` /api/user
Return all users. Role allowed: `1`.

Return example:
```
[
    {
        "id": 1,
        "name": "John Doe",
        "email": "john@email.com",
        "password": "$2b$10$ouX8AXwZfIBtJbmGqUK3nOxOPhCoGtcQTbXvCLixd.T.kKvmEKTaO",
        "role": 1,
        "created_at": "2022-12-25T19:49:05.009Z",
        "updated_at": "2023-02-18T18:16:39.000Z",
        "deleted_at": null,
        "appointments": []
    },
    {
        "id": 2,
        "name": "Jane Doe",
        "email": "jane@email.com",
        "password": "$2b$10$LdHu8QeZyEYtPh.OPI3Txemoca7OW.aqduRu71mGRkhKflsTzGJyy",
        "role": 2,
        "created_at": "2022-12-31T20:43:29.028Z",
        "updated_at": "2022-12-31T20:43:29.028Z",
        "deleted_at": null,
        "appointments": []
    }
]
```

### `GET` /api/user/:id
Return a specific user, user ID parameter needed. Roles allowed: `1` and `2`.

Return example:
```
{
    "id": 1,
    "name": "John Doe",
    "email": "john@email.com",
    "password": "$2b$10$ouX8AXwZfIBtJbmGqUK3nOxOPhCoGtcQTbXvCLixd.T.kKvmEKTaO",
    "role": 1,
    "created_at": "2022-12-25T19:49:05.009Z",
    "updated_at": "2023-02-18T18:16:39.000Z",
    "deleted_at": null,
    "appointments": []
}
```

### `PATCH` /api/user/:id
Update user details, user ID parameter needed. Roles allowed: `1` and `2`.

Payload example:
```
{
    "name": "Gabriel Martins",
    "email": "gabriel@email.com",
    "password": "1234"
}
```

### `DELETE` /api/user/:id
Delete selected user using soft delete, user ID parameter needed. Roles allowed: `1` and `2`.

Return example:
```
{
    "msg": "User removed successfully!"
}
```

## Appointment routes
All appointment endpoints are protected with authentication and role middlewares. There are currently two roles:
- `1` -> Administrator
- `2` -> Regular user

### `POST` /api/appointment
Create a new appointment. Roles allowed: `1` and `2`. The fields `is_done` and `was_notified` are set `false` by default.

Payload example:
```
{
    "title": "Appointment title",
    "content": "Appointment description.",
    "target_date": "2023-03-28 09:30:00"
}
```

### `GET` /api/appointment
Return a list of appointments created by an authenticated user. Roles allowed: `1` and `2`.

Return example:
```
[
    {
        "id": 1,
        "title": "Appointment title",
        "content": "Appointment description.",
        "is_done": false,
        "target_date": "2023-02-22T03:05:08.000Z",
        "was_notified": true,
        "created_at": "2023-02-18T19:50:15.314Z",
        "updated_at": "2023-02-21T04:19:23.000Z",
        "deleted_at": null,
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@email.com",
            "password": "$2b$10$R4YI09OHGDgGBxrVv8lrrO6H7S.acWzFsQBqW4hCdTBqfoFj1aI6K",
            "role": 1,
            "created_at": "2022-12-25T19:49:05.009Z",
            "updated_at": "2023-02-21T06:59:12.000Z",
            "deleted_at": null
        }
    },
    {
        "id": 2,
        "title": "Another appointment",
        "content": "Another appointment description.",
        "is_done": false,
        "target_date": "2023-02-28T07:31:30.000Z",
        "was_notified": true,
        "created_at": "2023-02-27T07:30:24.134Z",
        "updated_at": "2023-02-27T07:31:30.000Z",
        "deleted_at": null,
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@email.com",
            "password": "$2b$10$R4YI09OHGDgGBxrVv8lrrO6H7S.acWzFsQBqW4hCdTBqfoFj1aI6K",
            "role": 1,
            "created_at": "2022-12-25T19:49:05.009Z",
            "updated_at": "2023-02-21T06:59:12.000Z",
            "deleted_at": null
        }
    }
]
```

### `GET` /api/appointment/:id
Return a specific appointment, the appointment ID parameter is needed. Roles allowed: `1` and `2`.

Return example:
```
{
    "id": 1,
    "title": "Appointment title",
    "content": "Appointment description.",
    "is_done": false,
    "target_date": "2023-02-22T03:05:08.000Z",
    "was_notified": true,
    "created_at": "2023-02-18T19:50:15.314Z",
    "updated_at": "2023-02-21T04:19:23.000Z",
    "deleted_at": null,
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@email.com",
        "password": "$2b$10$R4YI09OHGDgGBxrVv8lrrO6H7S.acWzFsQBqW4hCdTBqfoFj1aI6K",
        "role": 1,
        "created_at": "2022-12-25T19:49:05.009Z",
        "updated_at": "2023-02-21T06:59:12.000Z",
        "deleted_at": null
    }
}
```

### `PATCH` /api/appointment/:id
Update an appointment, the appointment ID parameter is needed. Roles allowed: `1` and `2`.

```
{
    "title": "New appointment title",
    "content": "Updated description.",
    "target_date": "2023-02-29 08:00:00"
}
```

### `DELETE` /api/appointment/:id
Delete selected appointment using soft delete, appointment ID parameter needed. Roles allowed: `1` and `2`.

Return example:
```
{
    "msg": "Appointment removed successfully!"
}
```

# Looking forward
I've plans to implement tests to all API endpoints.

# License
This software is available under the [MIT License](https://opensource.org/license/mit/).