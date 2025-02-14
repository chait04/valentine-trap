import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import cutuGif from '../assests/cutu.gif';

interface QuizCompletionProps {
  senderName: string;
  crushName: string;
  seriousnessLevel: number;
  compatibilityScore: number;
  accepted: boolean;
}

const QuizCompletion: React.FC<QuizCompletionProps> = ({
  senderName,
  crushName,
  accepted,
}) => {
  const navigate = useNavigate(); 

  useEffect(() => {
    if (accepted) {
      // Trigger confetti when the component mounts and the quiz is accepted
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }, [accepted]);

  if (!accepted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100">
          <div className="text-center space-y-6">
            <div className="relative">
              <Heart className="w-16 h-16 text-rose-500/50 mx-auto" />
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent blur-xl rounded-full"></div>
            </div>
            <h2 className="text-3xl font-bold text-rose-900">
              Oh no... 💔
            </h2>
            <p className="text-xl text-rose-700 mb-4">
              {crushName} has declined {senderName}'s Valentine request
            </p>
            <p className="text-base text-rose-600">
              Don't worry, there are plenty of fish in the sea! 🌊
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-rose-600 text-white py-2 px-4 rounded hover:bg-rose-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100 text-center">
        <h2 className="text-3xl font-bold text-rose-900 mb-4">
          You are made for each other! 💞
        </h2>
        <p className="text-xl text-rose-700 mb-4">
          {senderName} & {crushName}
        </p>
        <div className="flex justify-center">
          <img src={cutuGif} alt="Valentine GIF" className="w-32 h-32" />
        </div>
        <p className="text-lg text-rose-800 font-medium mt-4">
          Now go make kids! 🎉
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-rose-600 text-white py-2 px-4 rounded hover:bg-rose-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default QuizCompletion;