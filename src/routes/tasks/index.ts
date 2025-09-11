import { Handler } from 'express';
import prisma from '../../prisma';

// Get all tasks
export const get: Handler = async (req, res) => {
  const userId = req.user?.id;

  const tasks = await prisma.task.findMany({
    where: { 
      household: {
        members: {
          some: { id: userId }
        }
      }
     }
  });

  res.json(tasks);
};

// Create a new task
export const post: Handler = async (req, res) => {
  const userId = req.user?.id;
  const household = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      household: true,
    },
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot create tasks cause not in a household' });
  }

  const { title, repetition, dueDate, deactivated, xp } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { title, repetition, dueDate, deactivated, xp, householdId: household.id },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
