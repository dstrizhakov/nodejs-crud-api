import { config } from 'dotenv';
import { Database } from './Database/Database';
import * as http from 'node:http';
import path from 'node:path';
import { log } from 'node:console';

config();

const PORT = process.env.PORT || 4000;

const database = new Database();

database.initUsers(5);

//single
const server = http.createServer((req, res) => {
  const { method, url } = req;
  const Url = new URL(url as string, '/');
  console.log(Url);
  res.setHeader('Content-type', 'application/json');
  try {
    switch (true) {
      case method === 'GET' && url === '/api/users':
        const users = database.getUsers();
        console.log(users);
        res.statusCode = 200;
        res.end(JSON.stringify(users));
        break;
      case method === 'GET' && url?.startsWith('/api/users/'):
        const uuid = path.basename(url as string);
        if (database.isUuid(uuid)) {
          const user = database.getUser(uuid);
          if (user) {
            res.statusCode = 200;
            res.end(JSON.stringify(user));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: `User with id: ${uuid} doesn't exist` }));
          }
        } else {
          res.statusCode = 400;
          res.end(JSON.stringify({ message: 'Invalid user id' }));
        }
        break;
      default:
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Request to non-existing endpoint' }));
    }
  } catch (error: unknown) {}
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
