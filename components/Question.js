import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Book, Clock } from "lucide-react";

const Question = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showConcept, setShowConcept] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handlePrev = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Question {currentQuestion}
            </CardTitle>
            <div className="flex items-center space-x-2 bg-white text-blue-600 px-3 py-1 rounded-full">
              <Clock size={20} />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-6 space-y-4">
          <p className="text-lg">
            What is the primary function of the mitochondria in a cell?
          </p>
          <div className="space-y-2">
            {[
              "Energy production",
              "Protein synthesis",
              "Cell division",
              "Waste removal",
            ].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="answer"
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor={`option-${index}`} className="text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={handlePrev}
            variant="outline"
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" className="flex items-center">
                <Book className="mr-2 h-4 w-4" /> Show Concept
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Concept: Mitochondria</AlertDialogTitle>
                <AlertDialogDescription>
                  Mitochondria are often referred to as the
                  &quot;powerhouses&quot; of the cell. Their primary function is
                  to produce energy in the form of ATP through the process of
                  cellular respiration.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Close</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleNext} className="flex items-center">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Question;
