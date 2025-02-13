import { useState } from 'react';
import { Heart, SparklesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateQuizForm from './CreateQuizForm';

const LandingPage = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleCreateQuiz = () => setShowForm(true);
  const handlePlayDemo = () => navigate('/quiz?demo=true');

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-12">
        <CreateQuizForm onBack={() => setShowForm(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-6">
            {/* <div className="relative">
              <Heart className="w-16 h-16 opacity-1 text-rose-500 mx-auto animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent blur-xl rounded-full"></div>
            </div> */}
            <h1 className="text-4xl md:text-5xl font-semibold text-rose-900">
              Shoot Your Shot... But Make It a Quiz💘
            </h1>
            
          </div>

          <div className="space-y-4 md:space-y-0 md:flex md:space-x-4 md:justify-center">
            <button
              onClick={handleCreateQuiz}
              className="w-full md:w-64 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-3 px-6 rounded-full shadow-md transition hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Create Your Quiz</span>
            </button>

            <button
              onClick={handlePlayDemo}
              className="w-full md:w-64 bg-white hover:bg-gray-50 text-rose-500 font-medium py-3 px-6 rounded-full shadow-md transition hover:shadow-lg"
            >
              Play a Demo
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Spread love and laughter this Valentine's Day! 💝
          </p>
        </div>
      </main>

      <footer className="py-8 text-center">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Remember, if they say no, it's <span className="font-medium">not rejection</span>—it's{" "}
            <span className="font-medium">character development</span>. 😎💔
          </p>
         
          <p className="text-xs text-gray-500 mt-4">
            Made with <Heart className="w-3 h-3 text-rose-500 inline" /> by Chaitanya
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;