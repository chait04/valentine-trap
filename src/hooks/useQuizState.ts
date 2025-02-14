import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { databases, DB_ID, QUIZZES_COLLECTION_ID, RESPONSES_COLLECTION_ID } from '../lib/appwrite';
import { useThemeQuestions } from './useThemeQuestions';

interface QuizData {
  senderName: string;
  crushName: string;
  seriousnessLevel: number;
  theme: string;
}

const DEMO_DATA = {
  senderName: "cutu",
  crushName: "sakura",
  seriousnessLevel: 7,
};

export const useQuizState = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [yesCount, setYesCount] = useState(0);
  const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showResponse, setShowResponse] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isValentineQuestion, setIsValentineQuestion] = useState(false);
  const [responses, setResponses] = useState<Array<{question: string, answer: boolean}>>([]);

  const calculateCompatibilityScore = useCallback(() => {
    if (!quizData) return 75;
    const baseScore = Math.floor(Math.random() * 21) + 75;
    const seriousnessAdjustment = (quizData.seriousnessLevel - 5) * 1;
    return Math.min(100, Math.max(70, baseScore + seriousnessAdjustment));
  }, [quizData]);

  const loadQuizData = useCallback(async () => {
    const quizId = searchParams.get('quizId');
    const isDemo = searchParams.get('demo') === 'true';

    if (isDemo) {
      const demoTheme = searchParams.get('theme') || 'darkHumor';
      setQuizData({ ...DEMO_DATA, theme: demoTheme });
    } else if (quizId) {
      try {
        const quiz = await databases.getDocument(DB_ID, QUIZZES_COLLECTION_ID, quizId);
        setQuizData({
          senderName: quiz.senderName,
          crushName: quiz.crushName,
          seriousnessLevel: quiz.seriousnessLevel,
          theme: quiz.theme,
        });
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [searchParams, navigate]);

  const { getThemeQuestions } = useThemeQuestions(quizData?.theme);

  const handleAnswer = useCallback(async (answer: boolean, currentQuestion: string) => {
    setLastAnswer(answer);
    setShowResponse(true);
    setResponses(prev => [...prev, { question: currentQuestion, answer }]);

    if (isValentineQuestion) {
      try {
        const quizId = searchParams.get('quizId');
        if (!quizId) return;

        const quiz = await databases.getDocument(DB_ID, QUIZZES_COLLECTION_ID, quizId);

        await databases.createDocument(DB_ID, RESPONSES_COLLECTION_ID, 'unique()', {
          quizId,
          crushName: quizData?.crushName,
          finalAnswer: answer ? 'Yes! 💝' : 'No 💔',
          answers: responses.map(r => r.answer ? getThemeQuestions()[currentQuestionIndex].yesButton : getThemeQuestions()[currentQuestionIndex].noButton),
          questions: responses.map(r => r.question),
          responses: responses.map((r, i) => `${r.question}: ${r.answer ? getThemeQuestions()[i].yesButton : getThemeQuestions()[i].noButton}`),
          answeredAt: new Date().toISOString(),
        });

        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #e11d48; text-align: center; margin-bottom: 30px;">
              ${quizData?.crushName} has ${answer ? '<span style="color: #16a34a;">accepted</span>' : '<span style="color: #dc2626;">declined</span>'} your Valentine's request! ${answer ? '🎉 💝' : '💔'}
            </h1>

            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #991b1b; margin-bottom: 15px;">Quiz Responses:</h2>
              <div style="line-height: 1.6;">
                ${responses.map((r, i) => `
                  <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #fecdd3;">
                    <p style="color: #881337; font-weight: bold; margin: 0;">${i + 1}. ${r.question}</p>
                    <p style="color: ${r.answer ? '#16a34a' : '#dc2626'}; margin: 5px 0 0 20px;">
                      Answer: ${r.answer ? getThemeQuestions()[i].yesButton : getThemeQuestions()[i].noButton}
                    </p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="text-align: center; padding: 20px; background-color: ${answer ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: ${answer ? '#16a34a' : '#dc2626'}; margin-bottom: 10px;">Final Valentine's Answer</h2>
              <p style="font-size: 24px; margin: 0;">
                ${answer ? 'Yes! 💝 Let\'s make memories together!' : 'No 💔 Maybe next time...'}
              </p>
            </div>

            <p style="color: #666; text-align: center; font-size: 14px; margin-top: 20px;">
              Answered on ${new Date().toLocaleString()}
            </p>
          </div>
        `;

        await databases.createDocument(DB_ID, 'email_queue', 'unique()', {
          to: quiz.creatorEmail,
          subject: `💘 ${quizData?.crushName} Responded to Your Valentine Quiz!`,
          content: emailContent,
          status: 'pending',
          createdAt: new Date().toISOString()
        });

        setQuizCompleted(true);
      } catch (error) {
        console.error('Failed to save response:', error);
        setQuizCompleted(true);
      }
    } else if (answer) {
      setYesCount((prev) => prev + 1);
    }
  }, [isValentineQuestion, quizData, responses, searchParams]);

  return {
    quizData,
    yesCount,
    askedQuestions,
    currentQuestionIndex,
    showResponse,
    lastAnswer,
    quizCompleted,
    isValentineQuestion,
    responses,
    setAskedQuestions,
    setCurrentQuestionIndex,
    setShowResponse,
    setLastAnswer,
    setIsValentineQuestion,
    calculateCompatibilityScore,
    loadQuizData,
    handleAnswer
  };
};