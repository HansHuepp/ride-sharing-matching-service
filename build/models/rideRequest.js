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
    pickupLocation: String,
    dropoffLocation: String,
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
    }
});
