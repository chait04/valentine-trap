import { useCallback } from 'react';
import { cheekyCouplesQuestions } from '../data/themes/cheekyCouples';
import { foodieLoveQuestions } from '../data/themes/foodieLove';
import { petLoveQuestions } from '../data/themes/petLove';
import { musicVibesQuestions } from '../data/themes/musicVibes';
import { fandomFrenzyQuestions } from '../data/themes/fandomFrenzy';
import { retroRomanceQuestions } from '../data/themes/retroRomance';
import { movieManiaQuestions } from '../data/themes/movieMania';
import { darkIndianHumorQuestions } from '../data/themes/darkHumor';
import { travelGoalsQuestions } from '../data/themes/travelGoals';
import { romanticNightQuestions } from '../data/themes/romanticNights';

export const useThemeQuestions = (theme?: string) => {
  const getThemeQuestions = useCallback(() => {
    switch(theme) {
      case 'cheekyQuestions':
        return cheekyCouplesQuestions;
      case 'foodieLove':
        return foodieLoveQuestions;
      case 'petLove':
        return petLoveQuestions;
      case 'musicVibes':
        return musicVibesQuestions  ; // Temporarily using foodieLove until musicVibes is implemented
      case 'fandomFrenzy':
        return fandomFrenzyQuestions; // Temporarily using cheekyQuestions until fandomFrenzy is implemented
      case 'retroRomance':
        return retroRomanceQuestions; // Temporarily using foodieLove until retroRomance is implemented
      case 'movieMania':
        return movieManiaQuestions; // Temporarily using cheekyQuestions until movieMania is implemented
      case 'darkHumor':
        return darkIndianHumorQuestions; // Temporarily using cheekyQuestions until darkHumor is implemented
      case 'travelGoals':
        return travelGoalsQuestions; // Temporarily using foodieLove until travelGoals is implemented
      case 'romanticNights':
        return romanticNightQuestions; // Temporarily using cheekyQuestions until romanticNights is implemented
      default:
        return fandomFrenzyQuestions; // Default to foodieLove theme
    }
  }, [theme]);

  return { getThemeQuestions };
};