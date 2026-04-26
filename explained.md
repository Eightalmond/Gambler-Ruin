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

---

### Kelly's Criterion

Kelly answers the question: what fraction of your bankroll should you bet to grow fastest?

The formula is:

`f* = p − q/b`

Where `p = win probability`, `q = 1−p`, `b = net odds` (usually 1 for even bets).
For `p=0.55`:

`f* = 0.55 − 0.45 = 0.10`

So bet exactly 10% of your bankroll each trade. This maximizes your long run growth rate.

### The 5 Preset Values

| Scenario | Edge ($p$) | Bet Size ($f$) | Description |
| :--- | :---: | :---: | :--- |
| 🔴 **Certain Ruin** | 0.40 | 0.40 | Bad edge **AND** overbetting. Growth rate is deeply negative. Almost every path collapses; the few survivors are pure luck. |
| 🟠 **Likely Ruin** | 0.47 | 0.25 | Slight negative edge with moderate bets. Most paths slowly decay. A few lucky ones make it, but over more steps, even those would eventually fall. |
| ⚪ **Coin Flip** | 0.50 | 0.15 | No edge. Pure random walk. Outcomes are entirely determined by luck and starting capital ratio. Some make it, most drift down. |
| 🟡 **Fighting Chance** | 0.55 | 0.25 | Positive edge but overbetting above Kelly ($Kelly = 10\%$, you're betting $25\%$). Volatility drag is eating your returns. More paths survive than Coin Flip, but you're not extracting full value from your edge. |
| 🟢 **Kelly Optimal** | 0.55 | 0.10 | Positive edge at exactly Kelly sizing. This is why 197/200 paths reach the target. The math is working for you, not against you. |

### Key Insights from the Growth Rate Chart

* **Below Kelly:** You grow, but slower than optimal. It is safer, though—many pros use "half-Kelly" deliberately.
* **At Kelly:** Maximum long-run growth.
* **Above Kelly but below 2× Kelly:** You still grow, but slower than Kelly due to volatility drag. You're leaving money on the table.
* **Above 2× Kelly:** Growth rate goes negative. You will lose money in the long run despite having a positive edge. This is the **danger zone** your chart shows in red.

## Key Terms

- **Bankroll (B)** :
Your current capital. You start with some amount, say $1000. Every bet either grows or shrinks it.

- **Target (T)** :
The goal you're trying to reach before going broke. Could be $2000 (double up), or just "survive 1000 trades."

- **Edge (p)** :
The probability your next bet wins

- **Ruin** :
You hit $0. Game over. In trading this means blowing up your account.

- **Bet Size (f)** :
The fraction of your bankroll you risk on each trade.


<img width="1280" height="681" alt="Screenshot 2026-04-26 at 12 20 34 PM" src="https://github.com/user-attachments/assets/73ad8b99-57f4-4dff-9d90-9e41982f888a" />

<img width="761" height="600" alt="Screenshot 2026-04-26 at 12 21 43 PM" src="https://github.com/user-attachments/assets/d556894a-47c9-40e9-8569-794786e7ba3c" />
