import { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface RideProviderBidType {
    rideRequestId: string;
    rideProviderId: string;
    amount: number;
    rating: number;
    model: String,
    estimatedArrivalTime: Number,
    passengerCount: Number,
    vehiclePublicKey: String;
}  

export const BidType = new Schema({
    bidId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    rideRequestId: {
        type: String,
        default: uuidv4,
        unique: false
    },
    rideProviderId: String,
    amount: Number,
    rating: Number,
    bidPlacedTimestamp: Number,
    model: String,
    estimatedArrivalTime: Number,
    passengerCount: Number,
    vehiclePublicKey: String,
});
