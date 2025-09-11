import cors from "cors";
import "dotenv/config";
import express from "express";
import { router } from "express-file-routing";


const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  app.use("/api", await router()); // as router middleware or
})();

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT} and routes are ready!`);
});
