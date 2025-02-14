import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import QuizCompletion from './QuizCompletion';
import { ArrowLeft } from 'lucide-react';
import { useQuizState } from '../hooks/useQuizState';
import { useThemeQuestions } from '../hooks/useThemeQuestions';
import QuizQuestion from './QuizQuestion';

const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    quizData,
    yesCount,
    askedQuestions,
    currentQuestionIndex,
    showResponse,
    lastAnswer,
    quizCompleted,
    isValentineQuestion,
    setAskedQuestions,
    setCurrentQuestionIndex,
    setShowResponse,
    setLastAnswer,
    setIsValentineQuestion,
    calculateCompatibilityScore,
    loadQuizData,
    handleAnswer
  } = useQuizState();

  const { getThemeQuestions } = useThemeQuestions(quizData?.theme);

  useEffect(() => {
    loadQuizData();
  }, [loadQuizData]);

  const handleNextQuestion = () => {
    setShowResponse(false);
    setLastAnswer(null);

    if (yesCount >= 5 && !isValentineQuestion) {
      setIsValentineQuestion(true);  // Trigger Valentine question
      return;
    }

    // Redirect to home page if it was the Valentine question
    if (isValentineQuestion) {
      window.location.href = '/';
      return;
    }

    const themeQuestions = getThemeQuestions();
    const availableQuestions = themeQuestions
      .map((_, index) => index)
      .filter((index) => !askedQuestions.includes(index));

    if (availableQuestions.length === 0) {
      setAskedQuestions([]);
      setCurrentQuestionIndex(0);
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setCurrentQuestionIndex(availableQuestions[randomIndex]);
      setAskedQuestions((prev) => [...prev, availableQuestions[randomIndex]]);
    }
  };

  if (!quizData) return null;

  if (quizCompleted) {
    return (
      <QuizCompletion
        senderName={quizData.senderName}
        crushName={quizData.crushName}
        seriousnessLevel={quizData.seriousnessLevel}
        compatibilityScore={calculateCompatibilityScore()}
        accepted={lastAnswer || false}
      />
    );
  }

  const currentQuestionText = isValentineQuestion
    ? `Will you be my Valentine, ${quizData.crushName}?`
    : getThemeQuestions()[currentQuestionIndex].question.replace(/\[Sender Name\]/g, quizData.senderName);

  const responseMessage = showResponse
    ? isValentineQuestion
      ? searchParams.get('demo') === 'true'
        ? 'Now create your own quiz'
        : 'Congratulations! 🎉'
      : lastAnswer
        ? getThemeQuestions()[currentQuestionIndex].yesResponse
        : getThemeQuestions()[currentQuestionIndex].noResponse
    : undefined;

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {searchParams.get('demo') === 'true' && (
        <button
          onClick={() => window.location.href = '/'}
          className="absolute top-4 left-4 text-rose-600 hover:text-rose-700 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
      <div className="container mx-auto px-4 py-12">
        <QuizQuestion
          question={currentQuestionText}
          onAnswer={(answer) => handleAnswer(answer, currentQuestionText)}
          funnyMessage={responseMessage}
          onNextQuestion={handleNextQuestion}
          yesButton={isValentineQuestion ? 
            (showResponse && searchParams.get('demo') === 'true' ? "Go back" : "Yes! 💝") 
            : getThemeQuestions()[currentQuestionIndex].yesButton}
          noButton={isValentineQuestion ? 
            (showResponse && searchParams.get('demo') === 'true' ? "Go back" : "No 💔") 
            : getThemeQuestions()[currentQuestionIndex].noButton}
          currentQuestionNumber={askedQuestions.length}
          totalQuestions={12}
          yesCount={yesCount}
          isValentineQuestion={isValentineQuestion}
        />
      </div>
    </div>
  );
};

export default QuizPage;
