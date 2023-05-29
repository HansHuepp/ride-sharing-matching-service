import { BidType, RideProviderBidType } from './../models/bid';
import { MatchingService } from './../services/matching-service';
import { ServiceResponse } from '../routes';

export async function bid(req: any):Promise<ServiceResponse<any>>{
    const body: RideProviderBidType = req.body;
    const matchingService = new MatchingService();
    await matchingService.bid({
        rideRequestId: body.rideRequestId,
        rideProviderId: body.rideProviderId,
        amount: body.amount,
        rating: body.rating,
    });
    return { msg: "Bid was successful", status: 200 };
}