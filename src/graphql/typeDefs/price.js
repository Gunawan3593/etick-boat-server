import {
    gql
} from 'apollo-server-express';

export default gql `
    extend type Query {
      getAllPrices: [Price!]!
      getPriceById(id: ID!): Price!
      getPricesByLimitAndPage(page: Int, limit: Int, search: String): PricePaginator!
      getAuthenticatedUsersPrices(page: Int, limit: Int): PricePaginator! @isAuth
    },

    extend type Mutation {
        createNewPrice(newPrice: PriceInput!): Price! @isAuth
        deletePriceById(id: ID!): PriceNotification! @isAuth
        editPriceByID(updatedPrice: PriceInput!, id: ID!): Price! @isAuth
    }

    input PriceInput {
        name: String!
        descriptions: String!
        price: Int
        unit: String!
        vendor: String!
        routeFrom: String!
        routeTo: String!
        active: Boolean,
        imagePath: String
    }

    type Price {
        id: ID!
        name:String!
        descriptions: String!
        price: Int
        unit: String!
        active: Boolean
        updatedAt:String
        createdAt: String
        vendor: Vendor!
        routeFrom: Route!
        routeTo: Route!
        inputBy: User!
        imagePath: String
    }

    type PricePaginator {
        prices: [Price!]!
        paginator: PriceLabels
    }

    type PriceLabels {
        priceCount: Int!
        perPage: Int!
        pageCount: Int!
        currentPage: Int!
        slNo: Int!
        hasPrevPage: Boolean!
        hasNextPage: Boolean!
        prev: Int
        next: Int
    }

    type PriceNotification {
        id: ID!
        message: String!
        success: Boolean!
    }

`;