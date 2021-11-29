import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import { getQuiz, revealAnswers } from "./controller";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/getQuiz/:questionsNumber", getQuiz);
app.patch("/revealAnswers", revealAnswers);

app.listen(port, () => {
  console.log(`app is listening at port ${port}`);
});
