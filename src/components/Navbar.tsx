import React from 'react';
import { NavTab } from '../types/index.ts';
import { 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Activity, 
  Layers, 
  Terminal, 
  Bot, 
  Compass,
  HardDrive,
  TrendingUp,
  Atom,
  Presentation,
  Network,
  ShoppingBag,
  FileCheck2,
  Server,
  Database,
  Lock,
  WifiOff,
  Calculator,
  Laptop,
  Download,
  Mail
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAiConsultant: () => void;
  onOpenPitchDeck: () => void;
  onOpenProtocolInspector: () => void;
  onOpenDesktopModal?: () => void;
  onOpenEmailModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  onTabChange, 
  onOpenAiConsultant,
  onOpenPitchDeck,
  onOpenProtocolInspector,
  onOpenDesktopModal,
  onOpenEmailModal
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'market',
      label: 'Market & Competitive Intel',
      icon: <Compass className="w-4 h-4" />,
      badge: 'Feasibility'
    },
    {
      id: 'valuation',
      label: 'Valuation & Sales Forecast',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: 'Unicorn 9.5/10'
    },
    {
      id: 'tco-calculator',
      label: 'TCO & Cloud ROI',
      icon: <Calculator className="w-4 h-4" />,
      badge: '3-Year Ledger'
    },
    {
      id: 'mac-pro-station',
      label: 'Mac Pro Desktop Station',
      icon: <Laptop className="w-4 h-4" />,
      badge: 'Apple Silicon'
    },
    {
      id: 'academic-moat',
      label: 'Academic Research & Moat',
      icon: <Atom className="w-4 h-4" />,
      badge: 'Irreplaceable'
    },
    {
      id: 'hardware',
      label: 'Hardware & Sizing',
      icon: <HardDrive className="w-4 h-4" />,
      badge: 'UMA Bench'
    },
    {
      id: 'mesh-topology',
      label: 'Neural Mesh & Cluster',
      icon: <Server className="w-4 h-4" />,
      badge: 'Thunderbolt 4'
    },
    {
      id: 'knowledge-vault',
      label: 'Zero-Leakage Cortex',
      icon: <Database className="w-4 h-4" />,
      badge: 'Sub-2ms'
    },
    {
      id: 'mission-control',
      label: 'Autonomous Mission Control',
      icon: <Layers className="w-4 h-4" />,
      badge: 'Autonomous AEO'
    },
    {
      id: 'model-zoo',
      label: 'Sovereign Model Zoo',
      icon: <Cpu className="w-4 h-4" />,
      badge: 'MLX Lab'
    },
    {
      id: 'swarm',
      label: 'Live Swarm Sandbox',
      icon: <Activity className="w-4 h-4" />,
      badge: 'Interactive'
    },
    {
      id: 'studio',
      label: 'Agent Studio',
      icon: <Bot className="w-4 h-4" />,
    },
    {
      id: 'skill-store',
      label: 'Sovereign Skill Store',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: 'Ecosystem'
    },
    {
      id: 'compliance',
      label: 'Enterprise Compliance',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: 'ISO/EU AI'
    },
    {
      id: 'deployment',
      label: 'Turnkey Blueprints',
      icon: <Terminal className="w-4 h-4" />,
      badge: 'Mac Mini'
    }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner with SkyShadow Branding and Hardware Telemetry */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                SKY<span className="text-cyan-400">SHADOW</span>
                <span className="text-xs px-2 py-0.5 rounded-md font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  LOCAL-MESH OS
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>skyshadow.co.uk</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Air-Gapped Local Appliance
              </span>
            </p>
          </div>
        </div>

        {/* Live System Badges & Key Modals */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Air-Gap Killswitch Hardened Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/60" title="Physical Air-Gap Firewall Active: External WAN sockets rejected">
            <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
            <span>AIR-GAP: ARMED (0 WAN B/s)</span>
          </div>

          {/* Pitch Deck Button */}
          <button
            onClick={onOpenPitchDeck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer active:scale-95"
            aria-label="Open Investor Pitch Deck"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Pitch Deck</span>
          </button>

          {/* Protocol Inspector Button */}
          <button
            onClick={onOpenProtocolInspector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer active:scale-95"
            aria-label="Open Protocol Inspector"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>SAMP Protocol</span>
          </button>

          {/* Deploy to Mac Pro Button */}
          {onOpenDesktopModal && (
            <button
              onClick={onOpenDesktopModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 transition-all cursor-pointer active:scale-95 shadow-sm shadow-cyan-500/10"
              aria-label="Deploy to Mac Pro Desktop"
            >
              <Laptop className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deploy to Mac Pro</span>
            </button>
          )}

          {/* Email Test Link Button */}
          {onOpenEmailModal && (
            <button
              onClick={onOpenEmailModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer active:scale-95"
              aria-label="Send Mac Pro Test Link to Email"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Email Link</span>
            </button>
          )}

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAiConsultant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer active:scale-95"
            aria-label="Open AI Architecture Consultant"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Advisor</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/60 pt-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
