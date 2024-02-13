import { config } from 'dotenv';
import { Database } from './Database/Database';
import { single } from './single';
import { LoadBalancer } from './multi';
import { availableParallelism } from 'node:os';

config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = `localhost`;
const database = new Database();
// database.initUsers(3); // you can generate users if it needed

const args = process.argv;

if (args[2] === '--multi') {
  const parallelism = availableParallelism() - 1;
  new LoadBalancer(parallelism, HOST, PORT, database);
} else {
  single(HOST, PORT, database);
}
