# Node.js CRUD API
This is implementation simple CRUD API using in-memory database underneath.

- Task implemented on Typescript
- Only nodemon, dotenv, cross-env, typescript, ts-node, ts-node-dev, eslint and its plugins, webpack-cli, webpack and its plugins, prettier, uuid, @types/* as well as libraries are used for testing
- 20.11.0 LTS version of Node.js are used
- asynchronous API

### Application launch:
1) Clone this repository with the command:

```sh 
https://github.com/dstrizhakov/nodejs-crud-api.git
cd nodejs-crud-api
git checkout develop
git pull
```
2) Install dependencies:
```sh
npm install
```
3) Start app using one of this script:
```sh
npm run start:dev
npm run start:multi
npm run format
```
### Production mode:
```sh
npm run start:prod
```
### Application testing:
```sh
npm run test
```
### Check application by ESlint:
```sh
   npm run lint
```
### Check and fix code by Prettier
```sh
npm run format
```

To exit the application, press CTRL+C on the keyboard and confirm the exit.

## About this application

This application supports GET, POST, PUT and DELETE request methods;

Users are stored as `objects` that have following properties:
- `id` — unique identifier (`string`, `uuid`) generated on server side
- `username` — user's name (`string`, **required**)
- `age` — user's age (`number`, **required**)
- `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)

The "id" field is generated by server when the user is created.

### Endpoints:

- **GET** `api/users` is used to get all persons
  - Server should answer with `status code` **200** and all users records
- **GET** `api/users/{userId}`
    - Server should answer with `status code` **200** and record with `id === userId` if it exists
    - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
- **POST** `api/users` is used to create record about new user and store it in database
    - Server should answer with `status code` **201** and newly created record
    - Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
- **PUT** `api/users/{userId}` is used to update existing user
    - Server should answer with` status code` **200** and updated record
    - Server should answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server should answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
- **DELETE** `api/users/{userId}` is used to delete existing user from database
    - Server should answer with `status code` **204** if the record is found and deleted
    - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
- Requests to non-existing endpoints (e.g. `some-non/existing/resource`) 
  - Server answer with `status code` **404** and corresponding human-friendly message)

