"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const express = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./database/config"));
const cronjobs_1 = require("./services/cronjobs");
const server = express();
const cronJobs = new cronjobs_1.CronJobs();
mongoose_1.default
    .connect(config_1.default.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
    console.log(`Running on ENV = ${process.env.NODE_ENV}`);
    console.log('Connected to mongoDB.');
})
    .catch((error) => {
    console.log('Unable to connect.');
    console.log(error);
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Logger
        server.use(express.json());
        server.use(require('cors')());
        // Routes
        (0, routes_1.registerRoutes)(server);
        server.listen(process.env['PORT'] || 8080, () => {
            console.log('Started server.');
        });
        cronJobs.startCronJobs();
        console.log('Started cron jobs.');
    });
}
main().catch((err) => {
    console.log('Shutting down with error: ' + err);
});
