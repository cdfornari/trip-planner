import { Result } from 'libs/core/utils/result';

export type CryptoPaymentGateway = (
  wallet: string,
  amount: number,
) => Promise<Result<void>>;
