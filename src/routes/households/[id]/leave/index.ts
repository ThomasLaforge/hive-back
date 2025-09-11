import { Handler } from "express";
import { checkToken } from "../../../../middlewares/checkToken";
import prisma from "../../../../prisma";

// Join a household
export const post: Handler[] = [checkToken, async (req, res) => {
  const userId = req.user?.id as number;
  const id = req.params.id ? Number(req.params.id) : null;
  if (!id) {
    return res.status(400).json({ message: 'Invalid household ID' });
  }
  const household = await prisma.household.findUnique({
    where: { id },
  });
  if(!household) {
    return res.status(404).json({ message: 'Household not found' });
  }
  try {
    const newHousehold = await prisma.household.update({
      where: { id: Number(id) },
      data: { members: { disconnect: { id: userId } } },
    });
    const newPersonalHousehold = await prisma.household.create({
      data: {
        name: `${req.user?.pseudo}'s Personal Household`,
        ownerId: userId,
        members: { connect: { id: userId } }
      }
    });
    res.status(200).json(newPersonalHousehold);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}];
