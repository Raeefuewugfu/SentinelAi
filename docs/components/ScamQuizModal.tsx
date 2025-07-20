
import React, { useState, useEffect } from 'react';
import { quizQuestions } from '../data/quizData';
import { XCircleIcon, CheckCircleIcon } from './icons';

interface ScamQuizModalProps {
  onClose: () => void;
}

const ScamQuizModal: React.FC<ScamQuizModalProps> = ({ onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionClick = (optionIndex: number) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
    setShowResult(true);
    if (optionIndex === currentQuestion.correctOptionIndex) {
      setScore(s => s + 1);
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  }

  const getOptionClasses = (optionIndex: number) => {
    if (!showResult) {
      return 'border-surface-2 bg-surface-2/50 hover:bg-surface-2 hover:border-accent/50';
    }
    if (optionIndex === currentQuestion.correctOptionIndex) {
      return 'border-safe bg-safe/20 text-text-primary';
    }
    if (optionIndex === selectedOption) {
      return 'border-danger bg-danger/20 text-text-primary';
    }
    return 'border-surface-2 bg-surface-2/30 opacity-60';
  };

  if (isFinished) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let feedback = { title: "Goed gedaan!", text: "Je hebt een scherp oog voor oplichting.", color: 'text-safe' };
    if (percentage < 80) {
        feedback = { title: "Niet slecht!", text: "Je bent op de goede weg, maar er zijn nog wat aandachtspunten. Lees de uitleg goed door.", color: 'text-caution' };
    }
     if (percentage < 50) {
        feedback = { title: "Opgelet!", text: "Er is ruimte voor verbetering. Het is belangrijk de kenmerken van oplichting goed te leren. Bekijk het Scam Playbook in de Kennisbank.", color: 'text-danger' };
    }

    return (
       <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
        <div className="bg-surface-1 rounded-2xl shadow-2xl border border-surface-2 w-full max-w-lg flex flex-col m-4 animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-center justify-between p-4 border-b border-surface-2">
                <h2 className="text-xl font-bold text-text-primary">Quiz Resultaat</h2>
                 <button onClick={onClose} className="text-text-tertiary hover:text-accent transition-colors"><XCircleIcon className="w-7 h-7" /></button>
            </header>
            <div className="p-8 text-center">
                <p className="text-lg font-semibold text-text-secondary">Je hebt</p>
                <p className={`text-7xl font-bold my-2 ${feedback.color}`}>{score} / {quizQuestions.length}</p>
                <p className="text-lg font-semibold text-text-secondary">vragen goed beantwoord.</p>
                <div className="mt-6">
                    <h3 className={`text-xl font-bold ${feedback.color}`}>{feedback.title}</h3>
                    <p className="text-text-secondary mt-1">{feedback.text}</p>
                </div>
            </div>
            <footer className="p-4 mt-auto flex justify-end gap-4 border-t border-surface-2">
                <button onClick={handleRestart} className="bg-surface-2 text-text-primary font-semibold py-2 px-5 rounded-lg hover:bg-surface-2/80">Opnieuw</button>
                <button onClick={onClose} className="bg-accent text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90">Sluiten</button>
            </footer>
        </div>
       </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 rounded-2xl shadow-2xl border border-surface-2 w-full max-w-2xl flex flex-col m-4 animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-surface-2">
          <h2 className="text-xl font-bold text-text-primary">Herken de Scam Quiz</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-text-secondary">Vraag {currentQuestionIndex + 1} / {quizQuestions.length}</span>
            <button onClick={onClose} className="text-text-tertiary hover:text-accent transition-colors">
              <XCircleIcon className="w-7 h-7" />
            </button>
          </div>
        </header>

        <div className="p-8">
            <p className="text-lg font-semibold text-text-primary mb-6 text-center">{currentQuestion.question}</p>
            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 ${getOptionClasses(index)}`}
                    >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                            {showResult && (index === currentQuestion.correctOptionIndex || index === selectedOption) && 
                                (index === currentQuestion.correctOptionIndex ? <CheckCircleIcon className="w-7 h-7 text-safe"/> : <XCircleIcon className="w-7 h-7 text-danger"/>)
                            }
                        </div>
                        <span className="font-medium">{option}</span>
                    </button>
                ))}
            </div>
        </div>
        
        {showResult && (
             <div className="px-8 pb-8 animate-fade-in-fast">
                <div className={`p-4 rounded-lg ${selectedOption === currentQuestion.correctOptionIndex ? 'bg-safe/10 border-safe/30' : 'bg-danger/10 border-danger/30'} border`}>
                    <h4 className={`font-bold ${selectedOption === currentQuestion.correctOptionIndex ? 'text-safe' : 'text-danger'}`}>
                        {selectedOption === currentQuestion.correctOptionIndex ? 'Correct!' : 'Helaas!'}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">{currentQuestion.explanation}</p>
                </div>
            </div>
        )}

        <footer className="p-4 mt-auto flex justify-end border-t border-surface-2">
            {showResult && (
                <button
                    onClick={handleNext}
                    className="bg-accent text-white font-semibold py-2 px-8 rounded-lg hover:opacity-90"
                >
                    {currentQuestionIndex < quizQuestions.length - 1 ? 'Volgende' : 'Resultaat'}
                </button>
            )}
        </footer>
      </div>
    </div>
  );
};

export default ScamQuizModal;