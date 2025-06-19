import mongoose from "mongoose";
import bcrypy from "bcrypt";
import UserInfo from "../models/user.model.js";
import WeightHistory from "../models/weight_history.model.js";
import ExerciseData from "../models/exercise_data.model.js";

export const getUserInfo = async (req, res) => {
    try {
        const userinfos = await UserInfo.find({});
        res.status(200).json({ success: true, data: userinfos });
    } catch (error) {
        console.log("error in fetching user: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getOneUserInfo = async (req, res) => {
    const { id } = req.params;

    const userinfo = await UserInfo.findById(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("error in updating user: ", error.message);
        return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    try{
        res.status(200).json({ success: true, data: userinfo });
    } catch (error) {
        console.log("error in fetching user: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createUserInfo = async (req, res) => {
    const userinfo = req.body;

    if(!userinfo.name || !userinfo.email || !userinfo.password || !userinfo.height || !userinfo.weight || !userinfo.goal || !userinfo.pratice_exercise[0].pratice || !userinfo.pratice_exercise[0].exercise || !userinfo.allergy[0].has_allergy || !userinfo.body) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const existingUser = await UserInfo.findOne({ email: userinfo.email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already existe" });
        }

        const emailRegex = /^[\w.-]+@(gmail\.com|outlook\.com|yahoo\.com)$/;

        if (!emailRegex.test(userinfo.email)) {
            return res.status(400).json({
                success: false,
                message: "Only @gmail.com, @outlook.com or @yahoo.com are allowed."
            })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

        if (!passwordRegex.test(userinfo.password)) {
            return res.status(400).json({
                success: false, message: "A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
            });
        }

        const newUserInfo = new UserInfo(userinfo);
        const savedUser = await newUserInfo.save();

        const newWeightHistory = new WeightHistory({
            userId: savedUser._id,
            week: 0,
            actual_week: 0,
            weight: savedUser.weight,
            new_weight: savedUser.weight,
            goal: savedUser.goal
        });

        const savedWeightHistory = await newWeightHistory.save();

        const newExerciseData = new ExerciseData({
            userId: savedUser._id,
            day: 0,
            actual_day: 0,
            walk: 10,
            new_walk: 0,
            walk_range: "0-0"
        });

        const savedExerciseData = await newExerciseData.save();


        res.status(201).json({ success: true, data: {user: savedUser, weightHistory: savedWeightHistory, exerciseData: savedExerciseData}, message: "User and weight history created successfully"});
    } catch (error) {
        console.error("error in create user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateUserInfo = async (req, res) => {
    const { id } = req.params;
    const userinfo = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        console.log("error in updating user: ", error.message);
        return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    try {
        const updatedUser = await UserInfo.findByIdAndUpdate(id, userinfo, { new: true });

        const fieldsToUpdate = {};
        if (userinfo.weight !== undefined) fieldsToUpdate.weight = userinfo.weight;
        if (userinfo.goal !== undefined) fieldsToUpdate.goal = userinfo.goal;

        if (Object.keys(fieldsToUpdate).length > 0) {
            await WeightHistory.findOneAndUpdate(
                {userId: id},
                { $set: fieldsToUpdate },
                { sort: {createdAt: -1} },
            );
        }

        if (userinfo.weight) {
            await ExerciseData.updateMany(
                { userId: id },
                { $set: { goal: userinfo.weight } }
            );

            await WeightHistory.updateMany(
                { userId: id },
                { $set: { goal: userinfo.weight } }
            );
        }

        if (userinfo.goal) {
            await ExerciseData.updateMany(
                { userId: id },
                { $set: { goal: userinfo.goal } }
            );

            await WeightHistory.updateMany(
                { userId: id },
                { $set: { goal: userinfo.goal } }
            );
        }

        res.status(200).json({ success: true, data: updatedUser, message: "User updated successfully."})
    } catch (error) {
        console.log("error in updating user: ", error.message);
        res.status(500).json({ success: true, message: "Server Error" });
    }
};

export const deleteUserInfo = async (req, res) => {
    const { id }  = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("error in updating user: ", error.message);
        return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    try{
        await UserInfo.findByIdAndDelete(id);
        await WeightHistory.deleteMany({ userId: id });
        await ExerciseData.deleteMany({ userId: id });
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log("error in deleting user: ", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};