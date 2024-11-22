"use client";
import React, { useReducer, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, RefreshCw, Clipboard, HelpCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const doctorGifs = {
  neutral: "/assets/doctor.jpg",
  thinking: "/assets/logo_final.png",
  diagnosing: "/assets/logo_final.png",
  explaining: "/assets/logo_final.png",
};

const patientGifs = {
  neutral: "/assets/patient.gif",
  sick: "/assets/patient.gif",
  explaining: "/assets/patient.gif",
  reacting: "/assets/patient.gif",
};

const initialState = {
  messages: [],
  doctorEmotion: "neutral",
  patientEmotion: "neutral",
  currentScenario: null,
  inputMessage: "",
  quizMode: false,
  currentQuizQuestion: null,
  quizScore: 0,
  selectedQuizAnswer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SCENARIO":
      return {
        ...state,
        currentScenario: action.payload,
        messages: [
          {
            id: Date.now(),
            sender: "patient",
            content: action.payload.description,
            emotion: action.payload.initialEmotion,
          },
        ],
        patientEmotion: action.payload.initialEmotion,
        doctorEmotion: "neutral",
        quizMode: false,
        currentQuizQuestion: null,
        quizScore: 0,
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_DOCTOR_EMOTION":
      return {
        ...state,
        doctorEmotion: action.payload,
      };
    case "SET_PATIENT_EMOTION":
      return {
        ...state,
        patientEmotion: action.payload,
      };
    case "SET_INPUT_MESSAGE":
      return {
        ...state,
        inputMessage: action.payload,
      };
    case "SET_QUIZ_MODE":
      return {
        ...state,
        quizMode: action.payload,
      };
    case "SET_QUIZ_QUESTION":
      return {
        ...state,
        currentQuizQuestion: action.payload,
      };
    case "INCREMENT_QUIZ_SCORE":
      return {
        ...state,
        quizScore: state.quizScore + 1,
      };
    case "SET_SELECTED_QUIZ_ANSWER":
      return {
        ...state,
        selectedQuizAnswer: action.payload,
      };
    default:
      return state;
  }
}

const scenarios = [
  {
    id: 1,
    description:
      "You are a 45-year-old patient complaining of chest pain that started two hours ago. The pain is described as a heavy pressure in the center of your chest, radiating to your left arm. You also feel short of breath and slightly nauseous.",
    initialEmotion: "sick",
    responses: {
      ecg: {
        content: "The ECG shows ST-segment elevation in leads V1-V4.",
        emotion: "explaining",
      },
      aspirin: {
        content:
          "After taking the aspirin, I feel a slight relief in my chest pain.",
        emotion: "reacting",
      },
      history: {
        content:
          "I have a history of high blood pressure and high cholesterol. My father had a heart attack at 50.",
        emotion: "explaining",
      },
      default: {
        content:
          "I'm not sure about that. The pain is still there and I'm feeling anxious.",
        emotion: "sick",
      },
    },
    quizQuestions: [
      {
        question:
          "What is the most likely diagnosis based on the patient's symptoms?",
        options: [
          "Acute Myocardial Infarction",
          "Angina",
          "Gastroesophageal Reflux Disease",
          "Pulmonary Embolism",
        ],
        correctAnswer: "Acute Myocardial Infarction",
      },
      {
        question: "What immediate treatment should be administered?",
        options: [
          "Aspirin",
          "Nitroglycerin",
          "Beta-blockers",
          "All of the above",
        ],
        correctAnswer: "All of the above",
      },
    ],
  },
  {
    id: 2,
    description:
      "You are a 28-year-old patient with a persistent cough for the past three weeks. You've also been experiencing fatigue and have noticed some weight loss despite not changing your diet.",
    initialEmotion: "sick",
    responses: {
      xray: {
        content:
          "The chest X-ray shows a small opacity in the upper right lung.",
        emotion: "explaining",
      },
      sputum: {
        content:
          "I haven't noticed any blood in my sputum, but it's been thicker than usual.",
        emotion: "explaining",
      },
      fever: {
        content: "I've had low-grade fevers, especially in the evenings.",
        emotion: "sick",
      },
      default: {
        content:
          "I'm worried about what this could be. Can you help me understand what's going on?",
        emotion: "explaining",
      },
    },
    quizQuestions: [
      {
        question:
          "Based on the symptoms and X-ray findings, what is the most likely diagnosis?",
        options: [
          "Pneumonia",
          "Tuberculosis",
          "Lung Cancer",
          "Chronic Bronchitis",
        ],
        correctAnswer: "Tuberculosis",
      },
      {
        question: "What diagnostic test should be ordered next?",
        options: ["Sputum Culture", "CT Scan", "Bronchoscopy", "Mantoux Test"],
        correctAnswer: "Sputum Culture",
      },
    ],
  },
  {
    id: 3,
    description:
      "You are a 35-year-old patient experiencing severe abdominal pain in the lower right quadrant. The pain started gradually but has become more intense over the last 24 hours. You've lost your appetite and felt nauseous.",
    initialEmotion: "sick",
    responses: {
      palpation: {
        content:
          "The pain intensifies when you press on the lower right side of my abdomen.",
        emotion: "reacting",
      },
      fever: {
        content: "I've had a low-grade fever of about 38°C (100.4°F).",
        emotion: "explaining",
      },
      vomiting: {
        content: "I haven't vomited, but I feel nauseous.",
        emotion: "sick",
      },
      default: {
        content:
          "The pain is really uncomfortable. I'm worried about what it could be.",
        emotion: "sick",
      },
    },
    quizQuestions: [
      {
        question: "What is the most likely diagnosis for this patient?",
        options: [
          "Appendicitis",
          "Gastroenteritis",
          "Ovarian Cyst",
          "Kidney Stones",
        ],
        correctAnswer: "Appendicitis",
      },
      {
        question:
          "What imaging study would be most appropriate for confirming the diagnosis?",
        options: ["Abdominal X-ray", "CT Scan", "Ultrasound", "MRI"],
        correctAnswer: "CT Scan",
      },
    ],
  },
];

export default function MedicalStudentPractice() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    generateNewScenario();
  }, []);

  const generateNewScenario = () => {
    const randomScenario =
      scenarios[Math.floor(Math.random() * scenarios.length)];
    dispatch({ type: "SET_SCENARIO", payload: randomScenario });
  };

  const handleSendMessage = () => {
    if (state.inputMessage.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      sender: "doctor",
      content: state.inputMessage,
      emotion: "diagnosing",
    };

    dispatch({ type: "ADD_MESSAGE", payload: newMessage });
    dispatch({ type: "SET_INPUT_MESSAGE", payload: "" });
    dispatch({ type: "SET_DOCTOR_EMOTION", payload: "thinking" });

    if (state.quizMode) {
      handleQuizResponse(state.inputMessage);
    } else {
      setTimeout(() => {
        const aiResponse = generateAIResponse(state.inputMessage);
        dispatch({ type: "ADD_MESSAGE", payload: aiResponse });
        dispatch({
          type: "SET_PATIENT_EMOTION",
          payload: aiResponse.emotion,
        });
        dispatch({ type: "SET_DOCTOR_EMOTION", payload: "neutral" });
      }, 1000);
    }
  };

  const generateAIResponse = (doctorMessage) => {
    if (!state.currentScenario)
      return {
        id: Date.now(),
        sender: "patient",
        content: "Error: No scenario loaded",
        emotion: "neutral",
      };

    const lowerCaseMessage = doctorMessage.toLowerCase();
    let response = state.currentScenario.responses.default;

    for (const [keyword, res] of Object.entries(
      state.currentScenario.responses,
    )) {
      if (lowerCaseMessage.includes(keyword)) {
        response = res;
        break;
      }
    }

    return {
      id: Date.now(),
      sender: "patient",
      content: response.content,
      emotion: response.emotion,
    };
  };

  const startQuiz = () => {
    dispatch({ type: "SET_QUIZ_MODE", payload: true });
    askQuizQuestion();
  };

  const askQuizQuestion = () => {
    if (
      !state.currentScenario ||
      state.currentScenario.quizQuestions.length === 0
    ) {
      endQuiz();
      return;
    }

    const randomQuestion =
      state.currentScenario.quizQuestions[
        Math.floor(Math.random() * state.currentScenario.quizQuestions.length)
      ];

    dispatch({ type: "SET_QUIZ_QUESTION", payload: randomQuestion });

    const questionMessage = {
      id: Date.now(),
      sender: "system",
      content: `${randomQuestion.question}\n\nOptions:\n${randomQuestion.options
        .map((option, index) => `${index + 1}. ${option}`)
        .join("\n")}`,
      emotion: "neutral",
    };

    dispatch({ type: "ADD_MESSAGE", payload: questionMessage });
  };

  const handleQuizResponse = () => {
    if (state.selectedQuizAnswer === null) return;

    const currentQuestion = state.currentQuizQuestion;
    const selectedAnswer = currentQuestion.options[state.selectedQuizAnswer];

    if (selectedAnswer === currentQuestion.correctAnswer) {
      dispatch({ type: "INCREMENT_QUIZ_SCORE" });
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          id: Date.now(),
          sender: "system",
          content: "Correct! Well done.",
          emotion: "neutral",
        },
      });
    } else {
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          id: Date.now(),
          sender: "system",
          content: `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`,
          emotion: "neutral",
        },
      });
    }

    // Remove the asked question from the list
    state.currentScenario.quizQuestions =
      state.currentScenario.quizQuestions.filter((q) => q !== currentQuestion);

    // Reset selected answer
    dispatch({ type: "SET_SELECTED_QUIZ_ANSWER", payload: null });

    // Ask the next question or end the quiz
    if (state.currentScenario.quizQuestions.length > 0) {
      askQuizQuestion();
    } else {
      endQuiz();
    }
  };

  const endQuiz = () => {
    dispatch({ type: "SET_QUIZ_MODE", payload: false });
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        id: Date.now(),
        sender: "system",
        content: `Quiz completed. Your score: ${state.quizScore}/${scenarios[0].quizQuestions.length}`,
        emotion: "neutral",
      },
    });
  };

  return (
    <div className="flex h-[89vh] bg-gray-100">
      {/* Patient's GIF */}
      <div className="w-1/4 p-4 flex flex-col items-center justify-center bg-white">
        <img
          src={patientGifs[state.patientEmotion]}
          alt="Patient"
          className="w-full h-auto rounded-full mb-4"
        />
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">
            AI-Powered Patient Scenario
          </h2>
          <p className="text-sm text-gray-600">
            Responds based on the scenario
          </p>
        </div>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() =>
            state.currentScenario &&
            navigator.clipboard.writeText(state.currentScenario.description)
          }
        >
          <Clipboard className="h-4 w-4 mr-2" />
          Copy Scenario
        </Button>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 m-4 overflow-hidden flex flex-col">
          <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
            <h2 className="text-2xl font-bold">AI Patient Scenario</h2>
            <div className="flex space-x-2">
              <Button
                onClick={startQuiz}
                variant="secondary"
                disabled={state.quizMode}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Start Quiz
              </Button>
              <Button onClick={generateNewScenario} variant="secondary">
                <RefreshCw className="h-4 w-4 mr-2" />
                New Scenario
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            {state.messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.sender === "patient"
                    ? "justify-start"
                    : message.sender === "doctor"
                      ? "justify-end"
                      : "justify-center"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === "patient"
                      ? "bg-blue-100"
                      : message.sender === "doctor"
                        ? "bg-green-100"
                        : "bg-gray-100"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="p-4 border-t">
            {state.quizMode ? (
              <div className="space-y-4">
                <RadioGroup
                  onValueChange={(value) =>
                    dispatch({
                      type: "SET_SELECTED_QUIZ_ANSWER",
                      payload: parseInt(value),
                    })
                  }
                  value={
                    state.selectedQuizAnswer !== null
                      ? state.selectedQuizAnswer.toString()
                      : undefined
                  }
                >
                  {state.currentQuizQuestion?.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                      />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button
                  onClick={handleQuizResponse}
                  disabled={state.selectedQuizAnswer === null}
                >
                  Submit Answer
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  placeholder="What would you like to ask or do?"
                  value={state.inputMessage}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_INPUT_MESSAGE",
                      payload: e.target.value,
                    })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
      {/* Doctor's GIF */}
      <div className="w-1/4 p-4 flex flex-col items-center justify-center bg-white">
        <img
          src={doctorGifs[state.doctorEmotion]}
          alt="Doctor"
          className="w-full h-auto rounded-full mb-4"
        />
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">You</h2>
          <p className="text-sm text-gray-600">
            Practice your diagnostic skills
          </p>
        </div>
      </div>
    </div>
  );
}
