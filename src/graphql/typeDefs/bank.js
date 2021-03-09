import {
    gql
} from 'apollo-server-express';

export default gql `
    extend type Query {
      getAllBanks: [Bank!]!
      getBankById(id: ID!): Bank!
      getBanksByLimitAndPage(page: Int, limit: Int, search: String): BankPaginator!
      getAuthenticatedUsersBanks(page: Int, limit: Int): BankPaginator! @isAuth
    },

    extend type Mutation {
        createNewBank(newBank: BankInput!): Bank! @isAuth
        deleteBankById(id: ID!): BankNotification! @isAuth
        editBankByID(updatedBank: BankInput!, id: ID!): Bank! @isAuth
    }

    input BankInput {
        name:String!
        itno: String!
        account: String!
        notes: String
        active: Boolean
    }

    type Bank {
        id: ID!
        name:String!
        itno: String!
        account: String!
        notes: String
        active: Boolean
        updatedAt:String
        createdAt: String
        inputBy: User!
    }

    type BankPaginator {
        banks: [Bank!]!
        paginator: BankLabels
    }

    type BankLabels {
        bankCount: Int!
        perPage: Int!
        pageCount: Int!
        currentPage: Int!
        slNo: Int!
        hasPrevPage: Boolean!
        hasNextPage: Boolean!
        prev: Int
        next: Int
    }

    type BankNotification {
        id: ID!
        message: String!
        success: Boolean!
    }

`;