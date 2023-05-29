"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const rideRequest_1 = require("./routes/rideRequest");
const bidding_1 = require("./routes/bidding");
const health_1 = require("./routes/health");
function registerRoutes(server) {
    server.post('/requestRide', asyncWrapper(rideRequest_1.requestRide));
    server.post('/bid', asyncWrapper(bidding_1.bid));
    server.get('/rideRequests', asyncWrapper(rideRequest_1.getRideRequests));
    server.get('/rideRequest/:rideRequestId', asyncWrapper(rideRequest_1.getRideRequestForUser));
    server.get('/rideRequestForRideProvider/:rideRequestId', asyncWrapper(rideRequest_1.getRideRequestForRideProvider));
    server.post('/setContractAddress/:rideRequestId/:contractAddress', asyncWrapper(rideRequest_1.setContractAddress));
    server.get('/health', asyncWrapper(health_1.health));
}
exports.registerRoutes = registerRoutes;
/**
 * Serves as an async wrapper for an async await function.
 * @param route the async await function.
 */
function asyncWrapper(route) {
    return (req, res) => {
        route(req, res)
            .then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(result.status || 200);
            res.json(result.body);
        })
            .catch((err) => {
            res.status(500);
            res.json({ error: err.message });
        });
    };
}
