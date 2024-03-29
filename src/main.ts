import cluster from 'cluster';
import os from 'os';
import bootstrap from './bootstrap';

const numCPUs = process.env.NODE_ENV === 'production' ? os.cpus().length : 1;

if (cluster.isPrimary) {
  console.info(`Primary ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.info(
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`,
    );
    console.info('Starting a new worker');
    cluster.fork();
  });
} else {
  bootstrap().then(() => {
    console.info(`Worker ${process.pid} started`);
  });
}
