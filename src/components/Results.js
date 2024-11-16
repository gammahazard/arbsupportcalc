// src/components/Results.js
export default function Results({ results, teamNames }) {
    if (!results.success) {
      return (
        <div className="mt-4 p-6 bg-red-900/30 rounded-2xl border border-red-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-center font-medium text-red-400">
              {results.message || "No arbitrage opportunity found with these odds."}
            </p>
          </div>
        </div>
      );
    }
  
    const { arbitrage } = results;
    
    const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;
    const formatPercentage = (value) => `${parseFloat(value).toFixed(2)}%`;
  
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Arbitrage Opportunity Found! 🎯
          </h2>
          <p className="text-gray-400">Here's your optimal betting strategy</p>
        </div>
  
        {/* Bets Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Bet Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-600">
              <h3 className="font-bold text-xl text-white">First Bet</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Casino</span>
                  <span className="font-medium text-blue-400">{arbitrage.bet1.casino}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Team</span>
                  <span className="font-medium text-team1">{arbitrage.bet1.team}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Odds</span>
                  <span className="font-medium text-white">{arbitrage.bet1.originalOdds}</span>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Stake Amount</span>
                    <span className="font-bold text-yellow-400">{formatCurrency(arbitrage.bet1.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Potential Payout</span>
                    <span className="font-bold text-green-400">{formatCurrency(arbitrage.bet1.payout)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Second Bet Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-600">
              <h3 className="font-bold text-xl text-white">Second Bet</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Casino</span>
                  <span className="font-medium text-blue-400">{arbitrage.bet2.casino}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Team</span>
                  <span className="font-medium text-team2">{arbitrage.bet2.team}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Odds</span>
                  <span className="font-medium text-white">{arbitrage.bet2.originalOdds}</span>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Stake Amount</span>
                    <span className="font-bold text-yellow-400">{formatCurrency(arbitrage.bet2.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Potential Payout</span>
                    <span className="font-bold text-green-400">{formatCurrency(arbitrage.bet2.payout)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Summary Section */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-600">
            <h3 className="font-bold text-xl text-white text-center">Summary</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(arbitrage.totalStake)}</p>
              </div>
              <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Guaranteed Profit</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(parseFloat(arbitrage.bet1.payout) - parseFloat(arbitrage.totalStake))}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Profit Percentage</p>
                <p className="text-2xl font-bold text-green-400">{formatPercentage(arbitrage.profit)}</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Info Note */}
        <div className="text-center text-sm text-gray-400">
          <p>Note: Please ensure both bets can be placed before proceeding.</p>
        </div>
      </div>
    );
  }