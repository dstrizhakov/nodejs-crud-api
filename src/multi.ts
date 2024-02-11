import { Database } from 'Database/Database';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import * as http from 'node:http';

export const multi = (port: number, database: Database) => {
  if (cluster.isPrimary) {
    const parallelism = availableParallelism() - 1;
    for (let i = 0; i < parallelism; i++) {
      cluster.fork({ CLUSTER_PORT: port + i });
    }
  }
  const loadBalancer = http.createServer((req, res) => {
    
  });
};
