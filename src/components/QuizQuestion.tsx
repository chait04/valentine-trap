import React from 'react';
import { Heart, X, ArrowRight } from 'lucide-react';

interface QuizQuestionProps {
  question: string;
  onAnswer: (answer: boolean) => void;
  funnyMessage?: string;
  yesMessage?: string;
  onNextQuestion?: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
  question, 
  onAnswer, 
  funnyMessage,
  yesMessage,
  onNextQuestion 
}) => {
  return (
    <div className="space-y-8">
      <div className="w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100">
        <div className="text-center mb-8">
          <div className="relative">
            <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent blur-xl rounded-full"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-rose-900 mb-4">{question}</h2>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onAnswer(true)}
            className="flex-1 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Yes
          </button>
          
          <button
            onClick={() => onAnswer(false)}
            className="flex-1 bg-white hover:bg-gray-50 text-rose-500 font-semibold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-2 border border-rose-200"
          >
            <X className="w-5 h-5" />
            No
          </button>
        </div>
      </div>

      {(funnyMessage || yesMessage) && (
        <div className="w-full max-w-md mx-auto text-center space-y-4">
          <p className={`text-2xl font-bold ${yesMessage ? 'text-rose-500' : 'text-rose-600'} ${!yesMessage && 'animate-bounce'}`}>
            {yesMessage || funnyMessage}
          </p>
          <button
            onClick={onNextQuestion}
            className="bg-rose-100 hover:bg-rose-200 text-rose-600 font-semibold py-2 px-4 rounded-full inline-flex items-center gap-2 transition-colors"
          >
            Next Question
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;