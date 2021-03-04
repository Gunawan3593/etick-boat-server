import {
    model,
    Schema
} from 'mongoose';
import { number } from 'yup';

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true,
        default: null
    },
    gender: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    province: {
        type: String
    },
    state: {
        type: String
    },
    phone: {
        type: String
    },
    postCode: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    avatarImage: {
        type: String,
        default: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
    },
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const User = model('users', UserSchema);

export default User;