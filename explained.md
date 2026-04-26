## Gambler's Ruin

**Question:** Will you go broke before reaching your goal?

---

### Edge
How often you win. 
- If you win **50%** of the time, it's a coin flip (no edge).
- If you win **55%** of the time, then it is a **positive edge**. 
- In this simulator, `p` denotes the edge probability. 

> "Positive edge does not guarantee that you won't go broke."

---

### Ways to die even with Edge

#### 1) Undercapitalization
Imagine you have a 55% win rate but you only start with $10 and your target is $10,000. You need to run up 1000x. Even with edge, a bad early streak wipes you out before your edge has time to show up. This is why starting capital relative to your target matters so much.

In the simulator, this is the `starting_capital / target` ratio. The smaller this ratio, the higher your ruin probability even with positive edge.

#### 2) Overbetting
Even with positive edge, if you bet too large a fraction of your bankroll each trade, you will go broke. Say you win 55% of the time and you bet 40% of your bankroll each trade:

* A **win** multiplies your bankroll by **1.40**
* A **loss** multiplies your bankroll by **0.60**

Now imagine one win and one loss in any order:
`1.40 × 0.60 = 0.84`

You're down **16%** after breaking even on wins and losses. This is called **volatility drag** — the variance of your bets is eating your returns.