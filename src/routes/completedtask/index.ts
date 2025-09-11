import { Handler } from 'express';
import prisma from '../../prisma';

// Get all completed tasks
export const get: Handler = async (req, res) => {
  try {
    const completedTasks = await prisma.completedTask.findMany();
    res.json(completedTasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new completed task
export const post: Handler = async (req, res) => {
  const { xpEarned, taskId, userId } = req.body;
  try {
    const newCompletedTask = await prisma.completedTask.create({
      data: { xpEarned, taskId, userId },
    });
    res.status(201).json(newCompletedTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
