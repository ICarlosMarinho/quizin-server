interface GetQuizReqParams {
  questionsNumber: number;
}

interface EncryptedAnswer {
  iv: string;
  authTag: string;
  answer: string;
}

interface Question {
  id: string;
  question: string;
  category: string;
  correctAnswer: EncryptedAnswer | string;
  answers: string[];
  playerAnswer: string | null;
}

interface Quiz {
  id: string;
  date: string;
  questions: Question[];
}

interface ServerError {
  message: string;
}
