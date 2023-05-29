import { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface UserRideRequestType {
    userId: string;
    pickupLocation: string;
    dropoffLocation: string;
    rating: number;
}

export const RideRequestType = new Schema({
    rideRequestId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    userId: String,
    pickupLocation: String,
    dropoffLocation: String,
    rating: Number,
    auctionStartedTimestamp: Number,
    auctionStatus: {
        type: String,
        enum: ['open', 'determining-winner', 'waiting-for-signature' ,'closed'],
        default: 'open'
    },
    auctionWinner: {
        type: String,
        default: ''
    },
    winningBid: {
        type: Number,
        default: null
    },
    contractAddress: {  
        type: String,
        default: ''
    }
});