import { Handler } from 'express';
import prisma from '../../../prisma';

export const get: Handler = async (req, res) => {
  try {
    const allTasks = await prisma.task.findMany({
      include: {
        completedTasks: {
          orderBy: {
            completedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    const tasksToComplete = allTasks.filter(task => {
      if (task.deactivated) {
        return false; // Skip deactivated tasks
      }

      let effectiveDueDate: Date | null = null;

      if (task.repetition && task.repetition > 0) {
        const lastCompletedTask = task.completedTasks[0];
        if (lastCompletedTask) {
          // Calculate next due date based on last completion + repetition days
          effectiveDueDate = new Date(lastCompletedTask.completedAt);
          effectiveDueDate.setDate(effectiveDueDate.getDate() + task.repetition);
        } else {
          // If never completed, use original dueDate or createdAt as initial due date
          effectiveDueDate = task.dueDate || task.createdAt;
        }
      } else {
        // Non-repetition task, use its dueDate directly
        effectiveDueDate = task.dueDate;
      }

      if (!effectiveDueDate) {
        return false; // No due date to check against
      }

      // Check if the task is due or overdue
      return effectiveDueDate <= new Date();
    });

    res.json(tasksToComplete);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
