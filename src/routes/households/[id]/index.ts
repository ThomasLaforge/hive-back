import { Handler } from 'express';
import { checkToken } from '../../../middlewares/checkToken';
import prisma from '../../../prisma';

// Get household by ID
export const get: Handler[] = [checkToken, async (req, res) => {
  const userId = req.user?.id;
  const household = await prisma.household.findFirst({
    where: { members: { some: { id: userId } } }
  });
  if(!household) {
    return res.status(401).json({ message: 'This user cannot get household cause not in a household' });
  }
  const { id } = req.params;
  try {
    const household = await prisma.household.findUnique({
      where: { id: Number(id) },
    });
    if (household) {
      res.json(household);
    } else {
      res.status(404).json({ message: 'Household not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}];

// Update a household
export const put: Handler[] = [checkToken, async (req, res) => {
  const household = await prisma.household.findUnique({
    where: { id: Number(req.params.id) },
  });
  if(!household) {
    return res.status(404).json({ message: 'Household not found' });
  }
  if(household.ownerId !== req.user?.id) {
    return res.status(403).json({ message: 'This user cannot update this household cause not the owner' });
  }
    
  const { id } = req.params;
  const { name, avatarUrl, ownerId } = req.body;
  try {
    const updatedHousehold = await prisma.household.update({
      where: { id: Number(id) },
      data: { name, avatarUrl, ownerId },
    });
    res.json(updatedHousehold);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}];

// Delete a household
// export const del: Handler = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await prisma.household.delete({
//       where: { id: Number(id) },
//     });
//     res.status(204).send();
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
