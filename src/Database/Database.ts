import { IUser } from '../models/IUser';
import { v4, validate } from 'uuid';

export class Database {
  private users: IUser[] = [];

  initUsers(count: number) {
    for (let i = 0; i < count; i++) {
      const user: IUser = { id: v4(), username: 'user ' + i, age: 20 + i, hobbies: [] };
      this.addUser(user);
    }
  }

  addUser(user: IUser) {
    const userToAddIndex = this.users.findIndex((userDb) => userDb.id === user.id);
    if (userToAddIndex >= 0) {
      console.error(`User id = ${user.id} is already exits in database`);
    } else {
      this.users.push(user);
    }
  }

  getUser(id: string) {
    const userToGetIndex = this.users.findIndex((user) => user.id === id);
    if (userToGetIndex >= 0) {
      return this.users.find((user) => user.id === id);
    } else {
      console.error(`User id = ${id} not found in database`);
      return null;
    }
  }

  getUsers() {
    return this.users;
  }

  deleteUser(id: string) {
    const userToDeleteIndex = this.users.findIndex((user) => user.id === id);
    if (userToDeleteIndex >= 0) {
      this.users.filter((user) => user.id !== id);
      console.log(`User id = ${id} was deleted`);
    } else {
      console.error(`User id = ${id} not found in database`);
    }
  }

  deleteUsers() {
    this.users = [];
  }

  updateUser(id: string, user: Omit<IUser, 'id'>) {
    const userToUpdateIndex = this.users.findIndex((user) => user.id === id);
    if (userToUpdateIndex >= 0) {
      this.users[userToUpdateIndex] = {
        id,
        ...user,
      };
      console.log(`User id = ${id} updated`);
    } else {
      console.error(`User id = ${id} not found in database`);
    }
  }

  isUuid(uuid: string) {
    return validate(uuid);
  }
}
