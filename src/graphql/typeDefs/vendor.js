import {
    gql
} from 'apollo-server-express';

export default gql `
    extend type Query {
      getAllVendors: [Vendor!]!
      getVendorById(id: ID!): Vendor!
      getVendorsByLimitAndPage(page: Int, limit: Int): VendorPaginator!
      getAuthenticatedUsersVendors(page: Int, limit: Int): VendorPaginator! @isAuth
    },

    extend type Mutation {
        createNewVendor(newVendor: VendorInput!): Vendor! @isAuth
        deleteVendorById(id: ID!): VendorNotification! @isAuth
        editVendorByID(updatedVendor: VendorInput!, id: ID!): Vendor! @isAuth
    }

    input VendorInput {
        name:String!
        descriptions: String!
        active: String
    }

    type Vendor {
        id: ID!
        name:String!
        descriptions: String!
        updatedAt:String
        createdAt: String
        inputBy: User!
    }

    type VendorPaginator {
        vendors: [Vendor!]!
        paginator: VendorLabels
    }

    type VendorLabels {
        vendorCount: Int!
        perPage: Int!
        pageCount: Int!
        currentPage: Int!
        slNo: Int!
        hasPrevPage: Boolean!
        hasNextPage: Boolean!
        prev: Int
        next: Int
    }

    type VendorNotification {
        id: ID!
        message: String!
        success: Boolean!
    }

`;