import cors from "cors";
import "dotenv/config";
import express from "express";

import { authRouter } from "./router/auth";
import { instrumentsRouter } from "./router/instruments";
import { reparationsRouter } from "./router/reparations";

const app = express();
app.use(cors());
app.use(express.json());

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/instruments', instrumentsRouter );
apiRouter.use('/reparations', reparationsRouter );

app.get('/bananes', (req, res) => {
  if(req.query.couleur === 'jaune'){
    res.json({
      couleur: 'jaune',
      price: 2.5
    })
  }
  else {
    res.json({
      couleur: null,
      price: 0.1
    })
  }
})

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
