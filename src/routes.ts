
import { Express, Request, Response } from 'express';

import { requestRide } from './routes/requestRide';
import { bid } from './routes/bid';

export function registerRoutes(server: Express) {
    server.post('/requestRide', asyncWrapper(requestRide));
    server.post('/bid', asyncWrapper(bid));
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
