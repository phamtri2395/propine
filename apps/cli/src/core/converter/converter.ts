import fetch from 'cross-fetch';

import { Config } from '../../common/config';
import { Scalars, Portfolio } from '../../graphql';

type ConvertedPortfolio = Portfolio & {
  usd: Scalars['Float'];
};

const buildCryptoCompareUrl = (token: string): string => `${Config.cryptoCompareEndpoint}?fsym=${token}&tsyms=USD`;

export const convertPortfolio = async (portfolio: Portfolio): Promise<ConvertedPortfolio> => {
  const { token, amount } = portfolio;

  const response = await fetch(buildCryptoCompareUrl(token));
  const { USD }: { USD: number } = await response.json();

  return {
    ...portfolio,
    usd: USD * amount,
  };
};
