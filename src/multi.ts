import cluster from 'node:cluster';
import * as http from 'node:http';
import { Database } from 'Database/Database';
import { single } from './single';

export class LoadBalancer {
  public parallelism: number;
  public initPort: number;
  public host: string;
  private currentPort: number;
  private database: Database;

  constructor(parallelism: number, host: string, initPort: number, database: Database) {
    this.parallelism = parallelism;
    this.initPort = initPort;
    this.host = host;
    this.currentPort = initPort + 1;
    this.database = database;
    this.init();
  }

  private init() {
    if (cluster.isPrimary) {
      for (let i = 1; i < this.parallelism; i++) {
        cluster.fork({ CLUSTER_PORT: this.initPort + i });
      }
      this.startLoadBalancer();
    } else {
      const clusterPort = Number(process.env.CLUSTER_PORT || this.initPort);
      single(this.host, clusterPort, this.database);
    }
  }

  private async startLoadBalancer() {
    const loadBalancer = http.createServer((req, res) => {
      res.setHeader('Content-type', 'application/json');
      try {
        const balansingRequest = http.request(
          {
            hostname: this.host,
            port: this.currentPort,
            path: req.url,
            method: req.method
          },
          (balansingResp) => {
            if (this.currentPort >= this.initPort + this.parallelism - 1) {
              this.currentPort = this.initPort + 1;
            } else {
              this.currentPort += 1;
            }
            console.log(`Piping balansingResp to http://localhost:${this.currentPort}`);
            balansingResp.pipe(res);
          },
        );
        req.pipe(balansingRequest);
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ message: (error as Error).message }));
      }
    });
    loadBalancer.listen(this.initPort, () => {
      console.log(`Server running at http://localhost:${this.initPort}`);
    });
  }
}
