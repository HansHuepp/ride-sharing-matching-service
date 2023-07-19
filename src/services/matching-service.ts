import { BidType, RideProviderBidType } from './../models/bid';
import { randomUUID } from "crypto";
import { RideRequestType, UserRideRequestType } from "../models/rideRequest";
import { KeyExchangeService } from './key-exchange-service';
import mongoose from "mongoose";

export class MatchingService {
  keyExchangeService = new KeyExchangeService();
  
  async requestRide(rideRequest: UserRideRequestType): Promise<any> {
    try {
      const rideRequestId = randomUUID();
      const sharedNumbers: any = this.keyExchangeService.generateSharedNumbers()
      const rideRequestModel = mongoose.model('RideRequest', RideRequestType);
      await rideRequestModel.create({
        rideRequestId: rideRequestId,
        userId: rideRequest.userId,
        pickupLocation: rideRequest.pickupLocation,
        dropoffLocation: rideRequest.dropoffLocation,
        gridLocation: rideRequest.gridLocation,
        rating: rideRequest.rating,
        auctionStartedTimestamp: Math.floor(Date.now() / 1000),
        sharedPrime: sharedNumbers.sharedPrime,
        sharedGenerator: sharedNumbers.sharedGenerator,
        userPublicKey: rideRequest.userPublicKey,
        maxUserRating: rideRequest.maxUserRating,
        minRating: rideRequest.minRating,
        maxPassengers: rideRequest.maxPassengers,
        maxWaitingTime: rideRequest.maxWaitingTime,
        minPassengerRating: rideRequest.minPassengerRating

      });
      return rideRequestId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async bid(bid: RideProviderBidType): Promise<void> {
    try {
      const bidId = randomUUID();
      const bidModel = mongoose.model('Bid', BidType);
      const rideRequestModel = mongoose.model('RideRequest', RideRequestType);
      const rideRequest: any = await rideRequestModel.findOne({ 
        rideRequestId: bid.rideRequestId, 
        auctionStatus: 'open',  
      });
      if (!rideRequest) {
          throw new Error('No corresponding RideRequest document exists');
      }
      if (!this.isAuctionOpen(rideRequest.auctionStartedTimestamp)) {
        throw new Error('Auction is closed');
      }
      await bidModel.create({
        rideRequestId: bid.rideRequestId,
        bidId: bidId,
        rating: bid.rating,
        rideProviderId: bid.rideProviderId,
        amount: bid.amount,
        bidPlacedTimestamp: Math.floor(Date.now() / 1000),
        model: bid.model,
        estimatedArrivalTime: bid.estimatedArrivalTime,
        passengerCount: bid.passengerCount,
        vehiclePublicKey: bid.vehiclePublicKey
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  isAuctionOpen(timestamp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    if ((now - timestamp) > 30) {
      return false;
    }
    return true;
  }

  async updateOpenAuctions(): Promise<void> {
    try {
        const rideRequestModel = mongoose.model('RideRequest', RideRequestType);
        const rideRequests: any = await rideRequestModel.find({ auctionStatus: 'open' });
        const rideRequestIdsToUpdate = [];
        for (let rideRequest of rideRequests) {
            if (!this.isAuctionOpen(rideRequest.auctionStartedTimestamp)) {
                rideRequestIdsToUpdate.push(rideRequest.rideRequestId);
            }
        }
        if (rideRequestIdsToUpdate.length > 0) {
            await rideRequestModel.updateMany({ rideRequestId: { $in: rideRequestIdsToUpdate } }, { auctionStatus: 'determining-winner' });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
  }

  async determineWinner(): Promise<void> {
    try {
        const rideRequestModel = mongoose.model('RideRequest', RideRequestType);
        const bidModel = mongoose.model('Bid', BidType);
        const rideRequests: any = await rideRequestModel.find({ auctionStatus: 'determining-winner' });
        for (let rideRequest of rideRequests) {
            const bids: any = await bidModel.find({ rideRequestId: rideRequest.rideRequestId });
            if (bids && bids.length > 0) {
              // Sort the array of bids[].amount in ascending order
              bids.sort((a: any, b: any) => a.amount - b.amount);           
                let winnerBid: any
                let secondHighestBid: any
                // if winnerBid[1] does not exist, then there is only one bid
                if (bids[1]) {
                    winnerBid = bids[0];
                    secondHighestBid = bids[1];
                } else {
                    winnerBid = bids[0];
                    secondHighestBid = bids[0];
                }

                await rideRequestModel.updateOne({ rideRequestId: rideRequest.rideRequestId }, 
                { auctionStatus: 'waiting-for-signature', auctionWinner: winnerBid.rideProviderId, winningBid: secondHighestBid.amount });
            } else {
                await rideRequestModel.updateOne({ rideRequestId: rideRequest.rideRequestId }, 
                { auctionStatus: 'waiting-for-signature' });
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
  }

  async getRideRequests(): Promise<any> {
    try {
        const rideRequestModel = mongoose.model('RideRequest', RideRequestType);
        const rideRequests: any = await rideRequestModel.find({ auctionStatus: 'open' });
        return rideRequests;
    } catch (error) {
        console.error(error);
        throw error;
    }
  }

  async getRideRequestForUser(rideRequestId: string): Promise<any> {
    try {
        const rideRequestModel = mongoose.model('RideRequest', RideRequestType);
        const rideRequest: any = await rideRequestModel.findOne({ rideRequestId: rideRequestId });
        const bidModel = mongoose.model('Bid', BidType);
        const bids: any = await bidModel.find({ rideRequestId: rideRequestId });
        return {rideRequest: rideRequest, bid: bids[0]};
    } catch (error) {
        console.error(error);
        throw error;
    }
  }

  async getRideRequestForRideProvider(rideRequestId: string): Promise<any> {
    try {
        const rideRequestModel = mongoose.model('RideRequest', RideRequestType);
        const rideRequest: any = await rideRequestModel.findOne({ rideRequestId: rideRequestId });
        return rideRequest;
    } catch (error) {
        console.error(error);
        throw error;
    }
  }


  async setContractAddress(rideRequestId: string, contractAddress: string): Promise<void> {
    try {
        const rideRequestModel = mongoose.model('RideRequest', RideRequestType);
        await rideRequestModel.updateOne({ rideRequestId: rideRequestId }, { contractAddress: contractAddress, auctionStatus: 'closed'});
    } catch (error) {
        console.error(error);
        throw error;
    }
  }



}
