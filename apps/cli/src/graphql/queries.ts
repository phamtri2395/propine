import { gql } from 'graphql-request';

export const GET_INGESTION_STATUS = gql`
  query GET_INGESTION_STATUS {
    isIngesting
  }
`;

export const GET_LATEST_PORTFOLIOS = gql`
  query GET_LATEST_PORTFOLIOS {
    latestPortfolios {
      token
      amount
    }
  }
`;

export const GET_LATEST_PORTFOLIO_OF_TOKEN = gql`
  query GET_LATEST_PORTFOLIO_OF_TOKEN($token: String!) {
    latestPortfolio(token: $token) {
      token
      amount
    }
  }
`;

export const GET_PORTFOLIOS_BY_DATE = gql`
  query GET_PORTFOLIOS_BY_DATE($date: String!) {
    portfoliosByDate(date: $date) {
      token
      amount
    }
  }
`;

export const GET_PORTFOLIO_OF_TOKEN_BY_DATE = gql`
  query GET_PORTFOLIO_OF_TOKEN_BY_DATE($token: String!, $date: String!) {
    portfolioByDate(token: $token, date: $date) {
      token
      amount
    }
  }
`;
