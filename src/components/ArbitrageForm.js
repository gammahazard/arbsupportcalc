'use client'
import { useState } from 'react'
import Results from './Results'

function americanToDecimal(americanOdds) {
  const odds = parseFloat(americanOdds);
  if (odds > 0) {
    return (odds / 100 + 1).toFixed(3);
  } else if (odds < 0) {
    return (100 / Math.abs(odds) + 1).toFixed(3);
  }
  return 0;
}

function validateOddsInput(value) {
  const regex = /^-?\d*\.?\d*$/;
  return regex.test(value);
}

const loadingMessages = [
  "Analyzing odds...",
  "Calculating arbitrage...",
  "Finding optimal bets...",
  "Computing profits..."
];

export default function ArbitrageForm() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [formData, setFormData] = useState({
    team1Name: '',
    team2Name: '',
    casino1Name: '',
    casino1Team1Odds: '',
    casino1Team2Odds: '',
    casino1Balance: '',
    casino2Name: '',
    casino2Team1Odds: '',
    casino2Team2Odds: '',
    casino2Balance: ''
  });

  const [previewOdds, setPreviewOdds] = useState({
    casino1Team1: null,
    casino1Team2: null,
    casino2Team1: null,
    casino2Team2: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('Odds')) {
      if (validateOddsInput(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Update preview odds
        if (value) {
          const decimalValue = value.includes('.') ? value : americanToDecimal(value);
          setPreviewOdds(prev => ({
            ...prev,
            [name.replace('Odds', '')]: decimalValue
          }));
        }
      }
    } else if (name.includes('Balance')) {
      // Only allow positive numbers for balance
      if (!isNaN(value) && parseFloat(value) >= 0) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name.includes('Name') && name.includes('team')) {
      // Limit team names to 3 characters and convert to uppercase
      setFormData(prev => ({
        ...prev,
        [name]: value.slice(0, 3).toUpperCase()
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    // Start loading message rotation
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 800);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({
        success: false,
        message: 'Error calculating arbitrage opportunities'
      });
    } finally {
      clearInterval(messageInterval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-gray-700">
        {/* Teams Section */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          {/* Team 1 Input */}
          <div className="relative bg-gray-700/50 p-6 rounded-2xl border border-gray-600">
            <label className="text-team1 font-semibold block mb-3">Team 1</label>
            <input
              type="text"
              name="team1Name"
              placeholder="e.g., GSW"
              value={formData.team1Name}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600 
                       text-team1 placeholder-gray-500 focus:border-team1 
                       focus:ring-2 focus:ring-team1/50 transition-all uppercase
                       text-lg font-medium"
              maxLength={3}
            />
          </div>

          {/* Team 2 Input */}
          <div className="relative bg-gray-700/50 p-6 rounded-2xl border border-gray-600">
            <label className="text-team2 font-semibold block mb-3">Team 2</label>
            <input
              type="text"
              name="team2Name"
              placeholder="e.g., MEM"
              value={formData.team2Name}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600 
                       text-team2 placeholder-gray-500 focus:border-team2 
                       focus:ring-2 focus:ring-team2/50 transition-all uppercase
                       text-lg font-medium"
              maxLength={3}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Casino 1 Section */}
          <div className="bg-gray-700/50 p-6 rounded-2xl border border-gray-600">
            <h2 className="text-xl font-bold mb-6 text-white text-center">Casino 1</h2>
            <div className="space-y-5">
              {/* Casino Name */}
              <div className="relative">
                <label className="text-gray-300 font-semibold block mb-2">Casino Name</label>
                <input
                  type="text"
                  name="casino1Name"
                  placeholder="Enter casino name"
                  required
                  value={formData.casino1Name}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600
                           text-white placeholder-gray-500 focus:border-blue-500
                           focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Team 1 Odds */}
              <div className="relative">
                <label className="text-team1 font-semibold block mb-2">
                  {formData.team1Name || 'Team 1'} Odds
                </label>
                <input
                  type="text"
                  name="casino1Team1Odds"
                  placeholder="e.g., +240 or 3.40"
                  required
                  value={formData.casino1Team1Odds}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600
                           text-team1 placeholder-gray-500 focus:border-team1
                           focus:ring-2 focus:ring-team1/50 transition-all"
                />
                {formData.casino1Team1Odds && (
                  <div className="absolute right-3 top-[42px] px-3 py-1 bg-gray-900/50 rounded-lg
                                backdrop-blur-sm text-sm text-gray-400">
                    {americanToDecimal(formData.casino1Team1Odds)}
                  </div>
                )}
              </div>

              {/* Team 2 Odds */}
              <div className="relative">
                <label className="text-team2 font-semibold block mb-2">
                  {formData.team2Name || 'Team 2'} Odds
                </label>
                <input
                  type="text"
                  name="casino1Team2Odds"
                  placeholder="e.g., -300 or 1.33"
                  required
                  value={formData.casino1Team2Odds}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600
                           text-team2 placeholder-gray-500 focus:border-team2
                           focus:ring-2 focus:ring-team2/50 transition-all"
                />
                {formData.casino1Team2Odds && (
                  <div className="absolute right-3 top-[42px] px-3 py-1 bg-gray-900/50 rounded-lg
                                backdrop-blur-sm text-sm text-gray-400">
                    {americanToDecimal(formData.casino1Team2Odds)}
                  </div>
                )}
              </div>

              {/* Balance */}
              <div className="relative">
                <label className="text-gray-300 font-semibold block mb-2">Balance</label>
                <input
                  type="number"
                  step="0.01"
                  name="casino1Balance"
                  placeholder="Enter balance"
                  required
                  value={formData.casino1Balance}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600
                           text-white placeholder-gray-500 focus:border-blue-500
                           focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Casino 2 Section - Same structure as Casino 1 */}
          <div className="bg-gray-700/50 p-6 rounded-2xl border border-gray-600">
            <h2 className="text-xl font-bold mb-6 text-white text-center">Casino 2</h2>
            <div className="space-y-5">
              {/* Casino Name */}
              <div className="relative">
                <label className="text-gray-300 font-semibold block mb-2">Casino Name</label>
                <input
                  type="text"
                  name="casino2Name"
                  placeholder="Enter casino name"
                  required
                  value={formData.casino2Name}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600
                           text-white placeholder-gray-500 focus:border-blue-500
                           focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Team 1 Odds */}
              <div className="relative">
                <label className="text-team1 font-semibold block mb-2">
                  {formData.team1Name || 'Team 1'} Odds
                </label>
                <input
                  type="text"
                  name="casino2Team1Odds"
                  placeholder="e.g., +240 or 3.40"
                  required
                  value={formData.casino2Team1Odds}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600
                           text-team1 placeholder-gray-500 focus:border-team1
                           focus:ring-2 focus:ring-team1/50 transition-all"
                />
                {formData.casino2Team1Odds && (
                  <div className="absolute right-3 top-[42px] px-3 py-1 bg-gray-900/50 rounded-lg
                                backdrop-blur-sm text-sm text-gray-400">
                    {americanToDecimal(formData.casino2Team1Odds)}
                  </div>
                )}
              </div>

              {/* Team 2 Odds */}
              <div className="relative">
                <label className="text-team2 font-semibold block mb-2">
                  {formData.team2Name || 'Team 2'} Odds
                </label>
                <input
                  type="text"
                  name="casino2Team2Odds"
                  placeholder="e.g., -300 or 1.33"
                  required
                  value={formData.casino2Team2Odds}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600
                           text-team2 placeholder-gray-500 focus:border-team2
                           focus:ring-2 focus:ring-team2/50 transition-all"
                />
                {formData.casino2Team2Odds && (
                  <div className="absolute right-3 top-[42px] px-3 py-1 bg-gray-900/50 rounded-lg
                                backdrop-blur-sm text-sm text-gray-400">
                    {americanToDecimal(formData.casino2Team2Odds)}
                  </div>
                )}
              </div>

              {/* Balance */}
              <div className="relative">
                <label className="text-gray-300 font-semibold block mb-2">Balance</label>
                <input
                  type="number"
                  step="0.01"
                  name="casino2Balance"
                  placeholder="Enter balance"
                  required
                  value={formData.casino2Balance}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl bg-gray-800 border-2 border-gray-600
                           text-white placeholder-gray-500 focus:border-blue-500
                           focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold
                     hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 
                     transform transition-all hover:scale-[1.02] active:scale-[0.98]
                     text-lg shadow-xl shadow-blue-500/20"
          >
            Calculate Arbitrage
          </button>
        </div>

        {/* Loading Message */}
        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block px-6 py-3 bg-gray-700/50 rounded-xl border border-gray-600">
              <p className="text-lg font-medium text-gray-300 animate-pulse">
                {loadingMessages[currentMessage]}
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="mt-8 pt-8 border-t border-gray-700">
            <Results results={results} teamNames={formData} />
          </div>
        )}
      </div>
    </div>
  );
}