import React, { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  
  // Load initial values from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('count');
    const storedRound = localStorage.getItem('round');
    if (storedCount !== null) setCount(parseInt(storedCount));
    if (storedRound !== null) setRound(parseInt(storedRound));
  }, []);
  
  // Save count and round to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('count', count);
    localStorage.setItem('round', round);
  }, [count, round]);
  
  const handleIncrement = () => {
    setIsAnimating(true);
    
    if (count < 108) {
      setCount(prev => prev + 1);
    } else {
      setCount(0);
      setRound(prev => prev + 1);
    }
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };
  
  const handleDecrement = () => {
    setIsAnimating(true);
    
    if (count > 0) {
      setCount(prev => prev - 1);
    } else if (round > 0) {
      setCount(108);
      setRound(prev => prev - 1);
    }
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };
  
  const openResetModal = () => {
    setShowResetModal(true);
  };
  
  const closeResetModal = () => {
    setShowResetModal(false);
  };
  
  const handleReset = () => {
    // Clear localStorage
    localStorage.removeItem('count');
    localStorage.removeItem('round');
    
    // Reset state
    setCount(0);
    setRound(0);
    
    // Close modal
    closeResetModal();
  };
  
  // Calculate progress percentage for the progress ring
  const progress = (count / 108) * 100;
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 max-w-md w-full backdrop-blur-lg shadow-2xl">
        <div className="flex flex-col items-center justify-center">
          {/* SVG Progress Ring */}
          <div className="relative mb-6">
            <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#333333"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress ring */}
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
            
            {/* Count display in the center */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
              <span className="text-4xl font-bold text-white">{count}</span>
            </div>
          </div>
          
          {/* Round indicator */}
          <div className="bg-gray-800 bg-opacity-50 px-4 py-2 rounded-full mb-8">
            <span className="text-gray-400 font-medium">Round</span>
            <span className="text-white font-semibold ml-2">{round}</span>
          </div>
          
          {/* Progress text */}
          <div className="text-gray-400 mb-4 text-sm font-medium">
            {count}/108
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center space-x-4 mb-6">
            {/* Decrement button with minus icon */}
            <button
              onClick={handleDecrement}
              className="bg-gray-800 text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-gray-700 flex items-center justify-center shadow-lg"
              aria-label="Decrement"
            >
              <span className="text-xl font-bold leading-none">−</span>
            </button>
            
            {/* Increment button with plus icon */}
            <button
              onClick={handleIncrement}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center shadow-lg hover:shadow-blue-500/20"
            >
              <span className="text-xl font-semibold mr-1 leading-none">+</span>
              <span>Increment</span>
            </button>
            
            {/* Reset button with circular arrow icon */}
            <button
              onClick={openResetModal}
              className="bg-gray-800 text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-gray-700 flex items-center justify-center shadow-lg"
              aria-label="Reset"
            >
              <span className="text-xl font-semibold  leading-none">⟲</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">Reset Counter</h3>
              <button 
                onClick={closeResetModal}
                className="text-gray-400 hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to reset all data? This will clear all counts and rounds from local storage.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeResetModal}
                className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;