import axios from "axios";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { decryptQuestions, parseQuestions } from "../utils";

export const getQuiz = async (req: Request<GetQuizReqParams>, res: Response<Quiz | ServerError>) => {
  try {
    const { data } = await axios.get(process.env.TDB_URL as string, {
      params: {
        amount: Number(req.params.questionsNumber)
      }
    });

    return res.status(200).json({
      id: uuid(),
      date: new Date().toISOString(),
      questions: parseQuestions(data.results) as Question[]
    });
  } catch (error) {
    res.status(500).json({ message: "An server error has ocurred." });
  }
};

export const revealAnswers = (req: Request<{}, {}, Question[]>, res: Response<Question[] | ServerError>) => {
  try {
    const questions = req.body;

    return res.status(200).json(decryptQuestions(questions) as Question[]);
  } catch (error) {
    res.status(500).json({ message: "An server error has ocurred." });
  }
};
