import { Database } from 'Database/Database';
import http from 'node:http';
import { loadavg } from 'node:os';
import path from 'node:path';

export const putHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  database: Database,
) => {
  const { url } = req;
  const body: Uint8Array[] = [];
  switch (true) {
    case url?.startsWith('/api/users/'):
      const uuid = path.basename(url as string);
      if (database.isUuid(uuid)) {
        const user = database.getUser(uuid);
        if (user) {
          req
            .on('data', (chunk) => {
              body.push(chunk);
            })
            .on('end', () => {
              const updateUserData = JSON.parse(body.toString());
              const updated = database.updateUser(uuid, updateUserData);
              console.log(updated);
              if (updated) {
                res.statusCode = 201;
                res.end(JSON.stringify(updated));
              } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Body does not contain required fields' }));
              }
            });
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
