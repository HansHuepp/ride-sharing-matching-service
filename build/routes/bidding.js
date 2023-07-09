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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bid = void 0;
const matching_service_1 = require("../services/matching-service");
function bid(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const matchingService = new matching_service_1.MatchingService();
        yield matchingService.bid({
            rideRequestId: body.rideRequestId,
            rideProviderId: body.rideProviderId,
            amount: body.amount,
            rating: body.rating,
            model: body.model,
            estimatedArrivalTime: body.estimatedArrivalTime,
            passengerCount: body.passengerCount,
            vehiclePublicKey: body.vehiclePublicKey,
        });
        return { msg: "Bid was successful", status: 200 };
    });
}
exports.bid = bid;
