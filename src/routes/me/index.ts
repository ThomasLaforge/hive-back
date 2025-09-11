import { Handler } from "express";
import prisma from "../../prisma";

// Update a user
export const put: Handler = async (req, res) => {
  const userId = req.user?.id;
  const { pseudo, email, password, avatarUrl, currentGift, householdId } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { pseudo, email, password, avatarUrl, currentGift, householdId },
    });
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};