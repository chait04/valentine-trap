import React, { useState } from 'react';
import { Heart, ArrowLeft, Send, Copy, CheckCircle2 } from 'lucide-react';

interface FormData {
  senderName: string;
  crushName: string;
  seriousnessLevel: number;
}

const CreateQuizForm = ({ onBack }: { onBack: () => void }) => {
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    crushName: '',
    seriousnessLevel: 5
  });
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLinkGenerated(true);
  };

  const getShareableLink = () => {
    const params = new URLSearchParams({
      sender: formData.senderName,
      crush: formData.crushName,
      level: formData.seriousnessLevel.toString()
    });
    return `${window.location.origin}/quiz?${params.toString()}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareableLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (linkGenerated) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100">
        <button
          onClick={() => setLinkGenerated(false)}
          className="mb-6 text-rose-600 hover:text-rose-700 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="relative">
            <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent blur-xl rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-rose-900 mb-2">Your Quiz is Ready! 🎉</h2>
          <p className="text-rose-600">Share this link with {formData.crushName}:</p>
        </div>

        <div className="bg-rose-50 p-4 rounded-lg mb-6 relative group">
          <p className="text-rose-800 text-sm break-all pr-10">{getShareableLink()}</p>
          <button
            onClick={copyLink}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-600 transition-colors"
          >
            {copied ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="text-center text-rose-600 text-sm">
          <p>Send this link to {formData.crushName} and wait for the magic to happen! ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100">
      <button
        onClick={onBack}
        className="mb-6 text-rose-600 hover:text-rose-700 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-8">
        <div className="relative">
          <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent blur-xl rounded-full"></div>
        </div>
        <h2 className="text-2xl font-bold text-rose-900 mb-2">Create Your Love Quiz</h2>
        <p className="text-rose-600 mt-2">Let's make something special! 💝</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-rose-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            required
            value={formData.senderName}
            onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
            className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition bg-white/50 backdrop-blur-sm"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-2">
            Your Crush's Name
          </label>
          <input
            type="text"
            required
            value={formData.crushName}
            onChange={(e) => setFormData(prev => ({ ...prev, crushName: e.target.value }))}
            className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition bg-white/50 backdrop-blur-sm"
            placeholder="Enter their name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-2">
            Seriousness Level
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-rose-600">Playful</span>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.seriousnessLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, seriousnessLevel: Number(e.target.value) }))}
              className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-sm text-rose-600">Romantic</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuizForm