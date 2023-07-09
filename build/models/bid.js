"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidType = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
exports.BidType = new mongoose_1.Schema({
    bidId: {
        type: String,
        default: uuid_1.v4,
        unique: true
    },
    rideRequestId: {
        type: String,
        default: uuid_1.v4,
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
