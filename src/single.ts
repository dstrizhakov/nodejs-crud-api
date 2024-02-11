import { Database } from './Database/Database';
import * as http from 'node:http';
import { getHandler } from './handlers/getHandler';
import { postHandler } from './handlers/postHandler';
import { putHandler } from './handlers/putHandler';
import { deleteHandler } from './handlers/deleteHandler';

export const single = async(port: number, database: Database) => {

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
      
      server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
      });
      return () => server.close();
} 