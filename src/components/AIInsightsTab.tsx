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
import { ChatMessage, AlertItem, Holding, DailyBrief } from '../types';

interface AIInsightsProps {
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
  holdings?: Holding[];
  dailyBrief?: DailyBrief;
  aiImportStatus?: string | null;
}

const TEMPLATE_SUGGESTIONS = [
  { text: 'Explain tax wrapper deductions of Thai RMF / SSF funds', topic: 'thai_tax' },
  { text: 'Audit current deviation drifts for S&P 500 ETFs vs Growth stocks', topic: 'drift_audit' },
  { text: 'How does compounding passive dividend reinvestments work here?', topic: 'dividends' },
];

export default function AIInsightsTab({ onTriggerAlert, holdings, dailyBrief, aiImportStatus }: AIInsightsProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: 'Greetings. I am your Aequitas local strategy advisor. I evaluate asset drift indexes, S&P 500 trailing-yield indicators, and Thai retirement-saving tax wrap efficiency blocks to formulate balanced, long-term wealth guidelines. How can I assist you in your human-controlled planning process today?',
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
      if (promptLower.includes('tax') || promptLower.includes('thai') || promptLower.includes('rmf')) {
        aiResponseText = `### Kasikorn S&P 550 RMF Tax-Wrapper Audit

Reconciling Thai Retirement Mutual Funds (RMF) and Super Savings Funds (SSF) under local law:
1. **Tax Savings Bounds**: Investments reduce active personal taxable income up to **30%** of gross income (standard caps apply up to **500,000 THB** package limits).
2. **Holding Compliance**: RMF requires continuous annual holding blocks until age **55** and at least 5 full years of contributions. Withdrawal before this triggers retroactive tax penalty claims.
3. **Optimized Target Selection**: Directing your monthly DCA allocations to Thai S&P 500 RMF indexes provides double compounding—capturing US equity growth while locking in **20%-35%** risk-free tax savings on input.`;
      } else if (promptLower.includes('drift') || promptLower.includes('growth') || promptLower.includes('etf')) {
        aiResponseText = `### Portfolio Drift & Volatility Vector Audit

Evaluating target weight boundaries across your structural portfolios:
* **Growth Equities (MSFT, NVDA, GOOGL etc.)**: Currently at **44.3%** vs a target range cap of **40%**. Shows positive momentum but indicates a minor drift breach of **+4.3%**.
* **Core S&P 500 ETF (VOO, SCHD)**: Currently at **31.7%** vs a target of **35%**. Consists of deep stable collateral.
* **Calm Rebalancing Suggestion**: Under the Aequitas philosophy, we do NOT execute sudden liquidations. Redirect the next 3 consecutive **Monthly DCA contributions** exclusively to target S&P 500 and Cash Buffer positions ($3,500 target DCA bounds) to naturally compress growth-weight drifts without tax costs.`;
      } else if (promptLower.includes('dividend') || promptLower.includes('passive') || promptLower.includes('compound')) {
        aiResponseText = `### Passive Dividend Stream & Liquidity Compound Engine

Analyzing yield metrics from passive income holdings (JEPQ, SCHD, ABBV, etc.):
* **Current Yield Runrate**: Monthly average cash flows are configured at **$1,650.00** ($19,800.00 annualized).
* **Compounding Schedule**: Income distributions are held in cash buffer layers automatically. 
* **Optimized Contribution Rules**: Allocating these dividends directly to your Standard ETF DCA plans (e.g. VOO) rather than spot withdrawals amplifies share accumulation curves by an estimated **+1.85%** annualized compounding spread.`;
      } else {
        aiResponseText = `### Strategic Planning Synthesis

Evaluating query: *&quot;${textToSend}&quot;*

Based on live local parameters:
1. All portfolio drift indices are safely within standard risk-tolerance limits (current drift marker stable at **3.2%**).
2. Passive expected stock dividends indicate steady coverage margins of **10.5x**.
3. Thai fund wrappers comply perfectly with active local tax brackets.

*Suggestions: Ask about Thai RMF / SSF tax rules, rebalancing drift schedules, or dividend reinvestment triggers for specialized models.*`;
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
        title: 'Advisor Logic Generated',
        description: 'Aequitas Advisor successfully synthesized optimal holding ratios.'
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#252830] dark:text-[#F4EEE4] pb-12 flex flex-col h-[calc(100vh-140px)] min-h-[500px] font-sans">
      
      {/* Top Header info */}
      <section className="shrink-0 animate-fade-in">
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
          Advisor Guidance Workspace
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
          De-compose complex strategy runs, optimize conservative risk limits, inspect Thai tax deductible guidelines, or study structural compound wealth themes.
        </p>
      </section>

      {/* Main Interactive Workstation Area */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active chat screen (8 columns mapping) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 shadow-sm flex flex-col border border-slate-205/60 dark:border-slate-800/25 bg-white">
          
          {/* Messages feed */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Visual sender nodes */}
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-300'
                }`}>
                  {msg.sender === 'user' ? 'H' : <Brain size={14} />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-100 dark:bg-slate-900/40 dark:border-slate-800/20 rounded-tl-none font-sans text-slate-800 dark:text-slate-100'
                  }`}>
                    {msg.sender === 'ai' ? (
                      <div className="markdown-body space-y-2 whitespace-pre-line antialiased">
                        {msg.text}
                      </div>
                    ) : (
                      <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold block text-slate-400 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.sender === 'user' ? 'HUMAN DECISION' : 'AEQUITAS INTEL'} • {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Thinking simulated loader bubble */}
            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-xl shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600">
                  <Brain size={14} className="animate-pulse" />
                </div>
                <div className="bg-slate-50 border border-slate-100 dark:bg-slate-900/30 dark:border-slate-800/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Quick recommendations / preset pills */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/10 shrink-0">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-2">INTELLIGENCE CONSULTING TOPICS</span>
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_SUGGESTIONS.map((sug) => (
                <button
                  key={sug.topic}
                  onClick={() => handleSend(sug.text)}
                  className="px-3.5 py-2 hover:bg-slate-100 text-slate-650 bg-slate-50 hover:text-blue-600 border border-slate-200/50 rounded-xl text-[11px] font-semibold text-left transition-all max-w-full duration-200 shadow-none hover:shadow-sm"
                >
                  {sug.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input control elements */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/10 shrink-0 flex gap-2">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              placeholder="Ask Advisor about tax wrappers, drift alignment rules, or reinvesting dividends..."
              className="flex-1 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm p-3 px-4 rounded-xl border border-slate-200 transition-all outline-none text-slate-900"
            />
            <button
              onClick={() => handleSend(inputText)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl aspect-square flex items-center justify-center p-3 font-semibold hover:shadow-lg transition-all shadow-blue-500/10 w-12 shrink-0 cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>

        </div>

        {/* Local parameter specs sidebar info panels (4 columns mapping) */}
        <div className="lg:col-span-4 space-y-4 shrink-0 flex flex-col justify-between">
          
          <div className="glass-panel p-5 rounded-3xl border border-slate-205/60 dark:border-slate-800/25 bg-white flex-1 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider">operating parameters</span>
              <h3 className="text-sm font-bold text-slate-900 mt-1 dark:text-white">Active Core Variables</h3>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-slate-400">DECISION ARCHETYPE</span>
                <span className="font-bold text-slate-850">Human-controlled Sovereign Portfolio</span>
                <span className="text-[10px] text-slate-450 mt-0.5 leading-normal">
                  All transaction guidelines, RMF tax choices, and drift offsets are monitored under manual user control.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-slate-400">ACTIVE DRIFT BARRIERS</span>
                <span className="font-bold text-slate-850">3.5% Maximum Permissible Deviation</span>
                <span className="text-[10px] text-slate-455 mt-0.5 leading-normal">
                  DCA rebalance routing triggers when cumulative sector weights exceed target goals by +/- 3.5%.
                </span>
              </div>
            </div>
          </div>

          {/* Secure advisory disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/40 text-[11px] leading-relaxed text-slate-500 dark:bg-amber-950/10 dark:border-amber-800/20">
            <div className="flex gap-2 items-start text-amber-800/80">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <p className="font-medium">
                Advisory note: Information and modeling templates are generated offline inside local sandbox caches according to standard capital principles. Verify all targets against physical local laws before execution.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
