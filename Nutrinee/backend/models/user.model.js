import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    goal: {
        type: Number,
        required: true
    },
    pratice_exercise: [
        {
            pratice: {
                type: String,
                required: true
            },
            pratice_time: {
                type: String,
                required: false
            },
            exercise: {
                type: String,
                required: true
            },
            exercise_time: {
                type: String,
                required: false
            },
        },
    ],
    allergy: [
        {
            has_allergy: {
                type: String,
                required: true
            },
            which: {
                type: [String],
                required: false
            },
        },
    ],
    body: {
        type: String,
        required: true
    },

}, {
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const UserInfo = mongoose.model('userinfo', userSchema);

export default UserInfo;