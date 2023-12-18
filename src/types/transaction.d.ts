declare interface ITransactions {
    amount: string;
    category: string;
    createdAt: Date;
    description: string;
    id: string;
    name: string;
    type: string;
}


type TTransactionTypes = "Fuel" | "Full Service" | "RJ Cash" | "RJ Card" | "Tips" | "Car Insurance" | "Road Tax" | "Other" 

declare type TTransactionTypesObject = Record<TTransactionTypes, number>