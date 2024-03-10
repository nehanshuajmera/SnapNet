import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        default: "",
    },
    profileImage: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
    posts: [
        {
            type: String,
            ref: "Post",
        },
    ],
    followers: [
        {
            type: String,
            ref: "Follow",
        },
    ],
    following: [
        {
            type: String,
            ref: "Follow",
        },
    ],
});

userSchema.statics.signup = async function (
    username,
    email,
    password,
    confirmPassword,
    phoneNumber,
    bio,
    profileImage
) {
    if (!username || !email || !password || !confirmPassword || !phoneNumber) {
        throw new Error("Please fill in all the fields");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Please provide a valid email");
    }
    if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
    }
    if (!validator.isMobilePhone(phoneNumber)) {
        throw new Error("Please provide a valid phone number");
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

    const userExists = await this.findOne({ username });
    if (userExists) {
        throw new Error("User already exists");
    }

    const emailExists = await this.findOne({ email });
    if (emailExists) {
        throw new Error("Email already exists");
    }

    const phoneExists = await this.findOne({ phoneNumber });
    if (phoneExists) {
        throw new Error("Phone number already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const confirmPasswordHash = await bcrypt.hash(confirmPassword, salt);

    const user = await this.create({
        username,
        email,
        password: passwordHash,
        confirmPassword: confirmPasswordHash,
        phoneNumber,
        bio,
        profileImage,
    });

    return user;
};

userSchema.statics.login = async function ({ usernameOrEmail, password }) {
    if (!usernameOrEmail || !password) {
        throw new Error("Please fill in all the fields");
    }

    const user = await this.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
        throw new Error("User does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    return user;
};

export const User = mongoose.model("User", userSchema);