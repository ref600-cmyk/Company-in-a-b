import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Check, 
  Copy, 
  Terminal, 
  Laptop, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  ExternalLink,
  Layers,
  ArrowRight,
  Mail
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { generateMacProLauncherScript } from '../utils/macProStationEngine.ts';

interface MacProDesktopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStationView?: () => void;
  onOpenEmailModal?: () => void;
}

export const MacProDesktopModal: React.FC<MacProDesktopModalProps> = ({
  isOpen,
  onClose,
  onOpenStationView,
  onOpenEmailModal
}) => {
  const { isInstallable, isInstalled, isMac, install } = usePWAInstall();
  const [copiedScript, setCopiedScript] = useState(false);
  const [downloadedLauncher, setDownloadedLauncher] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'launcher' | 'curl'>('pwa');

  if (!isOpen) return null;

  const handleDownloadLauncher = () => {
    const content = generateMacProLauncherScript();
    const blob = new Blob([content], { type: 'text/x-shellscript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SkyShadow-MacPro-Station.command';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedLauncher(true);
    setTimeout(() => setDownloadedLauncher(false), 3000);
  };

  const handleCopyCurl = () => {
    const cmd = `curl -sSL "${window.location.origin}/api/macpro/launcher.command" -o ~/Desktop/SkyShadow.command && chmod +x ~/Desktop/SkyShadow.command && open ~/Desktop/SkyShadow.command`;
    navigator.clipboard.writeText(cmd);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-slate-900/95 shadow-2xl shadow-cyan-950/50 p-6 md:p-8 overflow-hidden text-slate-100">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Laptop className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Deploy to Mac Pro Desktop</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  macOS Native
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Install as a standalone desktop app or launch directly via double-clickable Mac Pro script
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-slate-950/80 p-1 border border-slate-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'pwa'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>1-Click PWA App</span>
          </button>
          <button
            onClick={() => setActiveTab('launcher')}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'launcher'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>.command Desktop File</span>
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'curl'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal 1-Liner</span>
          </button>
        </div>

        {/* Tab 1: PWA Native Desktop App */}
        {activeTab === 'pwa' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>macOS Standalone Desktop Window</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Installs SkyShadow directly into your <span className="text-slate-200 font-medium">/Applications</span> folder and adds an icon to your Mac Pro Dock. Runs in its own distraction-free window with full offline service worker caching.
                  </p>
                </div>
              </div>

              {isInstalled ? (
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 text-xs">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SkyShadow is currently installed and running as a standalone desktop application on your Mac!</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={async () => {
                    const res = await install();
                    if (res) onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Install SkyShadow to Mac Pro Desktop / Dock</span>
                </button>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="text-xs text-slate-300 font-medium">How to add to Mac Pro Desktop / Dock in your browser:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        Google Chrome / Brave
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Click the <span className="text-slate-200 font-semibold">Install icon (⊕)</span> in the address bar, or click Menu (⋮) &gt; <span className="text-slate-200">Save and share</span> &gt; <span className="text-slate-200">Install SkyShadow</span>.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        macOS Safari
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Click <span className="text-slate-200 font-semibold">File</span> in the top macOS menu bar &gt; select <span className="text-slate-200 font-semibold">"Add to Dock..."</span> to pin SkyShadow as a native Mac app.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-slate-200 font-bold">Offline Ready</span>
                <span>Air-gapped Service Worker</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-slate-200 font-bold">Metal 3 Accelerated</span>
                <span>Zero CPU-GPU copy delay</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-slate-200 font-bold">Secure Enclave</span>
                <span>Hardware Attested Root</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: .command Launcher */}
        {activeTab === 'launcher' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Downloadable macOS .command Launcher</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Save this executable script directly onto your Mac Pro Desktop. When double-clicked, it probes your host hardware, detects local Ollama/MLX servers on your Mac Pro, and launches the mock testbed in standalone app mode.
                </p>
              </div>

              <button
                onClick={handleDownloadLauncher}
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloadedLauncher ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Downloaded to ~/Downloads! Move to Desktop</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download SkyShadow-MacPro-Station.command</span>
                  </>
                )}
              </button>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                <div className="text-slate-500 mb-1"># Quick 1-time permission setup on your Mac Pro Terminal:</div>
                <div className="text-cyan-400">chmod +x ~/Desktop/SkyShadow-MacPro-Station.command</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Terminal 1-Liner */}
        {activeTab === 'curl' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Execute 1-Liner in macOS Terminal</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Open <span className="text-slate-200 font-mono">Terminal.app</span> or <span className="text-slate-200 font-mono">iTerm2</span> on your Mac Pro, paste this command, and press Enter:
                </p>
              </div>

              <div className="relative p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-400 break-all pr-12">
                <span>curl -sSL "{window.location.origin}/api/macpro/launcher.command" -o ~/Desktop/SkyShadow.command && chmod +x ~/Desktop/SkyShadow.command && open ~/Desktop/SkyShadow.command</span>
                <button
                  onClick={handleCopyCurl}
                  className="absolute right-2 top-2 p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  aria-label="Copy terminal command"
                >
                  {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {copiedScript && (
                <p className="text-xs text-emerald-400 font-medium">Copied command to clipboard!</p>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Air-Gapped Local Mock Runtime</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenEmailModal && (
              <button
                onClick={onOpenEmailModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold border border-cyan-800/80 transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Send Link to ref600@gmail.com</span>
              </button>
            )}
            {onOpenStationView && (
              <button
                onClick={() => {
                  onClose();
                  onOpenStationView();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-cyan-800/50 transition-all cursor-pointer"
              >
                <span>Open Mac Pro Station Testbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
