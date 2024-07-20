import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import moment from "moment";
import { BASE_URL } from "./consts";
import { useNavigate } from "react-router-dom";

interface Question {
  question: string;
  options: {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
  };
  answers: Array<string>;
}

interface OptionInputProps {
  option: string;
  optionName: string;
  onChange: (index: number) => (e: ChangeEvent<HTMLInputElement>) => void;
  i: number;
  setQuestions: any;
  ques: Question;
  placeholder: string;
}

function OptionInput(props: OptionInputProps) {
  const ques = props.ques;
  const i = props.i;
  return (
    <div className="flex w-full items-center justify-start border rounded-md">
      <input
        className="rounded-l-md p-2 w-full"
        placeholder={props.placeholder}
        type="text"
        value={props.option}
        name={props.optionName}
        onChange={props.onChange(props.i)}
      />
      <div
        role="button"
        onClick={() => {
          props.setQuestions((p: any) => {
            const newQuestions = [...p];
            if (newQuestions[i].answers.includes(props.option)) {
              newQuestions[i].answers = newQuestions[i].answers.filter(
                (ans: any) => ans !== props.option
              );
              return newQuestions;
            }
            newQuestions[i].answers = [
              ...newQuestions[i].answers,
              props.option,
            ];
            return newQuestions;
          });
        }}
        className={
          ques.answers.includes(props.option)
            ? `w-10 rounded-r-md h-full border-l bg-orange-500`
            : `w-10 rounded-r-md h-full border-l`
        }
      ></div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState<string>("");
  const [quizDate, setQuizDate] = useState<any>(moment.utc());
  const [questions, setQuestions] = useState<Array<Question>>([
    {
      question: "",
      options: {
        option1: "",
        option2: "",
        option3: "",
        option4: "",
      },
      answers: [],
    },
  ]);

  async function getQuestions() {
    const res = await fetch(`${BASE_URL}/todays-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: quizDate.format("MM/DD/YYYY"),
      }),
    });

    const body = await res.json();

    if (body.questions.length === 0) {
      setQuestions([
        {
          question: "",
          options: {
            option1: "",
            option2: "",
            option3: "",
            option4: "",
          },
          answers: [],
        },
      ]);
      return;
    }

    setQuestions(
      body.questions.map((q: any) => ({
        question: q.question,
        options: {
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
        },
        answers: q.answers,
      }))
    );
  }

  async function saveQuestions() {
    const res = await fetch(`${BASE_URL}/save-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questions,
        date: quizDate.format("MM/DD/YYYY"),
      }),
    });
    const body = await res.json();

    if (body && body.status === "success") {
      setShowToast("Questions saved successfully");
      return;
    } else {
      setShowToast("Failed to save questions");
    }
  }

  function handleOptionChange(i: number) {
    return function (e: ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target;

      setQuestions((p) => {
        const newQuestions = [...p];
        newQuestions[i].options[name as keyof Question["options"]] = value;
        return newQuestions;
      });
    };
  }

  async function submit() {
    await saveQuestions();
    await getQuestions();
  }

  useEffect(() => {
    getQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizDate]);

  useEffect(() => {
    if (!showToast) return;

    setTimeout(() => {
      setShowToast("");
    }, 3000);
  }, [showToast]);

  return (
    <div className="App w-full h-full">
      <div className="border m-auto w-5/12 h-full p-4">
        <div className="flex items-center justify-between">
          <h1 className="underline text-xl">TriviaBot Admin Panel</h1>
          <h2
            className="underline cursor-pointer"
            onClick={() => navigate("/past-quizzes")}
          >
            Past Quizzes
          </h2>
        </div>
        <h2 className="my-2 text-zinc-600">
          Time (UTC): {new Date().toUTCString()}
        </h2>

        <div className="flex items-center justify-between">
          <h2 className="text-lg my-4">Schedule questions</h2>
          <div className="flex items-center gap-2">
            <p>Quiz Date (UTC):</p>
            <input
              className="border rounded-md p-2"
              type="date"
              value={quizDate.format("yyyy-MM-DD")}
              onChange={(e) => {
                setQuizDate(moment.utc(e.target.value));
              }}
            />
          </div>
        </div>
        <ul
          className="overflow-y-scroll"
          style={{ height: "calc(100% - 200px)" }}
        >
          {questions.map((ques, i) => (
            <li key={i} className="mb-4">
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Question {i + 1}</h3>
                  <button
                    onClick={() => {
                      setQuestions((p) => {
                        const newQuestions = [...p];
                        newQuestions.splice(i, 1);
                        if (newQuestions.length === 0) {
                          newQuestions.push({
                            question: "",
                            options: {
                              option1: "",
                              option2: "",
                              option3: "",
                              option4: "",
                            },
                            answers: [],
                          });
                        }
                        return newQuestions;
                      });
                    }}
                    className="text-red-400 border border-red-400 px-2 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-zinc-600">
                  <div className="my-2">
                    <input
                      className="border rounded-md p-2 mb-3 w-full"
                      placeholder="Question"
                      type="text"
                      value={ques.question}
                      name="question"
                      onChange={(e) =>
                        setQuestions((p) => {
                          const newQuestions = [...p];
                          newQuestions[i].question = e.target.value;
                          return newQuestions;
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full justify-between gap-2">
                      <OptionInput
                        i={i}
                        option={ques.options.option1}
                        optionName="option1"
                        onChange={handleOptionChange}
                        ques={ques}
                        setQuestions={setQuestions}
                        placeholder="Option 1"
                      />
                      <OptionInput
                        i={i}
                        option={ques.options.option2}
                        optionName="option2"
                        onChange={handleOptionChange}
                        ques={ques}
                        setQuestions={setQuestions}
                        placeholder="Option 2"
                      />
                    </div>
                    <div className="flex w-full justify-between gap-2">
                      <OptionInput
                        i={i}
                        option={ques.options.option3}
                        optionName="option3"
                        onChange={handleOptionChange}
                        ques={ques}
                        setQuestions={setQuestions}
                        placeholder="Option 3"
                      />
                      <OptionInput
                        i={i}
                        option={ques.options.option4}
                        optionName="option4"
                        onChange={handleOptionChange}
                        ques={ques}
                        setQuestions={setQuestions}
                        placeholder="Option 4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-between w-full gap-3">
          <button
            onClick={() => {
              setQuestions((p) => [
                ...p,
                {
                  question: "",
                  options: {
                    option1: "",
                    option2: "",
                    option3: "",
                    option4: "",
                  },
                  answers: [],
                },
              ]);
            }}
            className="px-2 py-2 w-full border text-orange-400 border-orange-400 my-2 rounded-md text-center"
          >
            Add new question
          </button>
          <button
            onClick={submit}
            className="px-2 py-2 w-full bg-orange-400 my-2 rounded-md text-center text-white"
          >
            Save
          </button>
        </div>
      </div>
      {showToast && (
        <div
          id="toast"
          className="absolute top-10 left-1/2 right-1/2 w-[300px] border-orange-500 bg-white border text-center p-2 rounded-md shadow-md"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          {showToast}
        </div>
      )}
    </div>
  );
}

export default App;
