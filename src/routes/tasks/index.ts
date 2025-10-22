import { Handler } from 'express';
import { checkToken } from '../../middlewares/checkToken';
import prisma from '../../prisma';

// Get all tasks
export const get: Handler[] = [checkToken, async (req, res) => {
const userId = req.user?.id;
const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot get tasks cause not in a household' });
  }

  console.log('Fetching tasks for household ID:', household.id);

  const tasks = await prisma.task.findMany({
    where: {
      householdId: household.id,
    }
  });

  res.json(tasks);
}];

// Create a new task
export const post: Handler[] = [checkToken, async (req, res) => {
  const userId = req.user?.id;
  // Fetch the current user with its household relation
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { household: true },
  });
  if (!user || !user.household) {
    return res.status(401).json({ message: 'This user cannot create tasks cause not in a household' });
  }

  const { title, repetition, dueDate, deactivated, xp } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        repetition,
        dueDate,
        deactivated,
        xp,
        householdId: user.household.id, // ensure task is attached to the user household
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}];
