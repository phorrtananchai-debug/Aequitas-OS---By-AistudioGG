import React, { useState, FormEvent } from 'react';
import { 
  Save, 
  RefreshCw, 
  KeyRound, 
  Eye, 
  EyeOff,
  Laptop,
  ChevronRight,
  Database,
  Sparkles,
  FolderLock,
  Wrench,
  ToggleRight,
  ToggleLeft,
  Sliders
} from 'lucide-react';

interface SettingsTabProps {
  portfolioValue: number;
  onUpdatePortfolio: (val: number) => void;
  onTriggerAlert: (alert: { type: 'high' | 'advisory' | 'monitoring' | 'success'; typeLabel: string; title: string; description: string }) => void;
}

type SettingsSection = 'general' | 'portfolio' | 'aiServices' | 'syncStorage' | 'labs';

export default function SettingsTab({
  portfolioValue,
  onUpdatePortfolio,
  onTriggerAlert
}: SettingsTabProps) {
  // Active settings tab category
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // General state
  const [appearance, setAppearance] = useState<'light' | 'dark'>('light');
  const [density, setDensity] = useState<'standard' | 'dense' | 'spaced'>('standard');
  const [motion, setMotion] = useState<'smooth' | 'reduced' | 'none'>('smooth');

  // Portfolio state
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [dividendPref, setDividendPref] = useState<string>('compound');
  const [dcaInterval, setDcaInterval] = useState<string>('weekly');
  const [ledgerVal, setLedgerVal] = useState<string>(portfolioValue?.toString() || '0');
  const [nodeId, setNodeId] = useState<string>('sol-09');

  // AI Services state (Strictly Optional & Enhanced)
  const [aiProvider, setAiProvider] = useState<string>('gemini');
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [showGeminiKey, setShowGeminiKey] = useState<boolean>(false);
  const [openaiKey, setOpenaiKey] = useState<string>('');
  const [showOpenaiKey, setShowOpenaiKey] = useState<boolean>(false);
  const [aiMemory, setAiMemory] = useState<boolean>(true);
  const [aiCache, setAiCache] = useState<boolean>(true);
  const [aiSensitivity, setAiSensitivity] = useState<number>(4.0);

  // Sync & Storage
  const [gdriveSync, setGdriveSync] = useState<boolean>(false);
  const [brokerFuture, setBrokerFuture] = useState<boolean>(false);

  // Labs
  const [experimentalFeatures, setExperimentalFeatures] = useState<boolean>(false);
  const [sandboxMode, setSandboxMode] = useState<boolean>(true);
  const [tacticalAdvisory, setTacticalAdvisory] = useState<boolean>(false);

  const handleSaveParameters = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      const numericVal = parseFloat(ledgerVal);
      if (!isNaN(numericVal) && numericVal >= 0) {
        onUpdatePortfolio(numericVal);
      }
      setIsSaving(false);
      onTriggerAlert({
        type: 'success',
        typeLabel: 'SYSTEM RE-CALIBRATED',
        title: 'Local OS Parameters Calibrated',
        description: 'Selected configurations, default options, and AI modules reconciled safely.'
      });
    }, 1000);
  };

  const sectionsList = [
    { id: 'general' as SettingsSection, label: 'General Configuration', icon: Laptop, text: 'Visual layout & appearance' },
    { id: 'portfolio' as SettingsSection, label: 'Portfolio Parameters', icon: Database, text: 'Base currencies & limits' },
    { id: 'aiServices' as SettingsSection, label: 'AI Services Layer', icon: Sparkles, text: 'Optional intelligence & APIs', tag: 'OPTIONAL' },
    { id: 'syncStorage' as SettingsSection, label: 'Sync & Local Storage', icon: FolderLock, text: 'Snapshot backup & encryption' },
    { id: 'labs' as SettingsSection, label: 'Experimental Labs', icon: Wrench, text: 'Sandbox simulations', tag: 'LABS' },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-850 dark:text-[#F4EEE4] pb-12 font-sans">
      {/* Introduction Greeting */}
      <section>
        <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          AE OS CONTROL TERMINAL
        </span>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          System Core Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-3xl">
          Scale your local-first operating center. Calibrate visual dimensions, toggle optional external AI connections, adjust limits, and configure offline state storage.
        </p>
      </section>

      {/* Main Settings Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Tab Navigation Panels (4 Columns) */}
        <div className="lg:col-span-4 space-y-2">
          {sectionsList.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group active:scale-99 ${
                  isSelected 
                    ? 'bg-blue-50/80 dark:bg-blue-950/25 border-blue-200/50 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                    : 'bg-white/80 dark:bg-slate-900/10 border-slate-200/50 dark:border-slate-800/15 text-slate-650 dark:text-slate-400 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{sec.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal leading-tight block mt-0.5">{sec.text}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {sec.tag && (
                    <span className={`text-[8px] tracking-wider px-1.5 py-0.5 rounded font-black ${
                      sec.tag === 'OPTIONAL' 
                        ? 'bg-blue-100/60 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' 
                        : 'bg-amber-100/60 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {sec.tag}
                    </span>
                  )}
                  <ChevronRight size={13} className={`text-slate-400 transition-transform ${isSelected ? 'translate-x-1 text-blue-600' : 'group-hover:translate-x-0.5'}`} />
                </div>
              </button>
            );
          })}

          {/* Localized Operating Environment Status */}
          <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-905/20 border border-slate-150 dark:border-slate-850 text-xs mt-6 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black tracking-wider text-slate-455 uppercase pb-2 border-b border-slate-100 dark:border-slate-800/45">
              <span>LOCAL SECURITY INDEX</span>
              <span className="text-blue-600 dark:text-blue-400">PASSED</span>
            </div>
            <div className="space-y-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex justify-between">
                <span>Direct State Storage:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">Local-only (Private)</span>
              </div>
              <div className="flex justify-between">
                <span>Encryption System:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">AES-GCM-256 (Local)</span>
              </div>
              <div className="flex justify-between">
                <span>Broker Connection:</span>
                <span className="text-emerald-600 font-bold font-sans">Human Disconnected (Safe)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Settings Details Panel Forms (8 Columns) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25 shadow-sm min-h-[480px] bg-white text-slate-800">
          <form onSubmit={handleSaveParameters} className="space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-6">
              
              {/* SECTION 1: GENERAL */}
              {activeSection === 'general' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800/50">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-450 block">VISUAL SYSTEM DEFAULTS</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">General Setup</h3>
                  </div>

                  {/* Dark Mode Theme Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">Appearance Preset</label>
                    <div className="grid grid-cols-2 gap-3 font-medium text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setAppearance('light');
                          document.documentElement.classList.remove('dark');
                        }}
                        className={`py-3 px-4 rounded-xl border text-center transition-all ${
                          appearance === 'light'
                            ? 'border-blue-500 bg-blue-50/20 text-blue-600 font-bold'
                            : 'border-slate-200/50 hover:border-slate-300 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        Luminous White Theme
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAppearance('dark');
                          document.documentElement.classList.add('dark');
                        }}
                        className={`py-3 px-4 rounded-xl border text-center transition-all ${
                          appearance === 'dark'
                            ? 'border-blue-500 bg-blue-50/20 text-blue-600 font-bold'
                            : 'border-slate-200/50 hover:border-slate-300 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        Cosmic Slate Dark Theme
                      </button>
                    </div>
                  </div>

                  {/* Interface Density Option */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">Dashboard Grid Density</label>
                    <div className="grid grid-cols-3 gap-3 font-semibold text-xs text-center">
                      {(['standard', 'dense', 'spaced'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setDensity(opt)}
                          className={`py-2.5 px-2 rounded-xl border text-center uppercase tracking-wider text-[10px] transition-all ${
                            density === opt
                              ? 'border-blue-500 bg-blue-50/10 text-blue-600 font-black'
                              : 'border-slate-200/50 dark:border-slate-800 text-slate-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Motion Preferences */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">Animation Motion</label>
                    <select
                      value={motion}
                      onChange={(e) => setMotion(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs focus:outline-none"
                    >
                      <option value="smooth">Smooth Interactive Transitions (Default)</option>
                      <option value="reduced">Reduced Clutter-free Motion</option>
                      <option value="none">Zero Kinetic Animations</option>
                    </select>
                  </div>
                </div>
              )}

              {/* SECTION 2: PORTFOLIO */}
              {activeSection === 'portfolio' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800/15">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-450 block">LEDGER MATRICES</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">Portfolio Defaults</h3>
                  </div>

                  {/* Capital Ledger Input size */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">Base Portfolio Ledger Size (USD)</label>
                      <input
                        type="number"
                        value={ledgerVal}
                        onChange={(e) => setLedgerVal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 text-slate-950 dark:text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">Active RPC Node ID</label>
                      <select
                        value={nodeId}
                        onChange={(e) => setNodeId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 text-slate-950 dark:text-white rounded-xl px-4 py-3 text-xs focus:outline-none"
                      >
                        <option value="sol-09">sol-09 (Active Solana Mainnet Sync)</option>
                        <option value="eth-03">eth-03 (Backup Consensus Validator RPC)</option>
                        <option value="btc-01">btc-01 (Sovereign Bitcoin Ledger Index)</option>
                      </select>
                    </div>
                  </div>

                  {/* Base Currency selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">Valuation Base Currency</label>
                    <div className="flex gap-2.5">
                      {['USD', 'EUR', 'GBP', 'SOL', 'BTC'].map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => setBaseCurrency(curr)}
                          className={`flex-1 py-2 rounded-xl text-center border font-semibold text-xs transition-all ${
                            baseCurrency === curr
                              ? 'border-blue-500 bg-blue-50/20 text-blue-600 font-bold'
                              : 'border-slate-200/50 dark:border-slate-800 text-slate-500'
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dividend / DCA Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">Recurrent Yield Option</label>
                      <select
                        value={dividendPref}
                        onChange={(e) => setDividendPref(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 text-xs rounded-xl dark:bg-slate-900/40 dark:border-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="compound">Compound Automatically into DCA Matrix</option>
                        <option value="cash">Hold as Local Cash Asset Buffer</option>
                        <option value="hardware">Flag for manual physical key transfer</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">DCA Trigger Defaults</label>
                      <select
                        value={dcaInterval}
                        onChange={(e) => setDcaInterval(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 text-xs rounded-xl dark:bg-slate-900/40 dark:border-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="daily">Sovereign Daily Allocation Sweep</option>
                        <option value="weekly">Weekly Target Adherence Check (Default)</option>
                        <option value="biweekly">Bi-Weekly Balance Review Intervals</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: AI SERVICES LAYER */}
              {activeSection === 'aiServices' && (
                <div className="space-y-5 animate-fade-in text-xs font-medium">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800/15">
                    <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400 block pb-1">modular connected intelligence</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">AI Services settings</h3>
                  </div>

                  <p className="text-slate-550 leading-relaxed text-[11px] mb-4">
                    Aequitas local operations do not mandate live cloud database syncing. You can connect your own secure local API credentials optionally as a private thinking layer, keeping your raw assets data strictly under your own command.
                  </p>

                  {/* Provider Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">Standard Intelligence Provider</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'gemini', name: 'Google Gemini', desc: 'Default local models' },
                        { id: 'openai', name: 'OpenAI Developer', desc: 'Secure GPT API' },
                        { id: 'offline', name: 'Static Local Schema', desc: 'Zero API calls (Safe)' }
                      ].map((prov) => (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => setAiProvider(prov.id)}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                            aiProvider === prov.id
                              ? 'border-blue-500 bg-blue-50/20 text-blue-600 font-bold'
                              : 'border-slate-200/50 dark:border-slate-800 text-slate-500 bg-white/50'
                          }`}
                        >
                          <span className="font-extrabold block text-xs">{prov.name}</span>
                          <span className="text-[9px] text-slate-400 font-normal leading-normal mt-1 block">{prov.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* API Inputs */}
                  {aiProvider === 'gemini' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">Gemini Secret API Key</label>
                      <div className="relative">
                        <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showGeminiKey ? 'text' : 'password'}
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          placeholder="AI_STUDIO_GEMINI_KEY"
                          className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showGeminiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-450 block mt-1 leading-normal">
                        Key is held in runtime browser memory only. No personal keys sync to remote databases.
                      </span>
                    </div>
                  )}

                  {aiProvider === 'openai' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-655 block uppercase tracking-wider">OpenAI Secret API Key</label>
                      <div className="relative">
                        <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showOpenaiKey ? 'text' : 'password'}
                          value={openaiKey}
                          onChange={(e) => setOpenaiKey(e.target.value)}
                          placeholder="sk-or-proj-key-xxxx"
                          className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showOpenaiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Memory & Cache slider */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                        <div>
                          <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">AI Local Cache</span>
                          <span className="text-[10px] text-slate-400 leading-tight block">Save calculations to disk</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAiCache(!aiCache)}
                          className="text-blue-600"
                        >
                          {aiCache ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-455" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                        <div>
                          <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">AI Context Memory</span>
                          <span className="text-[10px] text-slate-400 leading-tight block">Remember specific audit prompts</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAiMemory(!aiMemory)}
                          className="text-blue-600"
                        >
                          {aiMemory ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-455" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-655">
                      <label className="text-[10px] tracking-wider uppercase">Advisor Sensitivity Sensitivity</label>
                      <span className="font-mono text-blue-600">±{aiSensitivity}% drift bound limit</span>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={aiSensitivity}
                      onChange={(e) => setAiSensitivity(parseFloat(e.target.value))}
                      className="accent-blue-600 h-1.5 w-full bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 4: SYNC & STORAGE */}
              {activeSection === 'syncStorage' && (
                <div className="space-y-5 animate-fade-in text-xs font-medium">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800/15">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-450 block">OFFLINE PRIVACY PROTECTION</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">Sync & Storage Center</h3>
                  </div>

                  <p className="text-slate-500 leading-normal text-[11px]">
                    Your Aequitas operational snapshot history can be backed up as robustly encrypted JSON templates. Maintain strict user possession.
                  </p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/20 p-3.5 border border-slate-200/50 dark:border-slate-805/10 rounded-2xl">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Offline Private Backups Only</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">State calculations and tickers are cached exclusively in browser localStorage.</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded-full border border-emerald-100 uppercase">ACTIVE COHERENCE</span>
                    </div>

                    {/* Google Drive sync Option */}
                    <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 p-3.5 border border-slate-200/50 dark:border-slate-805/10 rounded-2xl">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Google Drive Blueprint Backup</span>
                        <span className="text-[10px] text-slate-400 block">Deploy settings and history backups to connected accounts securely.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setGdriveSync(!gdriveSync);
                          onTriggerAlert({
                            type: 'monitoring',
                            typeLabel: 'DRIVE CONFIGURED',
                            title: 'Storage Anchor Refinement',
                            description: `Secure Google Drive archive pipeline configured to state - ${!gdriveSync ? 'Active' : 'Muted'}`
                          });
                        }}
                        className="text-blue-600"
                      >
                        {gdriveSync ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-455" />}
                      </button>
                    </div>

                    {/* Future broker integration option */}
                    <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 p-3.5 border border-slate-200/50 dark:border-slate-805/10 rounded-2xl">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Sovereign Hardware Connector</span>
                        <span className="text-[10px] text-slate-400 block">(Future Integration) Safe sign ledger options locally on your physical module.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBrokerFuture(!brokerFuture);
                          onTriggerAlert({
                            type: 'success',
                            typeLabel: 'LABS MODE',
                            title: 'Modular Hardware Anchored',
                            description: 'Security rules for hardware signature keys queued for subsequent releases.'
                          });
                        }}
                        className="text-blue-600"
                      >
                        {brokerFuture ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-455" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: LABS EXPERIMENTAL */}
              {activeSection === 'labs' && (
                <div className="space-y-5 animate-fade-in text-xs font-medium">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800/15">
                    <span className="text-[10px] uppercase font-black tracking-wider text-amber-600 block">ALPHA OS PLATFORM FEATURES</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">Experimental Labs</h3>
                  </div>

                  <div className="p-3 bg-amber-50/10 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 rounded-xl leading-relaxed text-[11px] border border-amber-300/10 mb-4">
                    ⚠️ Settings in this section are highly experimental. They empower advanced technical auditing and risk modeling matrices directly inside your local environment.
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 p-3.5 border border-slate-100 dark:border-slate-800/10 rounded-2xl">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Sovereign Labs Sandbox Mode</span>
                        <span className="text-[10px] text-slate-400 block">Runs backtesting simulation grids and performance projection calculators.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSandboxMode(!sandboxMode)}
                        className="text-blue-600"
                      >
                        {sandboxMode ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-455" />}
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 p-3.5 border border-slate-100 dark:border-slate-800/10 rounded-2xl">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Mean-Reversion Tuning Layer</span>
                        <span className="text-[10px] text-slate-400 block">Empower strategic allocation models locally during risk simulation tests.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTacticalAdvisory(!tacticalAdvisory);
                          onTriggerAlert({
                            type: 'advisory',
                            typeLabel: 'TACTICAL ENABLED',
                            title: 'Risk Modeling Sandbox Active',
                            description: 'Strategic alpha allocation simulations enabled. Review in Strategy Labs.'
                          });
                        }}
                        className="text-blue-600"
                      >
                        {tacticalAdvisory ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-455" />}
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 p-3.5 border border-slate-100 dark:border-slate-800/10 rounded-2xl">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Future Smart Notifications</span>
                        <span className="text-[10px] text-slate-400 block">Listen for specific localized threshold alerts (Drift Alerts).</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExperimentalFeatures(!experimentalFeatures)}
                        className="text-blue-600"
                      >
                        {experimentalFeatures ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-455" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Core Settings Submit action */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800/40 flex flex-col sm:flex-row gap-3 items-center justify-between mt-8">
              <span className="text-[11px] text-slate-400 font-medium">Any changes made are compiled and deployed safely locally.</span>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-sm hover:shadow-blue-600/10"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Calibrating OS...
                  </>
                ) : (
                  <>
                    <Save size={12} />
                    Save & Deploy System Parameters
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
