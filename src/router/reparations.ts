import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { checkToken } from "../middlewares/checkToken";

const prisma = new PrismaClient();

export const reparationsRouter = Router();

reparationsRouter.use(checkToken);

reparationsRouter.post("/", async (req, res) => {
    const { name, price, instrumentId } = req.body.data;
    if(!name || !price || !instrumentId){
        res.status(400).send("Missing required information");
    }
    else {
        const newinstrument = await prisma.reparation.create({
            data: {
                name, 
                price,
                instrumentId
            }
        });
        res.json(newinstrument);
    }
});

reparationsRouter.delete("/:id", async (req, res) => {
    const actual = await prisma.reparation.findFirst({ where: { id: parseInt(req.params.id) } });
    if (actual) {
        await prisma.reparation.delete({ where: { id: parseInt(req.params.id) } });
        res.json(actual);
    }
    else {
        res.status(404).send("Instrument not found");
    }
});