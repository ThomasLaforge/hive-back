import { Handler } from "express";
import { checkToken } from "../../middlewares/checkToken";
import prisma from "../../prisma";

export const get: Handler[] = [checkToken, async (req, res) => {
  const userId = req.user?.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        pseudo: true,
        email: true,
        avatarUrl: true,
        currentGift: true,
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}];

// Update a user
export const put: Handler[] = [checkToken, async (req, res) => {
  const userId = req.user?.id;
  const { pseudo, email, password, avatarUrl, currentGift } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { pseudo, avatarUrl },
      select: {
        id: true,
        pseudo: true,
        email: true,
        avatarUrl: true,
        currentGift: true,
      }
    });
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}];