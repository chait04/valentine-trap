import React from 'react';
import { Heart } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface QuizQuestionProps {
  question: string;
  onAnswer: (answer: boolean) => void;
  funnyMessage?: string;
  onNextQuestion?: () => void;
  yesButton?: string;
  noButton?: string;
  currentQuestionNumber?: number;
  totalQuestions?: number;
  yesCount?: number;
  isValentineQuestion?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  funnyMessage,
  onNextQuestion,
  yesButton = 'Yes!',
  noButton = 'No',
  currentQuestionNumber = 0,
  totalQuestions = 12,
  yesCount = 0,
  isValentineQuestion = false
}) => {
  const [searchParams] = useSearchParams();

  return (
    <div className="space-y-8">
      <div className="text-center text-sm font-semibold text-rose-600 mb-6">
        {yesCount < 5 ? `Need ${5 - yesCount} more yes to reach the final question! 💝` : 'Ready for the final question! 💘'}
      </div>
      <div className="w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100">
        {/* Yes Count Indicator */}

        <div className="text-center mb-8">
          <div className="relative">
            <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent blur-xl rounded-full"></div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-4 text-sm text-rose-600">
            Question {currentQuestionNumber + 1}/{totalQuestions}
          </div>

          <h2 className="text-2xl font-bold text-rose-900 mb-6">{question}</h2>

          <div className="space-y-4">
            {!funnyMessage && (
              <div className="space-y-4">
                <button
                  onClick={() => onAnswer(true)}
                  className="w-full bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium py-3 px-6 rounded-full shadow-md transition hover:from-rose-500 hover:to-rose-600 hover:shadow-lg"
                >
                  {yesButton}
                </button>
                <button
                  onClick={() => onAnswer(false)}
                  className="w-full bg-white text-rose-500 font-medium py-3 px-6 rounded-full shadow-md transition hover:bg-gray-50 hover:shadow-lg"
                >
                  {noButton}
                </button>
              </div>
            )}
            {funnyMessage && (
              <div className="text-center mt-3">
                <p className="text-base  text-rose-600 animate-bounce pt-4">{funnyMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Response Message - Outside container with bounce effect */}


      {funnyMessage && !isValentineQuestion && (
        <div className="flex justify-center">
          <button
            onClick={onNextQuestion}
            className="bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-3 px-8 rounded-full shadow-md transition hover:shadow-lg"
          >
            Next Question
          </button>
        </div>
      )}
      {funnyMessage && isValentineQuestion && searchParams.get('demo') === 'true' && (
        <div className="flex justify-center">
          <button
            onClick={onNextQuestion}
            className="bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-3 px-8 rounded-full shadow-md transition hover:shadow-lg"
          >
            Go back
          </button>
        </div>
      )}

    </div>
  );
};

export default QuizQuestion;