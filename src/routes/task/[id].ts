import { Handler } from 'express';
import prisma from '../../prisma';

// Get task by ID
export const get: Handler = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
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
  const { id } = req.params;
  const { title, repetition, dueDate, deactivated, xp, householdId } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
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
  try {
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
