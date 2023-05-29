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
exports.setContractAddress = exports.getRideRequestForRideProvider = exports.getRideRequestForUser = exports.getRideRequests = exports.requestRide = void 0;
const matching_service_1 = require("../services/matching-service");
function requestRide(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchingService = new matching_service_1.MatchingService();
        const body = req.body;
        yield matchingService.requestRide({
            userId: body.userId,
            pickupLocation: body.pickupLocation,
            dropoffLocation: body.dropoffLocation,
            rating: body.rating,
        });
        return { msg: "Request was successful", status: 200 };
    });
}
exports.requestRide = requestRide;
function getRideRequests(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchingService = new matching_service_1.MatchingService();
        const rideRequests = yield matchingService.getRideRequests();
        return { msg: "Request was successful", status: 200, body: rideRequests };
    });
}
exports.getRideRequests = getRideRequests;
function getRideRequestForUser(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchingService = new matching_service_1.MatchingService();
        const rideRequest = yield matchingService.getRideRequestForUser(req.params.rideRequestId);
        return { msg: "Request was successful", status: 200, body: rideRequest };
    });
}
exports.getRideRequestForUser = getRideRequestForUser;
function getRideRequestForRideProvider(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchingService = new matching_service_1.MatchingService();
        const rideRequest = yield matchingService.getRideRequestForRideProvider(req.params.rideRequestId);
        return { msg: "Request was successful", status: 200, body: rideRequest };
    });
}
exports.getRideRequestForRideProvider = getRideRequestForRideProvider;
function setContractAddress(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchingService = new matching_service_1.MatchingService();
        yield matchingService.setContractAddress(req.params.rideRequestId, req.params.contractAddress);
        return { msg: "Request was successful", status: 200 };
    });
}
exports.setContractAddress = setContractAddress;
