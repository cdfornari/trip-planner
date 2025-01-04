import { probability } from 'libs/core/utils/random';
import { CryptoPaymentGateway } from '../application/payment-gateway';
import { Result } from 'libs/core/utils/result';

export const CryptoPaymentGatewayServiceSimulation =
  (): CryptoPaymentGateway => async (wallet: string, amount: number) => {
    if (probability(0.15)) return Result.failure(new Error('PAYMENT_FAILED'));
    return Result.success(undefined);
  };
