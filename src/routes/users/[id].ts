import { Handler } from 'express';
import prisma from '../../prisma';

// Get user by ID
export const get: Handler = async (req, res) => {
  const userId = req.user?.id;

  const household = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      household: true,
    },
  });

  if(!household) {
    return res.status(401).json({ message: 'This user cannot find other users cause not in a household' });
  }
  

  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id), householdId: household?.householdId },
    });
    if (user) {
      if(user.householdId !== household?.householdId) {
        return res.status(403).json({ message: 'This user cannot get this user cause not in the same household' });
      }
      res.json(user);
    } 
    else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
