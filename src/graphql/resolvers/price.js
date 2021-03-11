import {
    ApolloError
} from 'apollo-server-express';

import {
    NewPriceValidationRules
} from '../../validators';

const myCustomLabels = {
    totalDocs: 'priceCount',
    docs: 'prices',
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
        getAllPrices: async (_, {}, {
            Price
        }) => {
            let prices = await Price.find().populate(['inputBy','vendor','routeFrom','routeTo']);
            return prices;
        },
        getPriceById: async (_, {
            id
        }, {
            Price
        }) => {
            try {
                let price = await Price.findById(id);
                if (!price) {
                    throw new Error("Price not found.");
                }
                await price.populate(['inputBy','vendor','routeFrom','routeTo']).execPopulate();
                return price;
            } catch (err) {
                throw new ApolloError(err.message);
            }
        },
        getPricesByLimitAndPage: async (_, {
            page,
            limit,
            search
        }, {
            Price
        }) => {
            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: {
                    createdAt: -1
                },
                populate: ['inputBy','vendor','routeFrom','routeTo'],
                customLabels: myCustomLabels
            };
          
            let prices = await Price.paginate({ 
                $or: [{ name: { $regex: '.*' + search + '.*'}},
                {descriptions: { $regex: '.*' + search + '.*'}}]
            }, options);
            return prices;
        }
    },
    Mutation: {
        createNewPrice: async (_, {
            newPrice
        }, {
            Price,
            user
        }) => {
            try{
                await NewPriceValidationRules.validate(newPrice, {
                    abortEarly: false
                });

                let result = await Price.create({
                    ...newPrice,
                    inputBy: user._id
                });
                await result.populate(['inputBy','vendor','routeFrom','routeTo']).execPopulate();
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
        editPriceByID: async (_, {
            id,
            updatedPrice
        }, {
            Price
        }) => {
            await NewPriceValidationRules.validate(updatedPrice, {
                abortEarly: false
            });
            try {
                let editedPrice = await Price.findOneAndUpdate({
                    _id: id
                }, {
                    ...updatedPrice
                }, {
                    new: true
                }).populate(['vendor','routeFrom','routeTo']);

                if (!editedPrice) {
                    throw new Error("Unable to edit the price.");
                }

                return editedPrice;
            } catch (err) {
                throw new ApolloError(err.message, 400);
            }
        },
        deletePriceById: async (_, {
            id
        }, {
            Price
        }) => {
            try {
                let deletedPrice = await Price.findOneAndDelete({
                    _id: id
                });

                if (!deletedPrice) {
                    throw new Error("Unable to deleted the price.");
                }

                return {
                    success: true,
                    id: deletedPrice.id,
                    message: "Your prices is deleted.",
                }
            } catch (err) {
                console.log("DELETED_ERR", err);
                throw new ApolloError(err.message);
            }
        }
    }
}