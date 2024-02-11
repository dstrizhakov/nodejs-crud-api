import { Database } from 'Database/Database';
import http from 'node:http';

export const putHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  database: Database,
) => {
  const { url } = req;
  const body: Uint8Array[] = [];
  switch (true) {
    case url === '/api/users':

      break;
    default:
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Request to non-existing endpoint' }));
  }
};
