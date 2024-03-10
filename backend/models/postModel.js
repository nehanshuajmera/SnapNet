import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
    postContent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

export const Post = mongoose.model('Post', postSchema);