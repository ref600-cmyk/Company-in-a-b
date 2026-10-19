import React, { useState, useEffect } from 'react';
import { PITCH_DECK_SLIDES } from '../data/pitchDeckData.ts';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  MessageSquare, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentSlide = PITCH_DECK_SLIDES[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex(prev => Math.min(PITCH_DECK_SLIDES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopySlide = () => {
    const text = `SLIDE ${currentSlide.id}: ${currentSlide.title}\n${currentSlide.subtitle}\n\n` +
      currentSlide.keyPoints.map(p => `• ${p.heading}: ${p.description}`).join('\n') +
      (currentSlide.statNumber ? `\n\nMetric: ${currentSlide.statNumber} (${currentSlide.statLabel})` : '');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[750px] rounded-2xl border border-cyan-500/40 bg-slate-900 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Presentation className="w-4 h-4" />
              <span>SkyShadow Investor & Enterprise Pitch Deck</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-mono text-slate-400">
              Slide {currentSlide.id} of {PITCH_DECK_SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                showSpeakerNotes
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Speaker Notes</span>
            </button>

            <button
              onClick={handleCopySlide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Copy Slide Content"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied' : 'Copy Slide'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Close Pitch Deck"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Canvas Area */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase">
              {currentSlide.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {currentSlide.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Key Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentSlide.keyPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-cyan-300 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{pt.heading}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stat Banner if available */}
          {currentSlide.statNumber && (
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-950 to-blue-950/40 flex items-center justify-between gap-4">
              <div className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">
                {currentSlide.statNumber}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg text-right">
                {currentSlide.statLabel}
              </div>
            </div>
          )}

          {/* Speaker Notes Disclosure */}
          {showSpeakerNotes && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200 font-mono">
              <strong className="text-amber-400 uppercase tracking-wider block mb-1">
                Executive Speaker Talking Points:
              </strong>
              {currentSlide.speakerNotes}
            </div>
          )}
        </div>

        {/* Bottom Slide Navigation Bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {PITCH_DECK_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-6 bg-cyan-400'
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Go to Slide ${slide.id}: ${slide.title}`}
                aria-label={`Slide ${slide.id}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentSlideIndex(prev => Math.min(PITCH_DECK_SLIDES.length - 1, prev + 1))}
              disabled={currentSlideIndex === PITCH_DECK_SLIDES.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 transition-all cursor-pointer font-sans shadow-md shadow-cyan-500/20"
              aria-label="Next Slide"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
