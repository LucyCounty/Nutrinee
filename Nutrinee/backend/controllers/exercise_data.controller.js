import ExerciseData from "../models/exercise_data.model.js";

export const getExerciseData = async (req,res) => {
    const { userId } = req.params;
  
    try {
        const exerciseDatas = await ExerciseData.find({ userId }).sort({ createdAt: -1 });
    
    if (!exerciseDatas) {
        return res.status(404).json({ success: false, message: "O histórico de exercício deste usuário não foi encontrado."})
    }

        res.status(200).json({ success: true, data: exerciseDatas });
    } catch (error) {
        console.log("error in fetching user: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getOneExerciseData = async (req, res) => {
    const { userId } = req.params;
  
    try {
        const exerciseData = await ExerciseData.findOne({ userId }).sort({ createdAt: -1 });
    
    if (!exerciseData) {
        return res.status(404).json({ success: false, message: "O histórico de exercício deste usuário não foi encontrado."})
    }

        res.status(200).json({ success: true, data: exerciseData });
    } catch (error) {
        console.log("error in fetching user: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateExerciseData = async (req, res) => {
    const { userId } = req.params;
    const { new_walk, walk_range } = req.body;

    try{
        const exerciseData = await ExerciseData.findOne({ userId });
        if (!exerciseData){
            return res.status(404).json({ success: false, message: "Exercise data not found" })
        }

        if (new_walk !== undefined) {
            const day_count = await ExerciseData.countDocuments({ userId: exerciseData.userId });

            const day = ((day_count - 1) % 7) + 1;

            const intervalRegex = /^\d{1,2}-\d{1,2}$/;
            if (!intervalRegex.test(walk_range)) {
                return res.status(400).json ({ success: false, message: "walk_range must be in the format 'start-ent (ex: 3-8" });
            }

            const newExercise = new ExerciseData ({
                userId: exerciseData.userId,
                day: day,
                actual_day: day_count,
                walk: exerciseData.walk,
                new_walk: new_walk,
                walk_range: walk_range,
            });
            
            await newExercise.save();
            
            res.status(200).json({ success: true, data: newExercise, message: "Exercise data updated successfully" });
        }
    } catch (error) {
        console.error("Erro ao atualizar o exercício: ", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};