import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { checkToken } from "../middlewares/checkToken";

const prisma = new PrismaClient();

export const instrumentsRouter = Router();

instrumentsRouter.get("/", async (req, res) => {
    const instruments = await prisma.instrument.findMany();
    res.json(instruments);
});

instrumentsRouter.get("/:id", async (req, res) => {
    const instrument = await prisma.instrument.findFirst({ where: { id: parseInt(req.params.id) } });
    if (instrument) {
        res.json(instrument);
    }
    else {
        res.status(404).send("Instrument not found");
    }
});

instrumentsRouter.post("/", checkToken, async (req, res) => {
    const { name, color, weight, price } = req.body.data;
    if(!name || !color || !weight || !price){
        res.status(400).send("Missing required information");
    }
    else {
        const newinstrument = await prisma.instrument.create({
            data: {
                name, color, weight, price
            }
        });
        res.json(newinstrument);
    }
});

instrumentsRouter.put("/:id", async (req, res) => {
    const { name, weight, color, price } = req.body.data;
    const actual = await prisma.instrument.findFirst({ where: { id: parseInt(req.params.id) } });
    if (actual) {
        const newinstrument = await prisma.instrument.update({ 
            where: { id: parseInt(req.params.id) },
            data: { name, weight, color, price }
        });
        res.json(newinstrument);
    }
    else {
        res.status(404).send("Instrument not found");
    }
});

instrumentsRouter.delete("/:id", async (req, res) => {
    const actual = await prisma.instrument.findFirst({ where: { id: parseInt(req.params.id) } });
    if (actual) {
        await prisma.instrument.delete({ where: { id: parseInt(req.params.id) } });
        res.json(actual);
    }
    else {
        res.status(404).send("Instrument not found");
    }
});