import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Gamepad2, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import bunnyBg from './assets/images/bunny_bundle_bg_1790681972126.jpg';

interface Redemption {
  id: string;
  code: string;
  amount: number;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  transactionId: string;
}

interface ToastNotification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export default function App() {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [redeemCode, setRedeemCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Stored state for wallet & history
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('raistar_wallet_balance');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [history, setHistory] = useState<Redemption[]>(() => {
    const saved = localStorage.getItem('raistar_redeem_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'init-1',
        code: 'RAISTAR150',
        amount: 150,
        timestamp: 'Just now',
        status: 'SUCCESS',
        transactionId: 'TXN89320145'
      }
    ];
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    localStorage.setItem('raistar_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('raistar_redeem_history', JSON.stringify(history));
  }, [history]);

  // Active Codes list
  const activeCodes = [
    { code: 'RAISTAR100', amount: 100, label: 'Starter Bundle' },
    { code: 'RAISTAR120', amount: 120, label: 'Warrior Pass' },
    { code: 'RAISTAR130', amount: 130, label: 'Fire Crates' },
    { code: 'RAISTAR140', amount: 140, label: 'Elite Voucher' },
    { code: 'RAISTAR150', amount: 150, label: 'Bunny Royal' },
  ];

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const handleCopyCode = (code: string, amount: number) => {
    navigator.clipboard?.writeText(code);
    setRedeemCode(code);
    setSelectedAmount(amount.toString());
    setCopiedCode(code);
    showToast('success', `Code ${code} copied & applied to form!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAmount || !redeemCode.trim()) {
      showToast(
        'error',
        'Please select an amount and enter a valid redeem code.'
      );
      return;
    }

    const cleanCode = redeemCode.trim().toUpperCase();
    const amountVal = parseInt(selectedAmount, 10);

    setIsProcessing(true);

    setTimeout(() => {
      // Check duplicate redemption
      const alreadyUsed = history.some(
        (item) => item.code.toUpperCase() === cleanCode && item.status === 'SUCCESS'
      );

      const txnId = 'FF' + Math.floor(10000000 + Math.random() * 90000000);
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      if (alreadyUsed) {
        showToast(
          'error',
          `Code ${cleanCode} has already been claimed! Try another active code.`
        );
        const failedRecord: Redemption = {
          id: Date.now().toString(),
          code: cleanCode,
          amount: amountVal,
          timestamp: currentTime,
          status: 'FAILED',
          transactionId: txnId
        };
        setHistory((prev) => [failedRecord, ...prev]);
        setIsProcessing(false);
        return;
      }

      // Success
      const successRecord: Redemption = {
        id: Date.now().toString(),
        code: cleanCode,
        amount: amountVal,
        timestamp: currentTime,
        status: 'SUCCESS',
        transactionId: txnId
      };

      setHistory((prev) => [successRecord, ...prev]);
      setWalletBalance((prev) => prev + amountVal);

      // Notification format requested:
      // "Congratulations! ₹[Amount] redeem code [Code] has been redeemed successfully!"
      showToast(
        'success',
        `Congratulations! ₹${amountVal} redeem code ${cleanCode} has been redeemed successfully!`
      );

      setRedeemCode('');
      setSelectedAmount('');
      setIsProcessing(false);
    }, 700);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your redemption history?')) {
      setHistory([]);
      localStorage.removeItem('raistar_redeem_history');
      showToast('success', 'Redemption history cleared successfully.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-black overflow-x-hidden font-sans">
      
      {/* Background Free Fire Bunny Bundle Artwork Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-20 filter contrast-125 saturate-125"
        style={{ backgroundImage: `url(${bunnyBg})` }}
      />

      {/* Cyber Neon Atmospheric Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-orange-600/25 via-cyan-500/15 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 bg-orange-600/15 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0d0d0d]/70 to-[#0d0d0d]" />
      </div>

      {/* Main Container Content */}
      <div className="relative z-10 flex flex-col flex-grow">
        
        {/* Top Minimal Navigation Bar */}
        <header className="border-b border-white/10 backdrop-blur-md bg-[#0d0d0d]/85 px-4 sm:px-8 py-3.5 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            
            {/* Logo lockup */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-cyan-500 p-[2px] shadow-lg shadow-orange-500/20">
                <div className="w-full h-full bg-[#121212] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-white font-orbitron">
                  RAISTAR <span className="text-orange-500">GAMING</span>
                </span>
                <span className="text-[10px] font-semibold text-cyan-400 tracking-widest uppercase">
                  Official Portal
                </span>
              </div>
            </div>

            {/* Live Wallet Balance Pill */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
                <Coins className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400 font-medium">Balance:</span>
                <span className="text-sm font-bold text-white tracking-wide font-mono text-cyan-300">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center pt-10 pb-6 px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Bunny Bundle Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-cyan-500/10 to-orange-500/10 border border-orange-500/30 text-xs font-bold uppercase tracking-widest text-orange-400 mb-5 shadow-[0_0_20px_rgba(255,106,0,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Free Fire Bunny Bundle Edition</span>
            </div>

            {/* Requirement 1: Main Header Text "RAISTAR REDEEM CODE" (Large, glowing font, centered) */}
            <h1 
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-wider uppercase font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-cyan-400 leading-tight"
              style={{
                textShadow: '0 0 25px rgba(255,106,0,0.6), 0 0 50px rgba(0,210,255,0.4)'
              }}
            >
              RAISTAR REDEEM CODE
            </h1>

            {/* Requirement 1: Subtitle "Free Fire Code Redemption Portal" */}
            <p className="mt-3 text-lg sm:text-2xl font-bold tracking-wide text-cyan-300 uppercase font-rajdhani">
              Free Fire Code Redemption Portal
            </p>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Claim verified Free Fire diamond vouchers and instant wallet rewards directly to your gaming account.
            </p>
          </motion.div>
        </section>

        {/* 3-Step Guide Section (Requirement 5) */}
        <section className="max-w-4xl mx-auto px-4 mb-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold flex items-center justify-center font-orbitron text-sm shrink-0">
                1
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wide">1. Select Amount</p>
                <p className="text-xs text-slate-400">Choose ₹100, ₹120, ₹130, ₹140 or ₹150</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold flex items-center justify-center font-orbitron text-sm shrink-0">
                2
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wide">2. Enter Code</p>
                <p className="text-xs text-slate-400">Paste your alphanumeric voucher</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center justify-center font-orbitron text-sm shrink-0">
                3
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wide">3. Click Redeem Now</p>
                <p className="text-xs text-slate-400">Get instant approval and credits</p>
              </div>
            </div>

          </div>
        </section>

        {/* Central Content Grid: Form + Active Codes */}
        <section className="max-w-6xl mx-auto px-4 pb-14 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Redeem Form (Requirement 3: Centered Sleek UI Card) - 7 cols */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative p-[1px] rounded-3xl bg-gradient-to-b from-orange-500/50 via-cyan-500/30 to-white/10 shadow-[0_0_50px_rgba(255,106,0,0.15)]"
            >
              <div className="bg-[#121214]/95 backdrop-blur-xl rounded-[23px] p-6 sm:p-8 border border-white/5">
                
                {/* Card Title Bar */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20 border border-orange-500/30">
                      <Gamepad2 className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-wider text-white font-orbitron">
                        Instant Redemption
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">
                        Instant Free Fire Diamonds & Cash Voucher Portal
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Servers Online
                  </span>
                </div>

                {/* Main Form */}
                <form onSubmit={handleRedeem} className="space-y-6">
                  
                  {/* Dropdown Menu: Label "Select Redeem Amount" */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="amount-select" 
                      className="block text-sm font-bold uppercase tracking-wider text-slate-300 font-rajdhani flex items-center justify-between"
                    >
                      <span>Select Redeem Amount</span>
                      <span className="text-xs text-orange-400 font-normal">* Required</span>
                    </label>

                    <div className="relative">
                      <select
                        id="amount-select"
                        value={selectedAmount}
                        onChange={(e) => setSelectedAmount(e.target.value)}
                        className="w-full h-14 pl-4 pr-10 bg-[#1a1a1f] border border-white/15 focus:border-cyan-400 rounded-xl text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-[#121214] text-slate-400">
                          -- Choose Voucher Amount --
                        </option>
                        <option value="100" className="bg-[#121214] text-white">₹100 (Starter Bundle)</option>
                        <option value="120" className="bg-[#121214] text-white">₹120 (Standard Pass)</option>
                        <option value="130" className="bg-[#121214] text-white">₹130 (Weapons Crate)</option>
                        <option value="140" className="bg-[#121214] text-white">₹140 (Special Airdrop)</option>
                        <option value="150" className="bg-[#121214] text-white">₹150 (Bunny Royal Deluxe)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Text Input Field: Label "Enter Redeem Code" with placeholder "XYZ123ABC" */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="code-input" 
                      className="block text-sm font-bold uppercase tracking-wider text-slate-300 font-rajdhani flex items-center justify-between"
                    >
                      <span>Enter Redeem Code</span>
                      <span className="text-xs text-cyan-400 font-normal">* Required</span>
                    </label>

                    <div className="relative">
                      <input
                        id="code-input"
                        type="text"
                        value={redeemCode}
                        onChange={(e) => setRedeemCode(e.target.value)}
                        placeholder="XYZ123ABC"
                        className="w-full h-14 px-4 bg-[#1a1a1f] border border-white/15 focus:border-orange-500 rounded-xl text-white font-mono font-bold text-lg uppercase tracking-widest placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Standard Free Fire 10-12 character alphanumeric voucher code.
                    </p>
                  </div>

                  {/* Action Button: Styled with vibrant gradient colors (bright orange and neon blue), labeled "REDEEM NOW" */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="relative w-full h-14 rounded-xl font-orbitron font-extrabold text-base tracking-widest uppercase text-white shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed group"
                      style={{
                        background: 'linear-gradient(90deg, #ff6a00 0%, #ff8c00 45%, #00d2ff 100%)',
                        boxShadow: '0 0 25px rgba(255, 106, 0, 0.45), 0 0 40px rgba(0, 210, 255, 0.3)'
                      }}
                    >
                      {/* Button Shimmer */}
                      <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>VERIFYING SERVER...</span>
                          </>
                        ) : (
                          <>
                            <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
                            <span>REDEEM NOW</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                </form>

                {/* Security Badge */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    Raistar Official Verification
                  </span>
                  <span>100% Guaranteed Payout</span>
                </div>

              </div>
            </motion.div>
          </div>

          {/* RIGHT: Active Redeem Codes Section (Requirement 4) - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Codes Card */}
            <div className="p-6 rounded-3xl bg-[#141418]/90 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/60">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base uppercase font-orbitron tracking-wider">
                      Active Redeem Codes
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Click to copy and auto-fill into the form
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {activeCodes.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleCopyCode(item.code, item.amount)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-cyan-500/10 border border-white/10 hover:border-orange-500/40 transition-all duration-200 group text-left cursor-pointer active:scale-[0.99]"
                    title="Click to copy and auto-fill"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm tracking-wider text-orange-400 bg-orange-950/40 border border-orange-500/30 px-2.5 py-1 rounded-md group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors">
                        {item.code}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">₹{item.amount}</span>
                        <span className="text-[10px] text-slate-400">{item.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                      {copiedCode === item.code ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>COPY</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>All listed codes are currently active and refreshed for today.</span>
              </div>
            </div>

            {/* Quick Rules Card */}
            <div className="p-5 rounded-2xl bg-[#141418]/60 border border-white/5 text-xs text-slate-400 space-y-2">
              <p className="font-bold text-white uppercase tracking-wider font-rajdhani text-sm">
                Redemption Policy:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Each unique code can be claimed once per user device.</li>
                <li>Codes must correspond to the selected amount tier.</li>
                <li>Rewards reflect directly into your wallet balance.</li>
              </ul>
            </div>

          </div>

        </section>

        {/* Recent Redemption History Table (Requirement 4) */}
        <section className="max-w-6xl mx-auto px-4 pb-16 w-full">
          <div className="p-6 rounded-3xl bg-[#141418]/90 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/60 overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg uppercase font-orbitron tracking-wider">
                    Recent Redemption History
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live audit logs of vouchers processed on this session
                  </p>
                </div>
              </div>

              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="self-start sm:self-auto text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-3 py-1.5 rounded-lg border border-rose-500/30 transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="font-semibold text-sm">No redemptions logged yet.</p>
                <p className="text-xs text-slate-600 mt-1">Redeem an active code above to view live records.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Redeem Code</th>
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white tracking-wider">
                          {item.code}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-cyan-400/90">
                          {item.transactionId}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {item.timestamp}
                        </td>
                        <td className="py-3.5 px-4">
                          {item.status === 'SUCCESS' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              SUCCESS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              <AlertTriangle className="w-3 h-3" />
                              FAILED
                            </span>
                          )}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-bold font-mono text-base ${
                          item.status === 'SUCCESS' ? 'text-emerald-400' : 'text-slate-500 line-through'
                        }`}>
                          ₹{item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </section>

      </div>

      {/* Footer strictly in ENGLISH */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0a0a0d] py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-medium text-slate-400">
              © {new Date().getFullYear()} RAISTAR REDEEM CODE. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Free Fire Community Fan Portal</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">256-Bit SSL Encrypted</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 max-w-xl mx-auto">
            Disclaimer: Raistar Redeem Code Portal is an independent rewards distribution hub for gamers. Never share your private account credentials with third parties.
          </p>
        </div>
      </footer>

      {/* Dynamic Animated Notification Toast Center */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-2xl flex gap-3 items-start border backdrop-blur-xl ${
                toast.type === 'success'
                  ? 'bg-[#0e2417]/95 border-emerald-500/50 text-white shadow-emerald-950/50'
                  : 'bg-[#290d0d]/95 border-rose-500/50 text-white shadow-rose-950/50'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div className="flex-grow space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300 font-orbitron">
                  {toast.type === 'success' ? 'Redemption Successful' : 'Action Required'}
                </p>
                <p className="text-sm font-medium leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-white/60 hover:text-white shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
