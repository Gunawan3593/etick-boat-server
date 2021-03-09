import {
    ApolloError
} from 'apollo-server-express';

import {
    NewBankValidationRules
} from '../../validators';

const myCustomLabels = {
    totalDocs: 'bankCount',
    docs: 'banks',
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
        getAllBanks: async (_, {}, {
            Bank
        }) => {
            let banks = await Bank.find().populate('inputBy');
            return banks;
        },
        getBankById: async (_, {
            id
        }, {
            Bank
        }) => {
            try {
                let bank = await Bank.findById(id);
                if (!bank) {
                    throw new Error("Bank not found.");
                }
                await bank.populate('inputBy').execPopulate();
                return bank;
            } catch (err) {
                throw new ApolloError(err.message);
            }
        },
        getBanksByLimitAndPage: async (_, {
            page,
            limit,
            search
        }, {
            Bank
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
          
            let banks = await Bank.paginate({ 
                $or: [{ name: { $regex: '.*' + search + '.*'}},
                {descriptions: { $regex: '.*' + search + '.*'}}]
            }, options);
            return banks;
        }
    },
    Mutation: {
        createNewBank: async (_, {
            newBank
        }, {
            Bank,
            user
        }) => {
            try{
                await NewBankValidationRules.validate(newBank, {
                    abortEarly: false
                });

                let result = await Bank.create({
                    ...newBank,
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
        editBankByID: async (_, {
            id,
            updatedBank
        }, {
            Bank,
            user
        }) => {
            await NewBankValidationRules.validate(updatedBank, {
                abortEarly: false
            });
            try {
                let editedBank = await Bank.findOneAndUpdate({
                    _id: id,
                    inputBy: user._id.toString()
                }, {
                    ...updatedBank
                }, {
                    new: true
                });

                if (!editedBank) {
                    throw new Error("Unable to edit the bank.");
                }

                return editedBank;
            } catch (err) {
                throw new ApolloError(err.message, 400);
            }
        },
        deleteBankById: async (_, {
            id
        }, {
            Bank,
            user
        }) => {
            try {
                let deletedBank = await Bank.findOneAndDelete({
                    _id: id,
                    inputBy: user._id.toString()
                });

                if (!deletedBank) {
                    throw new Error("Unable to deleted the bank.");
                }

                return {
                    success: true,
                    id: deletedBank.id,
                    message: "Your banks is deleted.",
                }
            } catch (err) {
                console.log("DELETED_ERR", err);
                throw new ApolloError(err.message);
            }
        }
    }
}