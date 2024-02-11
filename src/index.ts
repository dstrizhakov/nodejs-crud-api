import { config, populate } from 'dotenv';
import { Database } from './Database/Database';
import { single } from './single';

config();

const PORT = Number(process.env.PORT) || 3000;
const database = new Database();
database.initUsers(3);

const args = process.argv;

if (args[2] === '--multi') {
  single(PORT, database);
} else {
  single(PORT, database);
}
