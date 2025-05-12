import React, { useEffect, useState, useCallback } from 'react';

function App() {
  const [count, setCount] = useState(() => parseInt(localStorage.getItem('count')) || 0);
  const [round, setRound] = useState(() => parseInt(localStorage.getItem('round')) || 0);
  const [totalCount, setTotalCount] = useState(() => parseInt(localStorage.getItem('totalCount')) || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);

  useEffect(() => {
    localStorage.setItem('count', count);
    localStorage.setItem('round', round);
    localStorage.setItem('totalCount', totalCount);
  }, [count, round, totalCount]);

  const handleIncrement = useCallback(() => {
    setIsAnimating(true);

    setCount(prevCount => {
      if (prevCount === 108) {
        setRound(prevRound => {
          const newRound = prevRound + 1;
          setShowCompletionEffect(true);
          setTimeout(() => setShowCompletionEffect(false), 1500);
          return newRound;
        });
        return 0;
      }
      return prevCount + 1;
    });

    setTotalCount(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const handleDecrement = useCallback(() => {
    setIsAnimating(true);

    setCount(prevCount => {
      if (prevCount > 0) {
        setTotalCount(prev => Math.max(0, prev - 1));
        return prevCount - 1;
      } else {
        setRound(prevRound => {
          if (prevRound > 0) {
            setTotalCount(prev => Math.max(0, prev - 1));
            return prevRound - 1;
          }
          return prevRound;
        });
        return 107;
      }
    });

    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const handleReset = () => {
    localStorage.clear();
    setCount(0);
    setRound(0);
    setTotalCount(0);
    setShowResetModal(false);
  };

  const handleKeyDown = useCallback((event) => {
    if (showResetModal) {
      if (event.key === 'Enter') handleReset();
      if (['Backspace', 'Delete'].includes(event.key)) setShowResetModal(false);
      return;
    }

    if (['Space', 'Enter'].includes(event.code)) {
      event.preventDefault();
      handleIncrement();
    }

    if (['Backspace', 'Delete'].includes(event.key)) handleDecrement();

    if (event.key.toLowerCase() === 'r' && event.shiftKey) setShowResetModal(true);
  }, [handleIncrement, handleDecrement, showResetModal]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const progress = (count / 108) * 100;
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 max-w-md w-full backdrop-blur-lg shadow-2xl relative overflow-hidden">
        <h1 className="text-center text-2xl font-bold text-white mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            નામ જપ (માળા)
          </span>
        </h1>

        <div className="flex flex-col items-center justify-center">
          {showCompletionEffect && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-64 h-64 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
                <div className="absolute w-64 h-64 rounded-full bg-blue-600 opacity-10 animate-pulse"></div>
              </div>
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `sparkle ${1 + Math.random() * 2}s linear forwards`,
                      animationDelay: `${Math.random() * 0.5}s`
                    }}
                  ></div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-70 px-6 py-3 rounded-xl text-center">
                  <div className="text-blue-400 text-2xl font-bold mb-1 animate-bounce">
                    {round} માળા પૂર્ણ!
                  </div>
                  <div className="text-blue-100">Round {round} completed</div>
                </div>
              </div>
            </div>
          )}

          <div className="relative mb-6">
            <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="42" stroke="#333" strokeWidth="4" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00c6ff" />
                  <stop offset="100%" stopColor="#0072ff" />
                </linearGradient>
              </defs>
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
              <span className="text-4xl font-bold text-white">{count}</span>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 px-4 py-2 rounded-full mb-8">
            <span className="text-gray-400 font-medium">Round</span>
            <span className="text-white font-semibold ml-2">{round}</span>
          </div>

          <div className="text-gray-400 mb-4 text-sm font-medium">{count}/108</div>

          <div className="flex items-center space-x-4 mb-6">
            <button onClick={handleDecrement} className="bg-gray-800 text-white w-10 h-10 rounded-full hover:bg-gray-700 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">−</span>
            </button>
            <button onClick={handleIncrement} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg">
              <span className="text-xl font-semibold mr-1">+</span> Increment
            </button>
            <button onClick={() => setShowResetModal(true)} className="bg-gray-800 text-white w-10 h-10 rounded-full hover:bg-gray-700 flex items-center justify-center shadow-lg">
              <span className="text-xl font-semibold">⟲</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 px-4 py-2 rounded-full mb-8">
          <span className="text-gray-400 font-medium">Total count</span>
          <span className="text-white font-semibold ml-2">{totalCount}</span>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">Reset Counter</h3>
              <button onClick={() => setShowResetModal(false)} className="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center">
                <span className="text-xl">×</span>
              </button>
            </div>
            <p className="text-gray-300 mb-6">Are you sure you want to reset all data? This will clear all counts and rounds from local storage.</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowResetModal(false)} className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800">
                Cancel
              </button>
              <button onClick={handleReset} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes sparkle {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 40 - 80}px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default App;