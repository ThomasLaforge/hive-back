import { Handler } from 'express';
import prisma from '../../../prisma';
import { checkToken } from '../../../middlewares/checkToken';

// GET /api/households/:id
// Returns household details with members and their total points (sum of completed task xp within this household)
export const get: Handler[] = [checkToken, async (req, res) => {
  try {
    const requesterId = req.user?.id;
    const idParam = req.params.id;
    const householdId = Number(idParam);
    if (!householdId || Number.isNaN(householdId)) {
      return res.status(400).json({ message: 'Invalid household id' });
    }

    const household = await prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true },
    });
    if (!household) return res.status(404).json({ message: 'Household not found' });

    const isMember = household.members.some((m) => m.id === requesterId);
    if (!isMember) return res.status(403).json({ message: 'Forbidden: not a member of this household' });

    // Fetch all completed tasks tied to tasks within this household, then aggregate per user
    const completions = await prisma.completedTask.findMany({
      where: { task: { householdId } },
      select: { userId: true, xpEarned: true },
    });

    const pointsByUser = new Map<number, number>();
    for (const c of completions) {
      pointsByUser.set(c.userId, (pointsByUser.get(c.userId) || 0) + (c.xpEarned || 0));
    }

    const payload = {
      id: household.id,
      name: household.name,
      avatarUrl: household.avatarUrl,
      ownerId: household.ownerId,
      members: household.members.map((m) => ({
        id: m.id,
        pseudo: m.pseudo,
        avatarUrl: m.avatarUrl,
        points: pointsByUser.get(m.id) || 0,
      })),
    };

    return res.json(payload);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}];

