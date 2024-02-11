import { config } from 'dotenv';
import { Database } from './Database/Database';
import * as http from 'node:http';
import { getHandler } from './handlers/getHandler';
import { postHandler } from './handlers/postHandler';
import { putHandler } from './handlers/putHandler';
import { deleteHandler } from './handlers/deleteHandler';

config();

const PORT = process.env.PORT || 4000;
const database = new Database();
database.initUsers(3);

//single
const server = http.createServer((req, res) => {
  res.setHeader('Content-type', 'application/json');
  try {
    switch (req.method) {
      case 'GET':
        getHandler(req, res, database);
        break;
      case 'POST':
        postHandler(req, res, database);
        break;
      case 'PUT':
        putHandler(req, res, database);
        break;
      case 'DELETE':
        deleteHandler(req, res, database);
        break;
      default:
        res.statusCode = 500;
        res.end(JSON.stringify({ message: `Method ${req.method} is not supported` }));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: (error as Error)?.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
