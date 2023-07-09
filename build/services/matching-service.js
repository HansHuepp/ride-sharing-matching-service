"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingService = void 0;
const bid_1 = require("./../models/bid");
const crypto_1 = require("crypto");
const rideRequest_1 = require("../models/rideRequest");
const key_exchange_service_1 = require("./key-exchange-service");
const mongoose_1 = __importDefault(require("mongoose"));
class MatchingService {
    constructor() {
        this.keyExchangeService = new key_exchange_service_1.KeyExchangeService();
    }
    requestRide(rideRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rideRequestId = (0, crypto_1.randomUUID)();
                const sharedNumbers = this.keyExchangeService.generateSharedNumbers();
                const rideRequestModel = mongoose_1.default.model('RideRequest', rideRequest_1.RideRequestType);
                yield rideRequestModel.create({
                    rideRequestId: rideRequestId,
                    userId: rideRequest.userId,
                    pickupLocation: rideRequest.pickupLocation,
                    dropoffLocation: rideRequest.dropoffLocation,
                    rating: rideRequest.rating,
                    auctionStartedTimestamp: Math.floor(Date.now() / 1000),
                    sharedPrime: sharedNumbers.sharedPrime,
                    sharedGenerator: sharedNumbers.sharedGenerator,
                    userPublicKey: rideRequest.userPublicKey,
                });
                return rideRequestId;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    ;
    bid(bid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bidId = (0, crypto_1.randomUUID)();
                const bidModel = mongoose_1.default.model('Bid', bid_1.BidType);
                const rideRequestModel = mongoose_1.default.model('RideRequest', rideRequest_1.RideRequestType);
                const rideRequest = yield rideRequestModel.findOne({
                    rideRequestId: bid.rideRequestId,
                    auctionStatus: 'open',
                });
                if (!rideRequest) {
                    throw new Error('No corresponding RideRequest document exists');
                }
                if (!this.isAuctionOpen(rideRequest.auctionStartedTimestamp)) {
                    throw new Error('Auction is closed');
                }
                yield bidModel.create({
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
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    ;
    isAuctionOpen(timestamp) {
        const now = Math.floor(Date.now() / 1000);
        if ((now - timestamp) > 30) {
            return false;
        }
        return true;
    }
    updateOpenAuctions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rideRequestModel = mongoose_1.default.model('RideRequest', rideRequest_1.RideRequestType);
                const rideRequests = yield rideRequestModel.find({ auctionStatus: 'open' });
                const rideRequestIdsToUpdate = [];
                for (let rideRequest of rideRequests) {
                    if (!this.isAuctionOpen(rideRequest.auctionStartedTimestamp)) {
                        rideRequestIdsToUpdate.push(rideRequest.rideRequestId);
                    }
                }
                if (rideRequestIdsToUpdate.length > 0) {
                    yield rideRequestModel.updateMany({ rideRequestId: { $in: rideRequestIdsToUpdate } }, { auctionStatus: 'determining-winner' });
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    determineWinner() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rideRequestModel = mongoose_1.default.model('RideRequest', rideRequest_1.RideRequestType);
                const bidModel = mongoose_1.default.model('Bid', bid_1.BidType);
                const rideRequests = yield rideRequestModel.find({ auctionStatus: 'determining-winner' });
                for (let rideRequest of rideRequests) {
                    const bids = yield bidModel.find({ rideRequestId: rideRequest.rideRequestId });
                    if (bids && bids.length > 0) {
                        // Sort the array of bids[].amount in ascending order
                        bids.sort((a, b) => a.amount - b.amount);
                        let winnerBid;
                        let secondHighestBid;
                        // if winnerBid[1] does not exist, then there is only one bid
                        if (bids[1]) {
                            winnerBid = bids[0];
                            secondHighestBid = bids[1];
                        }
                        else {
                            winnerBid = bids[0];
                            secondHighestBid = bids[0];
                        }
                        yield rideRequestModel.updateOne({ rideRequestId: rideRequest.rideRequestId }, { auctionStatus: 'waiting-for-signature', auctionWinner: winnerBid.rideProviderId, winningBid: secondHighestBid.amount });
                    }
                    else {
                        yield rideRequestModel.updateOne({ rideRequestId: rideRequest.rideRequestId }, { auctionStatus: 'waiting-for-signature' });
                    }
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getRideRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rideRequestModel = mongoose_1.default.model('RideRequest', rideRequest_1.RideRequestType);
                const rideRequests = yield rideRequestModel.find({ auctionStatus: 'open' });
                return rideRequests;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getRideRequestForUser(rideRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rideRequestModel = mongoose_1.default.model('RideRequest', rideRequest_1.RideRequestType);
                const rideRequest = yield rideRequestModel.findOne({ rideRequestId: rideRequestId });
                const bidModel = mongoose_1.default.model('Bid', bid_1.BidType);
                const bids = yield bidModel.find({ rideRequestId: rideRequestId });
                return { rideRequest: rideRequest, bid: bids[0] };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getRideRequestForRideProvider(rideRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rideRequestModel = mongoose_1.default.model('RideRequest', rideRequest_1.RideRequestType);
                const rideRequest = yield rideRequestModel.findOne({ rideRequestId: rideRequestId });
                return rideRequest;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    setContractAddress(rideRequestId, contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rideRequestModel = mongoose_1.default.model('RideRequest', rideRequest_1.RideRequestType);
                yield rideRequestModel.updateOne({ rideRequestId: rideRequestId }, { contractAddress: contractAddress, auctionStatus: 'closed' });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.MatchingService = MatchingService;
