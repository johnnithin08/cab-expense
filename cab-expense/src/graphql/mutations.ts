/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCategories = /* GraphQL */ `
  mutation CreateCategories(
    $input: CreateCategoriesInput!
    $condition: ModelCategoriesConditionInput
  ) {
    createCategories(input: $input, condition: $condition) {
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
export const updateCategories = /* GraphQL */ `
  mutation UpdateCategories(
    $input: UpdateCategoriesInput!
    $condition: ModelCategoriesConditionInput
  ) {
    updateCategories(input: $input, condition: $condition) {
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
export const deleteCategories = /* GraphQL */ `
  mutation DeleteCategories(
    $input: DeleteCategoriesInput!
    $condition: ModelCategoriesConditionInput
  ) {
    deleteCategories(input: $input, condition: $condition) {
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
export const createTransactions = /* GraphQL */ `
  mutation CreateTransactions(
    $input: CreateTransactionsInput!
    $condition: ModelTransactionsConditionInput
  ) {
    createTransactions(input: $input, condition: $condition) {
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
export const updateTransactions = /* GraphQL */ `
  mutation UpdateTransactions(
    $input: UpdateTransactionsInput!
    $condition: ModelTransactionsConditionInput
  ) {
    updateTransactions(input: $input, condition: $condition) {
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
export const deleteTransactions = /* GraphQL */ `
  mutation DeleteTransactions(
    $input: DeleteTransactionsInput!
    $condition: ModelTransactionsConditionInput
  ) {
    deleteTransactions(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
