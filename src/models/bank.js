import {
    model,
    Schema
} from 'mongoose';

import paginator from 'mongoose-paginate-v2';

const BankSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    itno: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    notes: {
        type: String
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

BankSchema.plugin(paginator);

const Bank = model('banks', BankSchema);

export default Bank;