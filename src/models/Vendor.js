import {
    model,
    Schema
} from 'mongoose';

import paginator from 'mongoose-paginate-v2';

const VendorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    inputBy: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: true
});

VendorSchema.plugin(paginator);

const Vendor = model('vendors', VendorSchema);

export default Vendor;