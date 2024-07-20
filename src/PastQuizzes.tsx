import { useEffect, useState } from "react";
import { BASE_URL } from "./consts";

export function PastQuizzes() {
  const [quizzes, setQuizzes] = useState<{
    [date: string]: {
      question: string;
      option1: string;
      option2: string;
      option3: string;
      option4: string;
    }[];
  }>({});

  async function pastQuizzes() {
    const res = await fetch(`${BASE_URL}/past-quizzes`);
    const body = await res.json();
    setQuizzes(body.quizzes);
  }

  useEffect(() => {
    pastQuizzes();
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-5/12 h-full border p-4">
        <h1 className="text-lg font-bold">Past Quizzes</h1>

        <div>
          {Object.keys(quizzes).map((quiz) => (
            <div key={quiz}>
              <h2>Quiz Date: {quiz}</h2>
              <ul>
                {quizzes[quiz].map(
                  ({ question, option1, option2, option3, option4 }: any) => (
                    <li
                      className="border w-full p-2 rounded-md mb-3"
                      key={question}
                    >
                      <h3 className="font-bold">Q. {question}</h3>

                      <div>
                        <p>{option1}</p>
                        <p>{option2}</p>
                        <p>{option3}</p>
                        <p>{option4}</p>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
