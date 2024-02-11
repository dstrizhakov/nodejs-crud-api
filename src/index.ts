import {Database} from "./Database/Database";

console.log('Hello from ts!');
let database = new Database();

database.initUsers(5);

console.log(database.getUsers())