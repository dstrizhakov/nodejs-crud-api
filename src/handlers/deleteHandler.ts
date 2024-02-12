import { Database } from 'Database/Database';
import path from 'node:path';
import http from 'node:http';

export const deleteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  database: Database,
) => {
  const { url } = req;
  switch (true) {
    case url?.startsWith('/api/users/'):
      const uuid = path.basename(url as string);
      console.log(uuid);
      if (database.isUuid(uuid)) {
        const result = database.deleteUser(uuid);
        if (result) {
          res.statusCode = 204;
          res.end(JSON.stringify({ message: `User id = ${uuid} was deleted` }));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: `User id = ${uuid} not found in database` }));
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
