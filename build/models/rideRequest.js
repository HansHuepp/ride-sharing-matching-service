"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestType = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
exports.RideRequestType = new mongoose_1.Schema({
    rideRequestId: {
        type: String,
        default: uuid_1.v4,
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
        enum: ['open', 'determining-winner', 'waiting-for-signature', 'closed'],
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
exports.RideRequestType.index({ pickupLocation: '2dsphere' });
exports.RideRequestType.index({ dropoffLocation: '2dsphere' });
