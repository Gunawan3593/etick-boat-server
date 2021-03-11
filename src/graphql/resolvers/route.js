import {
    ApolloError
} from 'apollo-server-express';

import {
    NewRouteValidationRules
} from '../../validators';

const myCustomLabels = {
    totalDocs: 'routeCount',
    docs: 'routes',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator'
};

export default {
    Query: {
        getAllRoutes: async (_, { status }, {
            Route
        }) => {
            let filter = {};
            if(status){
                filter = { active: status };
            }
            let routes = await Route.find(filter).populate('inputBy');
            return routes;
        },
        getRouteById: async (_, {
            id
        }, {
            Route
        }) => {
            try {
                let route = await Route.findById(id);
                if (!route) {
                    throw new Error("Route not found.");
                }
                await route.populate('inputBy').execPopulate();
                return route;
            } catch (err) {
                throw new ApolloError(err.message);
            }
        },
        getRoutesByLimitAndPage: async (_, {
            page,
            limit,
            search
        }, {
            Route
        }) => {
            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: {
                    createdAt: -1
                },
                populate: 'inputBy',
                customLabels: myCustomLabels
            };
          
            let routes = await Route.paginate({ 
                $or: [{ name: { $regex: '.*' + search + '.*'}},
                {descriptions: { $regex: '.*' + search + '.*'}}]
            }, options);
            return routes;
        }
    },
    Mutation: {
        createNewRoute: async (_, {
            newRoute
        }, {
            Route,
            user
        }) => {
            try{
                await NewRouteValidationRules.validate(newRoute, {
                    abortEarly: false
                });

                let result = await Route.create({
                    ...newRoute,
                    inputBy: user._id
                });
                await result.populate('inputBy').execPopulate();
                return result;
            }catch(err){
                let errs;
                if(err.inner){
                    err.inner.forEach(error =>  {
                        if(!errs){
                            errs = error.path+":"+error.errors;
                        }else{
                            errs = errs + "," + error.path+":"+error.errors;
                        }
                    })
                }
                if(!errs){
                    let key = err.message.split(" ")[0].toLowerCase();
                    errs = key+":"+err.message;
                }
                throw new ApolloError(errs, 400);
            }
        },
        editRouteByID: async (_, {
            id,
            updatedRoute
        }, {
            Route,
            user
        }) => {
            await NewRouteValidationRules.validate(updatedRoute, {
                abortEarly: false
            });
            try {
                let editedRoute = await Route.findOneAndUpdate({
                    _id: id,
                    inputBy: user._id.toString()
                }, {
                    ...updatedRoute
                }, {
                    new: true
                });

                if (!editedRoute) {
                    throw new Error("Unable to edit the route.");
                }

                return editedRoute;
            } catch (err) {
                throw new ApolloError(err.message, 400);
            }
        },
        deleteRouteById: async (_, {
            id
        }, {
            Route,
            user
        }) => {
            try {
                let deletedRoute = await Route.findOneAndDelete({
                    _id: id,
                    inputBy: user._id.toString()
                });

                if (!deletedRoute) {
                    throw new Error("Unable to deleted the route.");
                }

                return {
                    success: true,
                    id: deletedRoute.id,
                    message: "Your routes is deleted.",
                }
            } catch (err) {
                console.log("DELETED_ERR", err);
                throw new ApolloError(err.message);
            }
        }
    }
}