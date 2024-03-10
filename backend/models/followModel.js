import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const followSchema = new Schema({
    followerId: {
        type: String,
        required: true,
        ref: 'User'
    },
    followingId: {
        type: String,
        required: true,
        ref: 'User'
    }
}, {timestamps: true});

export const Follow = mongoose.model('Follow', followSchema);