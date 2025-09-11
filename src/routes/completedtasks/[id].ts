import { Handler } from 'express';
import prisma from '../../prisma';

// Get completed task by ID
export const get: Handler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  
  const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot get completed tasks cause not in a household' });
  }
  try {
    const completedTask = await prisma.completedTask.findUnique({
      where: { id: Number(id) },
    });
    if (completedTask) {
      res.json(completedTask);
    } else {
      res.status(404).json({ message: 'Completed Task not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a completed task
// export const put: Handler = async (req, res) => {
//   const { id } = req.params;
//   const { xpEarned, taskId, userId } = req.body;
//   try {
//     const updatedCompletedTask = await prisma.completedTask.update({
//       where: { id: Number(id) },
//       data: { xpEarned, taskId, userId },
//     });
//     res.json(updatedCompletedTask);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Delete a completed task
export const del: Handler = async (req, res) => {
  const userId = req.user?.id;
  const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot delete completed tasks cause not in a household' });
  }

  const { id } = req.params;
  try {
    await prisma.completedTask.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
