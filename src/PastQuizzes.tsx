import { useEffect, useState } from "react";
import { BASE_URL } from "./consts";
import clsx from "clsx";

export function PastQuizzes() {
  const [quizzes, setQuizzes] = useState<{
    [date: string]: {
      question: string;
      option1: string;
      option2: string;
      option3: string;
      option4: string;
      answers: Array<string>;
    }[];
  }>({});

  const [expanded, setExpanded] = useState<string | null>(null);

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
      <div className="w-5/12 min-w-[700px] h-full border p-4">
        <h1 className="text-lg mb-4 font-bold">Past Quizzes</h1>

        <div className="select-none">
          {Object.keys(quizzes).map((quiz) => (
            <div key={quiz}>
              <div
                onClick={() => {
                  if (expanded === quiz) {
                    setExpanded(null);
                    return;
                  }
                  setExpanded(quiz);
                }}
                className={clsx(
                  "w-full hover:bg-zinc-100 transition-all cursor-pointer border p-2 rounded-md mb-3 flex items-center justify-between",
                  expanded === quiz
                    ? "bg-zinc-100 border-orange-500"
                    : "text-opacity-30"
                )}
              >
                <div>
                  <h2>Quiz Date: {quiz}</h2>
                  <p>Questions: {quizzes[quiz].length}</p>
                </div>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
              {expanded === quiz && (
                <ul>
                  {quizzes[quiz].map(
                    ({
                      question,
                      option1,
                      option2,
                      option3,
                      option4,
                      answers,
                    }: any) => (
                      <li
                        className="border w-full p-2 rounded-md mb-3"
                        key={question}
                      >
                        <h3 className="font-bold">Q. {question}</h3>

                        <div>
                          <p
                            className={
                              answers.includes(option1) ? "text-orange-600" : ""
                            }
                          >
                            a. {option1}
                          </p>
                          <p
                            className={
                              answers.includes(option2) ? "text-orange-600" : ""
                            }
                          >
                            b. {option2}
                          </p>
                          <p
                            className={
                              answers.includes(option3) ? "text-orange-600" : ""
                            }
                          >
                            c. {option3}
                          </p>
                          <p
                            className={
                              answers.includes(option4) ? "text-orange-600" : ""
                            }
                          >
                            d. {option4}
                          </p>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
