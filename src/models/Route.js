import {
    model,
    Schema
} from 'mongoose';

import paginator from 'mongoose-paginate-v2';

const RouteSchema = new Schema({
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

RouteSchema.plugin(paginator);

const Route = model('routes', RouteSchema);

export default Route;