import { Handler } from "express";
import { checkToken } from "../../../middlewares/checkToken";
import prisma from "../../../prisma";

export const get: Handler[] = [checkToken, async (req, res) => {
  const userId = req.user?.id;
  
  const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot get tasks cause not in a household' });
  }
  const tasks = await prisma.task.findMany({
    where: { 
      householdId: household.id,
      deactivated: false,
     }
  });

  const completedTasks = await prisma.completedTask.findMany({
    where: {
      userId: userId,
      task: {
        householdId: household.id,
      },
    }
  });

  const oneShotTasks = tasks.filter(task => task.dueDate && !completedTasks.some(ct => ct.taskId === task.id));

  const toCompleteTasks = tasks.filter(task => {
    if(task.dueDate) {
      return false;
    }

    const lastCompleted = completedTasks
      .filter(ct => ct.taskId === task.id)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())[0];
    const lastCompletedDate = lastCompleted ? lastCompleted.completedAt : task.createdAt;
    const daysSinceLastCompletion = Math.floor((new Date().getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastCompletion >= task.repetition;
  });

  const allTasks = [...oneShotTasks, ...toCompleteTasks];
  allTasks.sort((a, b) => {
    if(a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else if(a.dueDate) {
      return -1;
    } else if(b.dueDate) {
      return 1;
    } else {
      return 0;
    }
  });

  return res.json(allTasks);
}];