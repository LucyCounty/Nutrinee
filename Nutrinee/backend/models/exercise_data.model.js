import mongoose from "mongoose";

const exerciseDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userinfo",
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    actual_day: {
        type: Number,
        required: true
    },
    walk: {
        type: Number,
        required: true
    },
    new_walk: {
        type: Number,
        required: true
    },
    walk_range: {
        type: String,
        required: true,
        match: /^\d{1,2}-\d{1,2}$/,
    },
}, {
    timestamps: true,
});

const ExerciseData = mongoose.model('exercisedata', exerciseDataSchema);

export default ExerciseData;