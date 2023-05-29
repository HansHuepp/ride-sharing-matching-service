
import { Express, Request, Response } from 'express';

import { requestRide, getRideRequests, getRideRequestForRideProvider, getRideRequestForUser, setContractAddress } from './routes/rideRequest';
import { bid } from './routes/bidding';
import { health } from './routes/health';

export function registerRoutes(server: Express) {
    server.post('/requestRide', asyncWrapper(requestRide));
    server.post('/bid', asyncWrapper(bid));
    server.get('/rideRequests', asyncWrapper(getRideRequests));
    server.get('/rideRequest/:rideRequestId', asyncWrapper(getRideRequestForUser));
    server.get('/rideRequestForRideProvider/:rideRequestId', asyncWrapper(getRideRequestForRideProvider));
    server.post('/setContractAddress/:rideRequestId/:contractAddress', asyncWrapper(setContractAddress));
    server.get('/health', asyncWrapper(health));
}

export interface ServiceResponse<T> {
    body?: T | null;
    msg?: string;
    status?: any;
}

export type RouteType<T> = (req: Request, response: Response) => Promise<ServiceResponse<T>>;

/**
 * Serves as an async wrapper for an async await function.
 * @param route the async await function.
 */
function asyncWrapper<T>(route: RouteType<T>) {
    return (req: Request, res: Response) => {
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
