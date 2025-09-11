import { Handler } from 'express';
import prisma from '../../prisma';

// Get task by ID
export const get: Handler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot get tasks cause not in a household' });
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id), householdId: household.id },
    });
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task
export const put: Handler = async (req, res) => {
  const userId = req.user?.id;
  const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot update tasks cause not in a household' });
  }
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
  });
  if(!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if(task.householdId !== household.id) {
    return res.status(403).json({ message: 'This user cannot update this task cause not in the same household' });
  }

  const { title, repetition, dueDate, deactivated, xp, householdId } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) , householdId: household.id},
      data: { title, repetition, dueDate, deactivated, xp, householdId },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a task
export const del: Handler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot delete tasks cause not in a household' });
  }
  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
  });
  if(!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if(task.householdId !== household.id) {
    return res.status(403).json({ message: 'This user cannot delete this task cause not in the same household' });
  }

  try {
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
