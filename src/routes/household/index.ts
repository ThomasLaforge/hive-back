import { Handler } from 'express';
import prisma from '../../prisma';

// Get all households
export const get: Handler = async (req, res) => {
  try {
    const households = await prisma.household.findMany();
    res.json(households);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new household
export const post: Handler = async (req, res) => {
  const { name, avatarUrl, ownerId } = req.body;
  try {
    const newHousehold = await prisma.household.create({
      data: { name, avatarUrl, ownerId },
    });
    res.status(201).json(newHousehold);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
