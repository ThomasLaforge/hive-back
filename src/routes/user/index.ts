import { Handler } from 'express';
import prisma from '../../prisma';

// Get all users
export const get: Handler = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new user
export const post: Handler = async (req, res) => {
  const { pseudo, email, password, avatarUrl, currentGift, householdId } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { pseudo, email, password, avatarUrl, currentGift, householdId },
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
