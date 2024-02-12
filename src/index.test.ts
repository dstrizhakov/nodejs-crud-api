import { config } from 'dotenv';
import { Database } from './Database/Database';

config();

const PORT = process.env.PORT || 3000;
const HOST = `localhost:${PORT}`;