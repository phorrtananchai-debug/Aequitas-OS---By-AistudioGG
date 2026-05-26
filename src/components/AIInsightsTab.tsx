import { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Send, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  Workflow, 
  AlertCircle 
} from 'lucide-react';
import { ChatMessage, AlertItem } from '../types';

interface AIInsightsProps {
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

const TEMPLATE_SUGGESTIONS = [
  { text: 'Compare Mean Reversion vs Cumulative Momentum under high volatility', topic: 'archetypes' },
  { text: 'Evaluate Solana Core Portfolio Overview risk parameters', topic: 'solana' },
  { text: 'Suggest optimization for thematic core allocations', topic: 'alpha' },
];

export default function AIInsightsTab({ onTriggerAlert }: AIInsightsProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: 'Greetings. I am the Aequitas Portfolio Advisor, an automated guidance environment. I synthesize historical variance vectors, asset class boundaries, and structural themes to draft allocation plans. How can I assist you with your financial architecture today?',
      timestamp: '02:00'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI thinking process simulation
    setTimeout(() => {
      let aiResponseText = '';
      const promptLower = textToSend.toLowerCase();

      // Semantic keyword routing templates 
      if (promptLower.includes('reversion') || promptLower.includes('momentum') || promptLower.includes('compare')) {
        aiResponseText = `### Comparative Analysis: Mean Reversion vs Cumulative Momentum

Under dynamic macroeconomic conditions, correlation rules respond sequentially:
1. **Mean Reversion**: Highly effective during range-bound intervals where assets drift from historical 90-day moving margins (alignment rating peaks at **94.2%** confidence). Risk indicators remain exceptionally low.
2. **Cumulative Momentum**: Exceptional at capturing long-term generational expansion phases. Generates steady compounding effects over multiple quarters. Max drawdown bound is estimated under **-4.12%**.

**Strategic Guidance**: Align **35%** of secondary reserves to Cumulative Momentum and **20%** to conservative Mean Reversion to stabilize overall portfolio volatility.`;
      } else if (promptLower.includes('solana') || promptLower.includes('sol')) {
        aiResponseText = `### Solana Core Allocation Risk Parameters

Comprehensive on-chain activity and consensus metrics evaluation:
* **Gas Consumption Decay**: Consensus transaction fees remain optimized while overall smart contract calls rose **+28%** over the observation period, reflecting network stability.
* **Capital Sizing & Allocation**: Aequitas trackers detected steady institucional inflows of **$410M** establishing solid baseline positions across long-term portfolios.
* **Liquid Staking Yields**: Secondary yields via JitoSOL and related collaterals remain steady at **+7.2%**, providing a highly consistent performance curve.

**Synthesis Risk Model**: Classify as **Core Standard Hold**. Aligning total Solana weighting to a targeted **18.0%** threshold improves asset distribution metrics.`;
      } else if (promptLower.includes('suggest') || promptLower.includes('alpha') || promptLower.includes('optimization')) {
        aiResponseText = `### Allocation Guidance Suggested Model: Thematic Core

Re-weighting structural parameters minimizes volatility decay:
* **Current Portfolio Weighting**: SOL allocation set at **12.5%** ($42.8K asset size).
* **Suggested Optimized Rebalance**: Re-structure allocation to **18.0%** ($61.5K asset size), swapping standard spot layers for liquid staking options.
* **Projected Outcome**: Target annual performance clears at **+23.8%** aggregate, with a simulated maximum drawdown bound stable under **-1.2%**.

Execute rebalance via the **Allocation Guidance** widget in the **Portfolio Overview** panel to enable the model instantly.`;
      } else {
        aiResponseText = `### Aequitas General Intelligence Synthesis

Evaluating query: *&quot;${textToSend}&quot;*

Based on active parameters:
1. Connected block networks and registered settlement channels are highly optimized. Average alignment metrics rated at **98.2%** stability.
2. Long-term thematic models remain fully authorized and online.
3. Spreads on core holdings remain range-bound with spreads clearing inside 0.10% margins.

*Feel free to query comparing Strategy Archetypes (Mean Reversion vs Cumulative Momentum) or Solana Core details for tailored models.*`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      
      // Notify user visually
      onTriggerAlert({
        type: 'success',
        typeLabel: 'SYNTHESIS COMPLETE',
        title: 'Advisor Advice Mapped',
        description: 'Aequitas Advisor successfully mapped block correlation ratios.'
      });
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#252830] dark:text-[#F4EEE4] pb-12 flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Top Header info */}
      <section className="shrink-0 animate-fade-in duration-800">
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
          Advisor Guidance Workspace
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          De-compose complex strategy runs, optimize conservative risk limits, or study structural wealth themes.
        </p>
      </section>

      {/* Main split work space helper: suggestions on left and chat on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden">
        
        {/* Helper prompts list (4 columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between shrink-0 h-fit lg:h-full">
          <div>
            <div className="flex gap-2 items-center text-blue-600 dark:text-blue-400 mb-4 animate-pulse">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Guidance Queries</span>
            </div>
            
            <h3 className="text-sm font-semibold mb-1 text-slate-800 dark:text-white">Interactive Templates</h3>
            <p className="text-xs text-slate-400 mb-5">Click custom query to prompt the portfolio advisor.</p>

            <div className="space-y-3">
              {TEMPLATE_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  id={`suggestion-${idx}`}
                  key={idx}
                  onClick={() => handleSend(suggestion.text)}
                  className="w-full text-left p-4 rounded-2xl bg-white border border-slate-105/90 shadow-sm hover:border-blue-500 hover:bg-slate-50/50 dark:bg-slate-900/40 dark:border-slate-800/50 dark:hover:border-slate-400 transition-all text-xs font-semibold leading-normal text-slate-800 dark:text-slate-200 active:scale-98"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex p-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 dark:bg-slate-950/20 dark:border-slate-900/40 mt-6 leading-relaxed">
            <AlertCircle size={14} className="shrink-0 text-slate-400 mt-0.5" />
            <span>AI advisor models are for informational planning and review. Always verify target performance metrics and risk guidelines before final commitment.</span>
          </div>
        </div>

        {/* Real Chat panel (8 columns) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl shadow-sm flex flex-col h-full overflow-hidden">
          
          {/* Active bot heading */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/10 bg-slate-50/50 dark:bg-slate-950/20 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Aequitas Portfolio Advisor</h4>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block mt-0.5">Active Advisor Route</span>
            </div>
          </div>

          {/* Messages list container */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                
                {/* Avatar icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/40' 
                    : 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                }`}>
                  {msg.sender === 'user' ? 'ME' : <Sparkles size={14} />}
                </div>

                {/* Message bounds text card */}
                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-50/60 text-slate-800 dark:bg-blue-950/20 dark:text-slate-100 border border-blue-100/40 dark:border-blue-900/20 shadow-none'
                    : 'bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/40 text-slate-800 dark:text-slate-100 whitespace-pre-line'
                }`}>
                  {msg.text}
                  <span className="block text-[9px] text-slate-400 mt-1.5 font-mono text-right">{msg.timestamp}</span>
                </div>

              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 mr-auto max-w-[80%]">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={14} />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-450 font-mono italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  Aligning asset allocation options...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Form input controls (shrinkable) */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/10 bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
            <div className="flex gap-3">
              <input
                id="ai-chat-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                placeholder="Ask about dynamic allocation bands, relative weights, theme details..."
                className="flex-grow bg-white dark:bg-slate-900/80 rounded-xl px-4 py-2 text-xs border border-slate-200 dark:border-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
              />
              <button
                id="btn-ai-chat-send"
                onClick={() => handleSend(inputText)}
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 p-2 px-4 rounded-xl shadow-sm active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold leading-none border border-blue-500/10"
              >
                <Send size={12} strokeWidth={2.5} />
                Send
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
