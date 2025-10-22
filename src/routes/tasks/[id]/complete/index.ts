import { Handler } from "express";
import { checkToken } from "../../../../middlewares/checkToken";
import prisma from "../../../../prisma";

export const post: Handler[] = [checkToken, async (req, res) => {
  const userId = req.user?.id;
  const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if (!household) {
    return res.status(401).json({ message: 'This user cannot complete tasks cause not in a household' });
  }

  const { id } = req.params;
  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(id), householdId: household.id },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const completedTask = await prisma.completedTask.create({
      data: { taskId: task.id, userId: userId!, xpEarned: task.xp },
    });
    return res.status(201).json(completedTask);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}];
