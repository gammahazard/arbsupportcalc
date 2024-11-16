export async function POST(req) {
    try {
      const data = await req.json();
      
      // Convert odds to decimal if they're in American format
      const calculateDecimalOdds = (odds) => {
        const strOdds = odds.toString();
        // If already in decimal format (contains decimal point)
        if (strOdds.includes('.')) {
          return parseFloat(odds);
        }
        // Convert from American odds
        const numOdds = parseInt(odds);
        if (numOdds > 0) {
          return +(numOdds / 100 + 1).toFixed(3);
        } else {
          return +(100 / Math.abs(numOdds) + 1).toFixed(3);
        }
      };
  
      const odds = {
        casino1: {
          team1: calculateDecimalOdds(data.casino1Team1Odds),
          team2: calculateDecimalOdds(data.casino1Team2Odds)
        },
        casino2: {
          team1: calculateDecimalOdds(data.casino2Team1Odds),
          team2: calculateDecimalOdds(data.casino2Team2Odds)
        }
      };
  
      // Calculate arbitrage opportunities
      const calculateBets = (stake, prob1, prob2) => {
        const bet1 = stake * (prob1 / (prob1 + prob2));
        const bet2 = stake * (prob2 / (prob1 + prob2));
        return { bet1, bet2 };
      };
  
      const findArbitrage = () => {
        const combinations = [
          {
            bet1: { casino: data.casino1Name, odds: odds.casino1.team1, team: data.team1Name },
            bet2: { casino: data.casino2Name, odds: odds.casino2.team2, team: data.team2Name }
          },
          {
            bet1: { casino: data.casino1Name, odds: odds.casino1.team2, team: data.team2Name },
            bet2: { casino: data.casino2Name, odds: odds.casino2.team1, team: data.team1Name }
          }
        ];
  
        let bestArbitrage = null;
        let maxProfit = 0;
  
        combinations.forEach(combo => {
          const prob1 = 1 / combo.bet1.odds;
          const prob2 = 1 / combo.bet2.odds;
          const totalProb = prob1 + prob2;
  
          if (totalProb < 1) {
            const profit = (1 / totalProb - 1) * 100;
            const maxStake = Math.min(data.casino1Balance, data.casino2Balance);
            const { bet1, bet2 } = calculateBets(maxStake, prob1, prob2);
  
            if (profit > maxProfit) {
              maxProfit = profit;
              bestArbitrage = {
                bet1: {
                  ...combo.bet1,
                  amount: bet1.toFixed(2),
                  originalOdds: combo.bet1.odds,
                  payout: (bet1 * combo.bet1.odds).toFixed(2)
                },
                bet2: {
                  ...combo.bet2,
                  amount: bet2.toFixed(2),
                  originalOdds: combo.bet2.odds,
                  payout: (bet2 * combo.bet2.odds).toFixed(2)
                },
                profit: profit.toFixed(2),
                totalStake: (bet1 + bet2).toFixed(2)
              };
            }
          }
        });
  
        return bestArbitrage;
      };
  
      const arbitrage = findArbitrage();
  
      if (!arbitrage) {
        return Response.json({
          success: false,
          message: "No profitable arbitrage opportunity found."
        });
      }
  
      return Response.json({
        success: true,
        arbitrage
      });
    } catch (error) {
      return Response.json({
        success: false,
        message: "Error calculating arbitrage opportunities"
      }, { status: 500 });
    }
  }
  