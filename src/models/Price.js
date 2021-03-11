import {
    model,
    Schema
} from 'mongoose';

import paginator from 'mongoose-paginate-v2';

const PriceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    descriptions: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    vendor: {
        ref: 'vendors',
        type: Schema.Types.ObjectId
    },
    routeFrom: {
        ref: 'routes',
        type: Schema.Types.ObjectId
    },
    routeTo: {
        ref: 'routes',
        type: Schema.Types.ObjectId
    },
    inputBy: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    imagePath: {
        type: String
    }
}, {
    timestamps: true
});

PriceSchema.plugin(paginator);

const Price = model('prices', PriceSchema);

export default Price;