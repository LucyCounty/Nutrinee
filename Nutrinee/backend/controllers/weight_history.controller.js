import WeightHistory from "../models/weight_history.model.js";
import ExerciseData from "../models/exercise_data.model.js";

export const getWeightHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const weightHistories = await WeightHistory.find({ userId }).sort({ createdAt: -1 });
    
    if (!weightHistories) {
      return res.status(404).json({ success: false, message: "O histórico de peso deste usuário não foi encontrado."})
    }

    res.status(200).json({ success: true, data: weightHistories });
  } catch (error) {
    console.log("error in fetching user: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getOneWeightHistory = async (req, res) => {
  const { userId } = req.params;

  
  try {
    const weightHistory = await WeightHistory.findOne({ userId }).sort({ createdAt: -1 });
    
    if (!weightHistory) {
      return res.status(404).json({ success: false, message: "O histórico de peso deste usuário não foi encontrado."})
    }

    res.status(200).json({ success: true, data: weightHistory });
  } catch (error) {
    console.log("error in fetching user: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateWeightHistory = async (req, res) => {
  const { userId } = req.params;
  const { new_weight } = req.body;

  try {
    const weightHistory = await WeightHistory.findOne({ userId });

    if (!weightHistory) {
      return res.status(404).json({ success: false, message: "WeightHistory not found" });
    }

      
      if (new_weight !== undefined) {
        const day_count = await ExerciseData.countDocuments({ userId });
        
        
        if (day_count === 1) {
          return res.status(400).json({ success: false, message: "There are no exercise records yet to calculate the week." })
        }

        const data_count = (day_count - 1);

        const currentWeekIndex = Math.floor(data_count / 7);

        const actual_week = currentWeekIndex + 1;

        const week = ((currentWeekIndex) % 4) + 1;

        const alreadyRegistred = await WeightHistory.findOne({ userId, actual_week });
        if (alreadyRegistred) {
          return res.status(400).json({ success: false, message: "O peso dessa semana já foi registrada. "})
        }

        const newHistory = new WeightHistory ({
          userId: weightHistory.userId,
          week: week,
          actual_week: actual_week,
          weight: weightHistory.weight,
          new_weight: new_weight,
          goal: weightHistory.goal,
      });
      
      await newHistory.save();
      
      res.status(200).json({ success: true, data: newHistory, message: "Weight history updated successfully" });
    }
  } catch (error) {
    console.error("Erro ao atualizar histórico: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};