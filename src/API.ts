/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateTransactionsInput = {
  id?: string | null,
  type: string,
  category: string,
  name: string,
  description: string,
  amount: string,
  userID: string,
};

export type ModelTransactionsConditionInput = {
  type?: ModelStringInput | null,
  category?: ModelStringInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  amount?: ModelStringInput | null,
  userID?: ModelIDInput | null,
  and?: Array< ModelTransactionsConditionInput | null > | null,
  or?: Array< ModelTransactionsConditionInput | null > | null,
  not?: ModelTransactionsConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Transactions = {
  __typename: "Transactions",
  id: string,
  type: string,
  category: string,
  name: string,
  description: string,
  amount: string,
  userID: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateTransactionsInput = {
  id: string,
  type?: string | null,
  category?: string | null,
  name?: string | null,
  description?: string | null,
  amount?: string | null,
  userID?: string | null,
};

export type DeleteTransactionsInput = {
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  name: string,
  email?: string | null,
  phoneNo?: string | null,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phoneNo?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  email?: string | null,
  phoneNo?: string | null,
  transactions?: ModelTransactionsConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelTransactionsConnection = {
  __typename: "ModelTransactionsConnection",
  items:  Array<Transactions | null >,
  nextToken?: string | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  email?: string | null,
  phoneNo?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type ModelTransactionsFilterInput = {
  id?: ModelIDInput | null,
  type?: ModelStringInput | null,
  category?: ModelStringInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  amount?: ModelStringInput | null,
  userID?: ModelIDInput | null,
  and?: Array< ModelTransactionsFilterInput | null > | null,
  or?: Array< ModelTransactionsFilterInput | null > | null,
  not?: ModelTransactionsFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phoneNo?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionTransactionsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  amount?: ModelSubscriptionStringInput | null,
  userID?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionTransactionsFilterInput | null > | null,
  or?: Array< ModelSubscriptionTransactionsFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  phoneNo?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type CreateTransactionsMutationVariables = {
  input: CreateTransactionsInput,
  condition?: ModelTransactionsConditionInput | null,
};

export type CreateTransactionsMutation = {
  createTransactions?:  {
    __typename: "Transactions",
    id: string,
    type: string,
    category: string,
    name: string,
    description: string,
    amount: string,
    userID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTransactionsMutationVariables = {
  input: UpdateTransactionsInput,
  condition?: ModelTransactionsConditionInput | null,
};

export type UpdateTransactionsMutation = {
  updateTransactions?:  {
    __typename: "Transactions",
    id: string,
    type: string,
    category: string,
    name: string,
    description: string,
    amount: string,
    userID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTransactionsMutationVariables = {
  input: DeleteTransactionsInput,
  condition?: ModelTransactionsConditionInput | null,
};

export type DeleteTransactionsMutation = {
  deleteTransactions?:  {
    __typename: "Transactions",
    id: string,
    type: string,
    category: string,
    name: string,
    description: string,
    amount: string,
    userID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name: string,
    email?: string | null,
    phoneNo?: string | null,
    transactions?:  {
      __typename: "ModelTransactionsConnection",
      items:  Array< {
        __typename: "Transactions",
        id: string,
        type: string,
        category: string,
        name: string,
        description: string,
        amount: string,
        userID: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    email?: string | null,
    phoneNo?: string | null,
    transactions?:  {
      __typename: "ModelTransactionsConnection",
      items:  Array< {
        __typename: "Transactions",
        id: string,
        type: string,
        category: string,
        name: string,
        description: string,
        amount: string,
        userID: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    email?: string | null,
    phoneNo?: string | null,
    transactions?:  {
      __typename: "ModelTransactionsConnection",
      items:  Array< {
        __typename: "Transactions",
        id: string,
        type: string,
        category: string,
        name: string,
        description: string,
        amount: string,
        userID: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetTransactionsQueryVariables = {
  id: string,
};

export type GetTransactionsQuery = {
  getTransactions?:  {
    __typename: "Transactions",
    id: string,
    type: string,
    category: string,
    name: string,
    description: string,
    amount: string,
    userID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTransactionsQueryVariables = {
  filter?: ModelTransactionsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTransactionsQuery = {
  listTransactions?:  {
    __typename: "ModelTransactionsConnection",
    items:  Array< {
      __typename: "Transactions",
      id: string,
      type: string,
      category: string,
      name: string,
      description: string,
      amount: string,
      userID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TransactionsByUserIDQueryVariables = {
  userID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTransactionsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TransactionsByUserIDQuery = {
  transactionsByUserID?:  {
    __typename: "ModelTransactionsConnection",
    items:  Array< {
      __typename: "Transactions",
      id: string,
      type: string,
      category: string,
      name: string,
      description: string,
      amount: string,
      userID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name: string,
    email?: string | null,
    phoneNo?: string | null,
    transactions?:  {
      __typename: "ModelTransactionsConnection",
      items:  Array< {
        __typename: "Transactions",
        id: string,
        type: string,
        category: string,
        name: string,
        description: string,
        amount: string,
        userID: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      email?: string | null,
      phoneNo?: string | null,
      transactions?:  {
        __typename: "ModelTransactionsConnection",
        items:  Array< {
          __typename: "Transactions",
          id: string,
          type: string,
          category: string,
          name: string,
          description: string,
          amount: string,
          userID: string,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateTransactionsSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionsFilterInput | null,
};

export type OnCreateTransactionsSubscription = {
  onCreateTransactions?:  {
    __typename: "Transactions",
    id: string,
    type: string,
    category: string,
    name: string,
    description: string,
    amount: string,
    userID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTransactionsSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionsFilterInput | null,
};

export type OnUpdateTransactionsSubscription = {
  onUpdateTransactions?:  {
    __typename: "Transactions",
    id: string,
    type: string,
    category: string,
    name: string,
    description: string,
    amount: string,
    userID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTransactionsSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionsFilterInput | null,
};

export type OnDeleteTransactionsSubscription = {
  onDeleteTransactions?:  {
    __typename: "Transactions",
    id: string,
    type: string,
    category: string,
    name: string,
    description: string,
    amount: string,
    userID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    email?: string | null,
    phoneNo?: string | null,
    transactions?:  {
      __typename: "ModelTransactionsConnection",
      items:  Array< {
        __typename: "Transactions",
        id: string,
        type: string,
        category: string,
        name: string,
        description: string,
        amount: string,
        userID: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    email?: string | null,
    phoneNo?: string | null,
    transactions?:  {
      __typename: "ModelTransactionsConnection",
      items:  Array< {
        __typename: "Transactions",
        id: string,
        type: string,
        category: string,
        name: string,
        description: string,
        amount: string,
        userID: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    email?: string | null,
    phoneNo?: string | null,
    transactions?:  {
      __typename: "ModelTransactionsConnection",
      items:  Array< {
        __typename: "Transactions",
        id: string,
        type: string,
        category: string,
        name: string,
        description: string,
        amount: string,
        userID: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
