import { useState } from 'react';
import { Heart, SparklesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateQuizForm from './CreateQuizForm';

const LandingPage = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleCreateQuiz = () => setShowForm(true);
  const [selectedDemoTheme, setSelectedDemoTheme] = useState('darkHumor');

  const themes = [
    { id: 'musicVibes', name: 'Music Vibes' },
    { id: 'fandomFrenzy', name: 'Fandom Frenzy' },
    { id: 'retroRomance', name: 'Retro Romance' },
    { id: 'foodieLove', name: 'Foodie Love' },
    { id: 'movieMania', name: 'Movie Mania' },
    { id: 'petLove', name: 'Pet Love' },
    { id: 'darkHumor', name: 'Dark Indian Humor' },
    { id: 'travelGoals', name: 'Travel Goals' },
    { id: 'romanticNights', name: 'Romantic Nights' },
    { id: 'cheekyQuestions', name: 'Cheeky Couples' }
  ];

  const handlePlayDemo = () => navigate(`/quiz?demo=true&theme=${selectedDemoTheme}`);

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
          <div className="space-y-4 text-center">
  <p className="text-sm md:text-lg font-medium text-rose-600 tracking-widest uppercase">
    One Quiz. One Chance.
  </p>
  <h4 className="text-3xl md:text-5xl font-extrabold text-rose-900 leading-tight">
    Your Love Story Begins Here
  </h4>
</div>


          <div className="space-y-4 md:space-y-0 md:flex md:space-x-4 md:justify-center">
            <button
              onClick={handleCreateQuiz}
              className="w-full md:w-1/3 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-3 px-6 rounded-full shadow-md transition hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Create Your Quiz</span>
            </button>

            <div className="w-full md:w-1/3 space-y-2 md:space-y-0 flex flex-col justify-center">
              <select
                value={selectedDemoTheme}
                onChange={(e) => setSelectedDemoTheme(e.target.value)}
                className="w-full h-full px-4 py-3 border border-pink-200 rounded-full focus:ring-2 focus:ring-rose-400 focus:border-transparent transition bg-white/50 backdrop-blur-sm text-rose-600"
              >
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePlayDemo}
              className="w-full md:w-1/3 bg-white hover:bg-gray-50 text-rose-500 font-medium py-3 px-6 rounded-full shadow-md transition hover:shadow-lg"
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