import { log } from 'node:console';
import { IUser } from '../models/IUser';
import { v4, validate } from 'uuid';

export class Database {
  private users: IUser[] = [];

  initUsers(count: number) {
    for (let i = 0; i < count; i++) {
      const user: IUser = { id: v4(), username: 'user ' + i, age: 20 + i, hobbies: ['fishing', 'drinking'] };
      this.addUser(user);
    }
  }

  addUser(user: Omit<IUser, 'id'>) {
    if (this.isUserCorrect(user)) {
      const uuid = v4();
      const newUser = {
        id: uuid,
        ...user,
      };
      this.users.push(newUser);
      return newUser;
    }
    return null;
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
      this.users = this.users.filter((user) => user.id !== id);
      return true;
    }
    return false;
  }

  deleteUsers() {
    this.users = [];
  }

  updateUser(id: string, user: Omit<IUser, 'id'>) {
    const userToUpdateIndex = this.users.findIndex((user) => user.id === id);
    if (userToUpdateIndex >= 0) {
      const updatedUser = {
        id,
        ...user,
      };
      this.users[userToUpdateIndex] = updatedUser;
      return updatedUser;
    }
    return null;
  }

  isUuid(uuid: string) {
    return validate(uuid);
  }

  isUserCorrect(user: Omit<IUser, 'id'>) {
    const isUsername = user?.username;
    const isAge = user?.age && typeof Number(user?.age) === 'number';
    const isHobbies = Array.isArray(user?.hobbies);
    return isUsername && isAge && isHobbies;
  }
}
