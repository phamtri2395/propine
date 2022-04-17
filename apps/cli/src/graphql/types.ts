export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Portfolio = {
  __typename?: 'Portfolio';
  amount: Scalars['Float'];
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  isIngesting: Scalars['Boolean'];
  latestPortfolio: Portfolio;
  latestPortfolios: Array<Portfolio>;
  portfolioByDate: Portfolio;
  portfoliosByDate: Array<Portfolio>;
};

export type QueryLatestPortfolioArgs = {
  token: Scalars['String'];
};

export type QueryPortfolioByDateArgs = {
  date: Scalars['String'];
  token: Scalars['String'];
};

export type QueryPortfoliosByDateArgs = {
  date: Scalars['String'];
};

export type Get_Ingestion_StatusQueryVariables = Exact<{ [key: string]: never }>;

export type Get_Ingestion_StatusQuery = { __typename?: 'Query'; isIngesting: boolean };

export type Get_Latest_PortfoliosQueryVariables = Exact<{ [key: string]: never }>;

export type Get_Latest_PortfoliosQuery = {
  __typename?: 'Query';
  latestPortfolios: Array<{ __typename?: 'Portfolio'; token: string; amount: number }>;
};

export type Get_Latest_Portfolio_Of_TokenQueryVariables = Exact<{
  token: Scalars['String'];
}>;

export type Get_Latest_Portfolio_Of_TokenQuery = {
  __typename?: 'Query';
  latestPortfolio: { __typename?: 'Portfolio'; token: string; amount: number };
};

export type Get_Portfolios_By_DateQueryVariables = Exact<{
  date: Scalars['String'];
}>;

export type Get_Portfolios_By_DateQuery = {
  __typename?: 'Query';
  portfoliosByDate: Array<{ __typename?: 'Portfolio'; token: string; amount: number }>;
};

export type Get_Portfolio_Of_Token_By_DateQueryVariables = Exact<{
  token: Scalars['String'];
  date: Scalars['String'];
}>;

export type Get_Portfolio_Of_Token_By_DateQuery = {
  __typename?: 'Query';
  portfolioByDate: { __typename?: 'Portfolio'; token: string; amount: number };
};
