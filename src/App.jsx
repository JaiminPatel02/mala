import React, { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);

  // Load initial values from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('count');
    const storedRound = localStorage.getItem('round');
    const storedTotalCount = localStorage.getItem('totalCount');
    if (storedCount !== null) setCount(parseInt(storedCount));
    if (storedRound !== null) setRound(parseInt(storedRound));
    if (storedTotalCount !== null) setTotalCount(parseInt(storedTotalCount));
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('count', count.toString());
    localStorage.setItem('round', round.toString());
    localStorage.setItem('totalCount', totalCount.toString());
  }, [count, round , totalCount]);

const handleIncrement = () => {
  setIsAnimating(true);

  setCount(prevCount => {
    if (prevCount === 107) {
      setRound(prev => prev + 1);
      setTotalCount(prev => prev + 1);
      setShowCompletionEffect(true);
      setTimeout(() => setShowCompletionEffect(false), 1500);
      return 0;
    } else {
      setTotalCount(prev => prev + 1);
      return prevCount + 1;
    }
  });

  setTimeout(() => setIsAnimating(false), 300);
};

 const handleDecrement = () => {
  setIsAnimating(true);

  setCount(prevCount => {
    if (prevCount > 0) {
      setTotalCount(prev => Math.max(0, prev - 1));
      return prevCount - 1;
    } else if (round > 0) {
      setRound(prev => Math.max(0, prev - 1));
      setTotalCount(prev => Math.max(0, prev - 1));
      return 107;
    }
    return 0; // If count and round both are 0
  });

  setTimeout(() => setIsAnimating(false), 300);
};


  const openResetModal = () => setShowResetModal(true);
  const closeResetModal = () => setShowResetModal(false);

  const handleReset = () => {
    localStorage.removeItem('count');
    localStorage.removeItem('round');
    localStorage.removeItem('totalCount');
    setCount(0);
    setRound(0);
    setTotalCount(0);
    closeResetModal();
  };

  
useEffect(() => {
  const handleKeyDown = (event) => {
    // If reset modal is open
    if (showResetModal) {
      if (event.key === 'Enter') {
        handleReset(); // Confirm reset
      }
      if (event.key === 'Backspace' || event.key === 'Delete') {
        closeResetModal(); // Cancel reset
      }
      return;
    }

    // General key handling
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault(); // Prevent scroll or unwanted behavior
      handleIncrement();
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      handleDecrement();
    }

    // Shift + R to open reset modal
    if (event.key.toLowerCase() === 'r' && event.shiftKey) {
      openResetModal();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [showResetModal]); // include showResetModal in dependencies



  const progress = (count / 108) * 100;
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 max-w-md w-full backdrop-blur-lg shadow-2xl relative overflow-hidden">
        {/* App Title */}
        <h1 className="text-center text-2xl font-bold text-white mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            નામ જપ (માળા)
          </span>
        </h1>
        
        <div className="flex flex-col items-center justify-center">
          {/* Completion Animation Effect */}
          {showCompletionEffect && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Pulsing circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-64 h-64 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
                <div className="absolute w-64 h-64 rounded-full bg-blue-600 opacity-10 animate-pulse"></div>
              </div>
              
              {/* Sparkles/particles */}
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
              
              {/* Completion message */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-70 px-6 py-3 rounded-xl text-center">
                  <div className="text-blue-400 text-2xl font-bold mb-1 animate-bounce">
                    {round} માળા પૂર્ણ! 
                  </div>
                  <div className="text-blue-100">
                    Round {round} completed
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SVG Progress Ring */}
          <div className="relative mb-6">
            <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="42" stroke="#333333" strokeWidth="4" fill="none" />
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

          {/* Round Indicator */}
          <div className="bg-gray-800 bg-opacity-50 px-4 py-2 rounded-full mb-8">
            <span className="text-gray-400 font-medium">Round</span>
            <span className="text-white font-semibold ml-2">{round}</span>
          </div>

          {/* Progress Text */}
          <div className="text-gray-400 mb-4 text-sm font-medium">{count}/108</div>

          {/* Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <button 
              onClick={handleDecrement} 
              className="bg-gray-800 text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-gray-700 flex items-center justify-center shadow-lg" 
              aria-label="Decrement"
            >
              <span className="text-xl font-bold leading-none">−</span>
            </button>
            <button 
              onClick={handleIncrement} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center shadow-lg hover:shadow-blue-500/20"
            >
              <span className="text-xl font-semibold mr-1 leading-none">+</span>
              <span>Increment</span>
            </button>
            <button 
              onClick={openResetModal} 
              className="bg-gray-800 text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-gray-700 flex items-center justify-center shadow-lg" 
              aria-label="Reset"
            >
              <span className="text-xl font-semibold leading-none">⟲</span>
            </button>
          </div>
        </div>
          <div className="bg-gray-800 bg-opacity-50 px-4 py-2 rounded-full mb-8">
            <span className="text-gray-400 font-medium">Total count</span>
            <span className="text-white font-semibold ml-2">{totalCount}</span>
          </div>
      </div>

      {/* Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">Reset Counter</h3>
              <button onClick={closeResetModal} className="text-gray-400 hover:text-white transition-colors w-6 h-6 flex items-center justify-center">
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to reset all data? This will clear all counts and rounds from local storage.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={closeResetModal} className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleReset} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add keyframes for sparkle animation */}
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
            transform: translate(${-50 + Math.random() * 100}px, ${-80 + Math.random() * 40}px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default App;