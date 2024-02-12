import { config } from 'dotenv';
import { Database } from './Database/Database';
import { single } from './single';
import { IUser } from 'models/IUser';

config();

const PORT = Number(process.env.PORT || 3000);
const HOST = `localhost`;

const database = new Database();
let close: () => void;

const mockUser: Omit<IUser, 'id'> = {
  username: 'Valera',
  age: 25,
  hobbies: ['js', 'football', 'drinking beer'],
};

const mockUpdateUser: Omit<IUser, 'id'> = {
  username: 'Donald',
  age: 72,
  hobbies: ['cricket', 'watch tv'],
};

beforeAll(async () => {
  close = await single(HOST, PORT, database);
});

afterAll(() => {
  if (typeof close === 'function') {
    close();
  }
});

describe('Tests for crud api', () => {
  let userId: string;

  test('Get all records with a GET api/users request (an empty array is expected)', async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/users`);
    const users = await response.json();
    expect(users).toEqual(expect.arrayContaining([]));
  });

  test('A new object is created by a POST api/users request (a response containing newly created record is expected)', async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUser),
    });

    const user = (await response.json()) as IUser;
    userId = user.id;
    const userWithoutId: Partial<IUser> = { ...user };
    delete userWithoutId.id;
    expect(userWithoutId).toEqual(mockUser);
  });

  test('With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)', async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/users/${userId}`);
    const user = (await response.json()) as IUser;
    const userWithoutId: Partial<IUser> = { ...user };
    delete userWithoutId.id;
    expect(userWithoutId).toEqual(mockUser);
  });

  test('We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id', async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUpdateUser),
    });
    const user = (await response.json()) as IUser;
    expect(user.id).toBe(userId);
    const userWithoutId: Partial<IUser> = { ...user };
    delete userWithoutId.id;
    expect(userWithoutId).toEqual(mockUpdateUser);
  });

  test('With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)', async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/users/${userId}`, {
      method: 'DELETE',
    });

    expect(response.status).toBe(204);
  });

  test('With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)', async () => {
    const response = await fetch(`http://localhost:${PORT}/api/users/${userId}`);
    expect(response.status).toBe(404);
  });
});
