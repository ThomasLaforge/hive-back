import bcrypt from "bcrypt";
import "dotenv/config";
import { Handler } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma";

export const post: Handler = async (req, res) => {
    const { email, password } = req.body;
    const userWithEmail = await prisma.user.findFirst({ where: { email } });
    if (!userWithEmail) {
      res.json("Email or password is incorrect");
    }
    else {
        const { password: _, ...userWithoutPassword } = userWithEmail;
        const isPasswordCorrect = await bcrypt.compare(password, userWithEmail.password);
        if (isPasswordCorrect) {
            const token = jwt.sign(userWithEmail, process.env.JWT_SECRET!);
            res.json({
                token,
                user: userWithoutPassword
            });
        }
        else {
            res.status(400).json("Email or password is incorrect");
        }
    }
};