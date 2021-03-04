import {
    gql
} from 'apollo-server-express';

export default gql `
    scalar Date

    extend type Query {
        authUserProfile: User! @isAuth
        authenticateUser(username: String!, password: String!): AuthResp!
    }

    extend type Mutation {
        registerUser(newUser: UserInput!): AuthResp!
    }

    input UserInput {
        avatarImage: String
        firstName: String!
        lastName: String!
        username: String!
        password: String!
        email: String!
        address: String!
        birthDate: Date!
        gender: Int!
        city: String
        province: String
        state: String
        phone: String
        postCode: String
        role: Int
        active: Boolean
    }

    type User {
        avatarImage: String
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        id: ID!
    }

    type AuthResp {
        user: User!,
        token: String!
    }
`