import mongoose from "mongoose";

const weightHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userinfo",
    required: true
  },
  week: {
    type: Number,
    required: true
  },
  actual_week: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  new_weight: {
    type: Number,
    required: true
  },
  goal: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

const WeightHistory = mongoose.model("weighthistory", weightHistorySchema);

export default WeightHistory;