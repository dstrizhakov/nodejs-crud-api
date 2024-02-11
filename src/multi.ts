import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import * as http from 'node:http';
import { Database } from 'Database/Database';
import { single } from './single';

export const multi = (host: string, port: number, database: Database) => {
  const initialPort = port;
  if (cluster.isPrimary) {
    const parallelism = availableParallelism() - 1;
    for (let i = 1; i < parallelism; i++) {
      cluster.fork({ CLUSTER_PORT: port + i });
    }

    const loadBalancer = http.createServer((req, res) => {
      try {
        const balansingPort = port + 1 === initialPort + parallelism + 1 ? initialPort + 1 : port + 1;
        const balansingRequest = http.request(
          {
            hostname: host,
            port: balansingPort,
            path: req.url,
            method: req.method,
            headers: {
              'Content-type': 'application/json',
            },
          },
          (balansingResp) => {
            balansingResp.pipe(res);
          },
        );
        req.pipe(balansingRequest);
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ message: (error as Error).message }));
      }
    });

    loadBalancer.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } else {
    const clusterPort = Number(process.env.CLUSTER_PORT || port);
    single(host, clusterPort, database);
  }
};
