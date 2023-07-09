import { createDiffieHellman } from 'crypto';

export class KeyExchangeService {

  generateSharedNumbers() {
    const dh = createDiffieHellman(256);
    const sharedPrime = dh.getPrime('hex');
    const sharedGenerator = '02'; // Using 2 as the generator
    return { sharedPrime, sharedGenerator };    
  }
}