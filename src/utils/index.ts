import crypto from "crypto";
import { v4 as uuid } from "uuid";

export const parseQuestions = (response: any[]): Question[] | null => {
  try {
    return response.map(({ question, difficulty, correct_answer, incorrect_answers }) => {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("aes-256-gcm", process.env.SECRET as string, iv);
      const encrypted = Buffer.concat([cipher.update(Buffer.from(correct_answer)), cipher.final()]);
      const authTag = cipher.getAuthTag();

      return {
        id: uuid(),
        question,
        difficulty,
        correctAnswer: {
          iv: iv.toString("hex"),
          authTag: authTag.toString("hex"),
          answer: encrypted.toString("hex")
        },
        answers: shuffleArray([...incorrect_answers, correct_answer]),
        playerAnswer: null
      };
    });
  } catch (error) {
    return null;
  }
};

export const decryptQuestions = (questions: Question[]): Question[] | null => {
  try {
    return questions.map((question) => {
      const { answer, authTag, iv } = question.correctAnswer as EncryptedAnswer;
      const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        process.env.SECRET as string,
        Buffer.from(iv, "hex")
      );

      decipher.setAuthTag(Buffer.from(authTag, "hex"));

      const decrypted = Buffer.concat([
        decipher.update(Buffer.from((question.correctAnswer as EncryptedAnswer).answer, "hex")),
        decipher.final()
      ]);

      return { ...question, correctAnswer: decrypted.toString("utf-8") };
    });
  } catch (error) {
    return null;
  }
};

function shuffleArray(array: string[]) {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}
