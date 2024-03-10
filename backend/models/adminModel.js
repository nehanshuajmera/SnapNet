import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    adminRole: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin'
    },
}, {timestamps: true});

adminSchema.statics.signup = async function (username, email, password, confirmPassword, adminRole) {
    if(!username || !email || !password || !confirmPassword || !adminRole) {
        throw new Error('Please fill in all fields');
    }
    if(!['superadmin', 'admin'].includes(adminRole)) {
        throw new Error('Invalid admin role');
    }
    if(!validator.isEmail(email)) {
        throw new Error('Invalid email');
    }
    if (!validator.matches(username, "^[a-z0-9_.-]{8,}$")) {
        throw new Error(
            "username must be at least 8 characters long and contain only letters, numbers, underscores, hyphens, and periods"
        );
    }
    if (
        !validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
        })
    ) {
        throw new Error(
            "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        );
    }
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    const existingAdmin = await this.findOne ({username});
    if(existingAdmin) {
        throw new Error('Admin already exists');
    }

    const admin = await this.create({username, email, password, confirmPassword, adminRole});
    return admin;
};

adminSchema.statics.login = async function ({usernameOrEmail, password}) {
    if(!usernameOrEmail || !password) {
        throw new Error('Please fill in all fields');
    }

    const admin = await this.findOne({$or: [{username: usernameOrEmail}, {email: usernameOrEmail}]});
    if(!admin) {
        throw new Error('Admin does not exist');
    }
    if(admin.password !== password) {
        throw new Error('Invalid password');
    }
    return admin;
};

export const Admin = mongoose.model('Admin', adminSchema);