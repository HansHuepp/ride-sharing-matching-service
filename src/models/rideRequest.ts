import { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface UserRideRequestType {
    userId: string;
    pickupLocation: {
        type: string;
        coordinates: number[];
    };
    dropoffLocation: {
        type: string;
        coordinates: number[];
    };
    rating: number;
    userPublicKey: string;
}


export const RideRequestType = new Schema({
    rideRequestId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    userId: String,
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    dropoffLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
    },
    sharedPrime: String, 
    sharedGenerator: String,
    userPublicKey: String,
});
RideRequestType.index({ pickupLocation: '2dsphere' });
RideRequestType.index({ dropoffLocation: '2dsphere' });
