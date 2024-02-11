import { config, populate } from 'dotenv';
import { Database } from './Database/Database';
import { single } from './single';
import { multi } from './multi';

config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = `localhost`;
const database = new Database();
database.initUsers(3);

const args = process.argv;

if (args[2] === '--multi') {
  multi(HOST, PORT, database);
} else {
  single(HOST, PORT, database);
}
