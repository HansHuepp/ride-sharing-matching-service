import { MatchingService } from './../services/matching-service';
import { ServiceResponse } from '../routes';
import { UserRideRequestType } from '../models/rideRequest';

export async function requestRide(req: any):Promise<ServiceResponse<any>>{
    const matchingService = new MatchingService();
    const body: UserRideRequestType = req.body;
    await matchingService.requestRide({
        userId: body.userId,
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation,
        rating: body.rating,
    });
    return { msg:"Request was successful", status: 200 };
}