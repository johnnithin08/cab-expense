/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCategories = /* GraphQL */ `
  query GetCategories($id: ID!) {
    getCategories(id: $id) {
      id
      type
      categories
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCategories = /* GraphQL */ `
  query ListCategories(
    $filter: ModelCategoriesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        categories
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const categoriesByUserID = /* GraphQL */ `
  query CategoriesByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCategoriesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    categoriesByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        categories
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTransactions = /* GraphQL */ `
  query GetTransactions($id: ID!) {
    getTransactions(id: $id) {
      id
      type
      category
      name
      description
      amount
      date
      userID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTransactions = /* GraphQL */ `
  query ListTransactions(
    $filter: ModelTransactionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        category
        name
        description
        amount
        date
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const transactionsByUserIDAndDate = /* GraphQL */ `
  query TransactionsByUserIDAndDate(
    $userID: ID!
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTransactionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    transactionsByUserIDAndDate(
      userID: $userID
      date: $date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        category
        name
        description
        amount
        date
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      phoneNo
      transactions {
        items {
          id
          type
          category
          name
          description
          amount
          date
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      categories {
        items {
          id
          type
          categories
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        phoneNo
        transactions {
          items {
            id
            type
            category
            name
            description
            amount
            date
            userID
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        categories {
          items {
            id
            type
            categories
            userID
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
