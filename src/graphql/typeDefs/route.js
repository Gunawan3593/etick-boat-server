import {
    gql
} from 'apollo-server-express';

export default gql `
    extend type Query {
      getAllRoutes(status: Boolean): [Route!]!
      getRouteById(id: ID!): Route!
      getRoutesByLimitAndPage(page: Int, limit: Int, search: String): RoutePaginator!
      getAuthenticatedUsersRoutes(page: Int, limit: Int): RoutePaginator! @isAuth
    },

    extend type Mutation {
        createNewRoute(newRoute: RouteInput!): Route! @isAuth
        deleteRouteById(id: ID!): RouteNotification! @isAuth
        editRouteByID(updatedRoute: RouteInput!, id: ID!): Route! @isAuth
    }

    input RouteInput {
        name:String!
        descriptions: String!
        active: Boolean
    }

    type Route {
        id: ID!
        name:String!
        descriptions: String!
        active: Boolean
        updatedAt:String
        createdAt: String
        inputBy: User!
    }

    type RoutePaginator {
        routes: [Route!]!
        paginator: RouteLabels
    }

    type RouteLabels {
        routeCount: Int!
        perPage: Int!
        pageCount: Int!
        currentPage: Int!
        slNo: Int!
        hasPrevPage: Boolean!
        hasNextPage: Boolean!
        prev: Int
        next: Int
    }

    type RouteNotification {
        id: ID!
        message: String!
        success: Boolean!
    }

`;