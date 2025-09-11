import { Handler } from 'express';
import prisma from '../../prisma';

export const get: Handler = async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Adjust to Monday of the current week
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of Sunday
    endOfWeek.setHours(23, 59, 59, 999);

    const ranking = await prisma.completedTask.groupBy({
      by: ['userId'],
      _sum: {
        xpEarned: true,
      },
      where: {
        completedAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: {
        _sum: {
          xpEarned: 'desc',
        },
      },
    });

    const rankingWithUserDetails = await Promise.all(ranking.map(async (item) => {
      const user = await prisma.user.findUnique({
        where: { id: item.userId },
        select: { id: true, pseudo: true, avatarUrl: true }, // Select only necessary fields
      });
      return {
        userId: item.userId,
        xpEarned: item._sum.xpEarned,
        userPseudo: user?.pseudo,
        userAvatarUrl: user?.avatarUrl,
      };
    }));

    res.json(rankingWithUserDetails);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
