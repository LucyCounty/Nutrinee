import bcrypt from "bcrypt";
import UserInfo from "../models/user.model.js";

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserInfo.findOne({ email });
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Email ou senha incorreta" });

        res.status (200).json({ success: true, message: "Login successful", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}