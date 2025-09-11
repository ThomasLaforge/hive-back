import { Handler } from 'express';
import prisma from '../../prisma';

// Get all tasks
export const get: Handler = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new task
export const post: Handler = async (req, res) => {
  const { title, repetition, dueDate, deactivated, xp, householdId } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { title, repetition, dueDate, deactivated, xp, householdId },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
