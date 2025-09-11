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
  const { xpEarned, taskId } = req.body;
  const userId = req.user?.id as number;
  const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot create completed tasks cause not in a household' });
  }
  const task = await prisma.task.findUnique({
    where: { id: Number(taskId) },
  });
  if(!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if(task.householdId !== household.id) {
    return res.status(403).json({ message: 'This user cannot complete this task cause not in the same household' });
  }

  try {
    const newCompletedTask = await prisma.completedTask.create({
      data: { xpEarned, taskId, userId },
    });
    res.status(201).json(newCompletedTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
