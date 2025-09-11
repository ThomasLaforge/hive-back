import { Handler } from "express";
import { checkToken } from "../../../middlewares/checkToken";
import prisma from "../../../prisma";

export const PUT: Handler[] = [checkToken, async (req, res) => {
  const userId = req.user?.id;
  const { title } = req.body;
  try {
    const updatedGift = await prisma.user.update({
      where: { id: userId },
      data: {
        currentGift: title
      },
      select: {
        id: true,
        pseudo: true,
        email: true,
        avatarUrl: true,
        currentGift: true,
      }
    });
    return res.json(updatedGift);
  } catch (error) {
    console.error("Error updating gift:", error);
    return res.status(500).json({ message: "Error updating gift" });
  }
}];