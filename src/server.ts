import { registerRoutes } from './routes';
import express = require('express');
import mongoose from 'mongoose';
import config from './database/config';
import { CronJobs } from './services/cronjobs';

const server = express();
const cronJobs = new CronJobs();

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
      console.log(`Running on ENV = ${process.env.NODE_ENV}`);
      console.log('Connected to mongoDB.');
    })
    .catch((error) => {
      console.log('Unable to connect.');
      console.log(error);
    });

async function main() {
    // Logger
    server.use(express.json());
    server.use(require('cors')());

    // Routes
    registerRoutes(server);

    server.listen(process.env['PORT'] || 8080, () => {
        console.log('Started server.');
    });

    cronJobs.startCronJobs();
    console.log('Started cron jobs.');
}

main().catch((err) => {
    console.log('Shutting down with error: ' + err);
});
