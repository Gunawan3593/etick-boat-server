import {
    ApolloError
} from 'apollo-server-express';

import {
    NewVendorValidationRules
} from '../../validators';

const myCustomLabels = {
    totalDocs: 'vendorCount',
    docs: 'vendors',
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
        getAllVendors: async (_, {}, {
            Vendor
        }) => {
            let vendors = await Vendor.find().populate('inputBy');
            return vendors;
        },
        getVendorById: async (_, {
            id
        }, {
            Vendor
        }) => {
            try {
                let vendor = await Vendor.findById(id);
                if (!vendor) {
                    throw new Error("Vendor not found.");
                }
                await vendor.populate('inputBy').execPopulate();
                return vendor;
            } catch (err) {
                throw new ApolloError(err.message);
            }
        },
        getVendorsByLimitAndPage: async (_, {
            page,
            limit
        }, {
            Vendor
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

            let vendors = await Vendor.paginate({}, options);
            return vendors;
        },
        getAuthenticatedUsersVendors: async (_, {
            page,
            limit
        }, {
            Vendor,
            user
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

            let vendors = await Vendor.paginate({
                inputBy: user._id.toString()
            }, options);
            return vendors;
        }
    },
    Mutation: {
        createNewVendor: async (_, {
            newVendor
        }, {
            Vendor,
            user
        }) => {
            await NewVendorValidationRules.validate(newVendor, {
                abortEarly: false
            });

            let result = await Vendor.create({
                ...newVendor,
                inputBy: user._id
            });
            await result.populate('inputBy').execPopulate();
            return result;
        },
        editVendorByID: async (_, {
            id,
            updatedVendor
        }, {
            Vendor,
            user
        }) => {
            await NewVendorValidationRules.validate(updatedVendor, {
                abortEarly: false
            });
            try {
                let editedVendor = await Vendor.findOneAndUpdate({
                    _id: id,
                    inputBy: user._id.toString()
                }, {
                    ...updatedVendor
                }, {
                    new: true
                });

                if (!editedVendor) {
                    throw new Error("Unable to edit the vendor.");
                }

                return editedVendor;
            } catch (err) {
                throw new ApolloError(err.message, 400);
            }
        },
        deleteVendorById: async (_, {
            id
        }, {
            Vendor,
            user
        }) => {
            try {
                let deletedVendor = await Vendor.findOneAndDelete({
                    _id: id,
                    inputBy: user._id.toString()
                });

                if (!deletedVendor) {
                    throw new Error("Unable to deleted the vendor.");
                }

                return {
                    success: true,
                    id: deletedVendor.id,
                    message: "Your vendors is deleted.",
                }
            } catch (err) {
                console.log("DELETED_ERR", err);
                throw new ApolloError(err.message);
            }
        }
    }
}