import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QuizQuestion from './QuizQuestion';
import QuizCompletion from './QuizCompletion';
import { ArrowLeft } from 'lucide-react';
import { quizQuestions } from '../data/quizQuestions';
import { databases, DB_ID, QUIZZES_COLLECTION_ID, RESPONSES_COLLECTION_ID } from '../lib/appwrite';

const DEMO_DATA = {
  senderName: "Chaitanya",
  crushName: "Alexa",
  seriousnessLevel: 7,
};

const FUNNY_RESPONSES = {
  yesResponses: [
    "Aww, you said yes! My heart is doing a happy dance! 💃💖",
    "Yes? OMG, we're officially the cutest couple! 😍",
    "You just made my day! Prepare for endless love and emojis. 😘💌",
  ],
  noResponses: [
    "No? Hmm... maybe you're just playing hard to get. 😉",
    "Oh no! My heart just broke a little. 💔 Try again?",
    "Still a no? Alright, I can take the hint... but you'll regret it! 😏",
  ],
};

const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<{
    senderName: string;
    crushName: string;
    seriousnessLevel: number;
  } | null>(null);

  const [yesCount, setYesCount] = useState(0);
  const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showResponse, setShowResponse] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isValentineQuestion, setIsValentineQuestion] = useState(false);
  const [noResponseIndex, setNoResponseIndex] = useState(0);

  const calculateCompatibilityScore = useCallback(() => {
    if (!quizData) return 75;
    const baseScore = Math.floor(Math.random() * 21) + 75;
    const seriousnessAdjustment = (quizData.seriousnessLevel - 5) * 1;
    return Math.min(100, Math.max(70, baseScore + seriousnessAdjustment));
  }, [quizData]);

  useEffect(() => {
    const loadQuizData = async () => {
      const quizId = searchParams.get('quizId');
      const isDemo = searchParams.get('demo') === 'true';
      const sender = searchParams.get('sender');
      const crush = searchParams.get('crush');
      const level = searchParams.get('level');

      if (isDemo) {
        setQuizData(DEMO_DATA);
      } else if (quizId && sender && crush && level) {
        try {
          // Verify if quiz exists
          await databases.getDocument(DB_ID, QUIZZES_COLLECTION_ID, quizId);
          
          setQuizData({
            senderName: sender,
            crushName: crush,
            seriousnessLevel: parseInt(level, 10),
          });
        } catch (error) {
          console.error('Failed to verify quiz:', error);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    loadQuizData();
  }, [searchParams, navigate]);

  const handleAnswer = async (answer: boolean) => {
    setLastAnswer(answer);
    setShowResponse(true);
  
    if (isValentineQuestion && answer) {
      try {
        const quizId = searchParams.get('quizId');
        if (!quizId) return;
  
        // Adjust to match the schema for responses
        await databases.createDocument(DB_ID, RESPONSES_COLLECTION_ID, 'unique()', {
          quizId,
          crushName: quizData?.crushName,
          finalAnswer: 'Yes',
          answeredAt: new Date().toISOString(),
        });
  
        // Queue the email notification
        await databases.createDocument(DB_ID, 'email_queue', 'unique()', {
          to: searchParams.get('email'), // Get email from URL params
          subject: '💘 Someone Said Yes to Your Valentine Quiz!',
          content: `Great news! ${quizData?.crushName} has accepted your Valentine's request! Time to celebrate! 🎉`,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
  
        setQuizCompleted(true);
      } catch (error) {
        console.error('Failed to save response:', error);
        setQuizCompleted(true); // Complete the quiz despite the error
      }
    } else if (isValentineQuestion) {
      setNoResponseIndex((prev) => (prev + 1) % FUNNY_RESPONSES.noResponses.length);
    } else if (answer) {
      setYesCount((prev) => prev + 1);
    }
  };
  

  const handleNextQuestion = () => {
    setShowResponse(false);
    setLastAnswer(null);

    if (yesCount >=5 && !isValentineQuestion) {
      setIsValentineQuestion(true);  // Trigger Valentine question
      return;
    }

    const availableQuestions = quizQuestions
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
        accepted={true}
      />
    );
  }

  const currentQuestionText = isValentineQuestion
    ? `Will you be my Valentine, ${quizData.crushName}?`
    : quizQuestions[currentQuestionIndex].question.replace(/\[Sender Name\]/g, quizData.senderName);

  const responseMessage = showResponse
    ? isValentineQuestion
      ? lastAnswer
        ? FUNNY_RESPONSES.yesResponses[Math.floor(Math.random() * FUNNY_RESPONSES.yesResponses.length)]
        : FUNNY_RESPONSES.noResponses[noResponseIndex]
      : lastAnswer
      ? quizQuestions[currentQuestionIndex].yesResponse
      : quizQuestions[currentQuestionIndex].noResponse
    : undefined;

  return (
    <div className="container mx-auto px-4 py-12">
      {searchParams.get('demo') === 'true' && (
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-rose-600 hover:text-rose-700 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
      <QuizQuestion
        question={currentQuestionText}
        onAnswer={handleAnswer}
        funnyMessage={responseMessage}
        onNextQuestion={isValentineQuestion ? undefined : handleNextQuestion} 
      />
    </div>
  );
};

export default QuizPage;
