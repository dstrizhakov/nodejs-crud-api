import { Database } from 'Database/Database';
import http from 'node:http';

export const postHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  database: Database,
) => {
  const { url } = req;
  const body: Uint8Array[] = [];
  switch (true) {
    case url === '/api/users':
      req
        .on('data', (chunk) => {
          body.push(chunk);
        })
        .on('end', () => {
          const newUser = JSON.parse(body.toString());
          const user = database.addUser(newUser);
          if (user) {
            res.statusCode = 201;
            res.end(JSON.stringify(user));
          } else {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: 'Body does not contain required fields' }));
          }
        });
      break;
    default:
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Request to non-existing endpoint' }));
  }
};
