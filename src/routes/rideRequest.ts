import { MatchingService } from '../services/matching-service';
import { ServiceResponse } from '../routes';
import { UserRideRequestType } from '../models/rideRequest';

export async function requestRide(req: any):Promise<ServiceResponse<any>>{
    const matchingService = new MatchingService();
    const body: UserRideRequestType = req.body;
    const rideRequest = await matchingService.requestRide({
        userId: body.userId,
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation,
        gridLocation: body.gridLocation,
        rating: body.rating,
        userPublicKey: body.userPublicKey,
        maxUserRating: body.maxUserRating,
        minRating: body.minRating,
        maxPassengers: body.maxPassengers,
        maxWaitingTime: body.maxWaitingTime,
        minPassengerRating: body.minPassengerRating

    });
    console.log(body);
    return { msg:"Request was successful", status: 200, body: rideRequest };
}

export async function getRideRequests(req: any):Promise<ServiceResponse<any>>{
    const matchingService = new MatchingService();
    const rideRequests = await matchingService.getRideRequests();
    return { msg:"Request was successful", status: 200, body: rideRequests };
}

export async function getRideRequestForUser(req: any):Promise<ServiceResponse<any>>{
    const matchingService = new MatchingService();
    const rideRequest = await matchingService.getRideRequestForUser(req.params.rideRequestId);
    return { msg:"Request was successful", status: 200, body: rideRequest };
}

export async function getRideRequestForRideProvider(req: any):Promise<ServiceResponse<any>>{
    const matchingService = new MatchingService();
    const rideRequest = await matchingService.getRideRequestForRideProvider(req.params.rideRequestId);
    return { msg:"Request was successful", status: 200, body: rideRequest };
}

export async function setContractAddress(req: any):Promise<ServiceResponse<any>>{
    const matchingService = new MatchingService();
    await matchingService.setContractAddress(req.params.rideRequestId, req.params.contractAddress);
    return { msg:"Request was successful", status: 200 };
}