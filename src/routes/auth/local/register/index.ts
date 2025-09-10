import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";
import { Handler, Router } from "express";


const prisma = new PrismaClient();

export const authRouter = Router();

export const post: Handler = async (req, res) => {
    // const motdpasse = req.body.motdpasse;
    // const pseudo = req.body.pseudo;

    const { email, password, pseudo } = req.body;
    const userWithEmail = await prisma.user.findFirst({ where: { email } });
    if (userWithEmail) {
        res.status(400).json("Email already exists");
    }
    else {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS!));
        const newUser = await prisma.user.create({ 
            data: {
                password: hashedPassword,
                pseudo,
                email
            } 
        });
        res.json(newUser);
    }
};