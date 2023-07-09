"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyExchangeService = void 0;
const crypto_1 = require("crypto");
class KeyExchangeService {
    generateSharedNumbers() {
        const dh = (0, crypto_1.createDiffieHellman)(256);
        const sharedPrime = dh.getPrime('hex');
        const sharedGenerator = '02'; // Using 2 as the generator
        return { sharedPrime, sharedGenerator };
    }
}
exports.KeyExchangeService = KeyExchangeService;
