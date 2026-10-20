import React, { useState, useEffect } from 'react';
import { NavTab } from './types/index.ts';
import { Navbar } from './components/Navbar.tsx';
import { MarketIntelligenceView } from './components/MarketIntelligenceView.tsx';
import { HardwareSizingView } from './components/HardwareSizingView.tsx';
import { LiveSwarmView } from './components/LiveSwarmView.tsx';
import { AgentStudioView } from './components/AgentStudioView.tsx';
import { DeploymentView } from './components/DeploymentView.tsx';
import { ValuationBusinessPlanView } from './components/ValuationBusinessPlanView.tsx';
import { AcademicMoatView } from './components/AcademicMoatView.tsx';
import { SovereignSkillStoreView } from './components/SovereignSkillStoreView.tsx';
import { ComplianceAuditView } from './components/ComplianceAuditView.tsx';
import { ClusterTopologyView } from './components/ClusterTopologyView.tsx';
import { KnowledgeCortexView } from './components/KnowledgeCortexView.tsx';
import { TcoCalculatorView } from './components/TcoCalculatorView.tsx';
import { AutonomousMissionControlView } from './components/AutonomousMissionControlView.tsx';
import { ModelZooBenchmarkView } from './components/ModelZooBenchmarkView.tsx';
import { MacProStationView } from './components/MacProStationView.tsx';
import { OsintReasoningView } from './components/OsintReasoningView.tsx';
import { MacProDesktopModal } from './components/MacProDesktopModal.tsx';
import { DeploymentEmailModal } from './components/DeploymentEmailModal.tsx';
import { GitHubDeployModal } from './components/GitHubDeployModal.tsx';
import { AiConsultantModal } from './components/AiConsultantModal.tsx';
import { PitchDeckModal } from './components/PitchDeckModal.tsx';
import { ProtocolInspectorModal } from './components/ProtocolInspectorModal.tsx';
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  CheckCircle2, 
  Terminal, 
  HardDrive,
  Activity
} from 'lucide-react';

const VALID_NAV_TABS: NavTab[] = [
  'market', 
  'valuation', 
  'academic-moat', 
  'tco-calculator',
  'mac-pro-station',
  'osint-reasoning',
  'hardware', 
  'mesh-topology',
  'knowledge-vault',
  'mission-control',
  'model-zoo',
  'swarm', 
  'studio', 
  'skill-store', 
  'compliance', 
  'deployment'
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as NavTab;
      if (tabParam && VALID_NAV_TABS.includes(tabParam)) {
        return tabParam;
      }
      if (params.get('autostart') === '1') {
        return 'swarm';
      }
    }
    return 'market';
  });
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isProtocolInspectorOpen, setIsProtocolInspectorOpen] = useState(false);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Parse URL query parameter (e.g. ?pitch=1 or ?desktop=1 or ?email=1 or ?github=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pitch') === '1') {
      setIsPitchDeckOpen(true);
    } else if (params.get('desktop') === '1') {
      setIsDesktopModalOpen(true);
    } else if (params.get('email') === '1' || params.get('send') === '1') {
      setIsEmailModalOpen(true);
    } else if (params.get('github') === '1' || params.get('git') === '1') {
      setIsGitHubModalOpen(true);
    }
  }, []);

  // Reset scroll to top on tab change and sync active tab with URL query parameter
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('tab') !== activeTab) {
        url.searchParams.set('tab', activeTab);
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      // Ignore in non-browser environments
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAiConsultant={() => setIsAiConsultantOpen(true)}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onOpenProtocolInspector={() => setIsProtocolInspectorOpen(true)}
        onOpenDesktopModal={() => setIsDesktopModalOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'market' && (
          <MarketIntelligenceView
            onGoToHardware={() => setActiveTab('hardware')}
            onGoToSwarm={() => setActiveTab('swarm')}
          />
        )}

        {activeTab === 'valuation' && <ValuationBusinessPlanView />}

        {activeTab === 'tco-calculator' && (
          <TcoCalculatorView
            onGoToHardware={() => setActiveTab('hardware')}
            onGoToDeployment={() => setActiveTab('deployment')}
          />
        )}

        {activeTab === 'mac-pro-station' && (
          <MacProStationView
            onGoToRunbooks={() => setActiveTab('mission-control')}
            onGoToModelZoo={() => setActiveTab('model-zoo')}
          />
        )}

        {activeTab === 'osint-reasoning' && <OsintReasoningView />}

        {activeTab === 'academic-moat' && <AcademicMoatView />}

        {activeTab === 'hardware' && (
          <HardwareSizingView
            onGoToSwarm={() => setActiveTab('swarm')}
            onGoToDeployment={() => setActiveTab('deployment')}
          />
        )}

        {activeTab === 'mesh-topology' && <ClusterTopologyView />}

        {activeTab === 'knowledge-vault' && <KnowledgeCortexView />}

        {activeTab === 'mission-control' && <AutonomousMissionControlView />}

        {activeTab === 'model-zoo' && <ModelZooBenchmarkView />}

        {activeTab === 'swarm' && <LiveSwarmView />}

        {activeTab === 'studio' && <AgentStudioView />}

        {activeTab === 'skill-store' && <SovereignSkillStoreView />}

        {activeTab === 'compliance' && <ComplianceAuditView />}

        {activeTab === 'deployment' && <DeploymentView />}
      </main>

      {/* Modals */}
      <MacProDesktopModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
        onOpenStationView={() => setActiveTab('mac-pro-station')}
        onOpenEmailModal={() => {
          setIsDesktopModalOpen(false);
          setIsEmailModalOpen(true);
        }}
      />

      <DeploymentEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultEmail="ref600@gmail.com"
        onOpenStationView={() => setActiveTab('mac-pro-station')}
      />

      <GitHubDeployModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      <AiConsultantModal
        isOpen={isAiConsultantOpen}
        onClose={() => setIsAiConsultantOpen(false)}
      />

      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

      <ProtocolInspectorModal
        isOpen={isProtocolInspectorOpen}
        onClose={() => setIsProtocolInspectorOpen(false)}
      />

      {/* Footer with SkyShadow branding and hardware status */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">
              SkyShadow Local-Mesh OS
            </span>
            <span>•</span>
            <a
              href="https://skyshadow.co.uk"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>skyshadow.co.uk</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Air-Gapped Zero Data Leakage
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Cpu className="w-3.5 h-3.5" /> Apple Silicon Metal UMA Native
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">
              Scalable: 1 Mac Mini to 100+ Enterprise Nodes
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
