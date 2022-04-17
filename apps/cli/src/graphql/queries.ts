import { gql } from '@apollo/client';

export const GET_LATEST_PORTFOLIOS = gql`
  query GET_LATEST_PORTFOLIOS {
    isIngesting
    latestPortfolios {
      token
      amount
    }
  }
`;

export const GET_LATEST_PORTFOLIO_OF_TOKEN = gql`
  query GET_LATEST_PORTFOLIO_OF_TOKEN($token: String!) {
    isIngesting
    latestPortfolio(token: $token) {
      token
      amount
    }
  }
`;

export const GET_PORTFOLIOS_BY_DATE = gql`
  query GET_PORTFOLIOS_BY_DATE($date: String!) {
    isIngesting
    portfoliosByDate(date: $date) {
      token
      amount
    }
  }
`;

export const GET_PORTFOLIO_OF_TOKEN_BY_DATE = gql`
  query GET_PORTFOLIO_OF_TOKEN_BY_DATE($token: String!, $date: String!) {
    isIngesting
    portfolioByDate(token: $token, date: $date) {
      token
      amount
    }
  }
`;
