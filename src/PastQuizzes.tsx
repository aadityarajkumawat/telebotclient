import { useEffect, useState } from "react";
import { BASE_URL } from "./consts";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export function PastQuizzes() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<{
    [date: string]: {
      question: string;
      option1: string;
      option2: string;
      option3: string;
      option4: string;
    }[];
  }>({});

  const [expanded, setExpanded] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  async function pastQuizzes() {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/past-quizzes`);
    const body = await res.json();
    setQuizzes(body.quizzes);
    setLoading(false);
  }

  useEffect(() => {
    pastQuizzes();
  }, []);

  return (
    <div className="w-full h-full flex justify-start items-start">
      <div className="w-[350px] border-r h-full px-5 py-5 bg-zinc-100">
        <div>
          <h1 className="underline text-xl">TriviaBot Admin Panel</h1>
          <h2 className="my-2 text-zinc-600">
            Time: {new Date().toUTCString()}
          </h2>
        </div>

        <div className="mt-5">
          <ul>
            <li
              role="button"
              className="mb-2 hover:text-orange-500 transition-all px-2 py-2 rounded-md hover:bg-white"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              role="button"
              className="mb-2 hover:text-orange-500 transition-all px-2 py-2 rounded-md hover:bg-white"
              onClick={() => navigate("/past-quizzes")}
            >
              Past Quizzes
            </li>
            <li
              role="button"
              className="mb-2 hover:text-orange-500 transition-all px-2 py-2 rounded-md hover:bg-white"
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </li>
          </ul>
        </div>
      </div>
      <div className="w-5/12 min-w-[700px] h-full p-4">
        <h1 className="text-lg mb-4 font-medium">Past Quizzes</h1>

        <div className="select-none">
          {loading && (
            <div className="w-full py-10 flex justify-center items-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-300 fill-orange-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
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
                    ({ question, option1, option2, option3, option4 }: any) => (
                      <li
                        className="border w-full p-2 rounded-md mb-3"
                        key={question}
                      >
                        <h3 className="font-bold">Q. {question}</h3>

                        <div>
                          <p>a. {option1}</p>
                          <p>b. {option2}</p>
                          <p>c. {option3}</p>
                          <p>d. {option4}</p>
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
