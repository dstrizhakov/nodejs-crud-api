import { Database } from 'Database/Database';
import path from 'node:path';
import http from 'node:http';

export const getHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  database: Database,
) => {
  const { url } = req;
  switch (true) {
    case url === '/api/users':
      const users = database.getUsers();
      res.statusCode = 200;
      res.end(JSON.stringify(users));
      break;
    case url?.startsWith('/api/users/'):
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
};
