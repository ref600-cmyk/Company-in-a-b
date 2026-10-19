import React, { useState } from 'react';
import { SOVEREIGN_SKILLS } from '../data/sovereignSkillsData.ts';
import type { SovereignSkillItem } from '../types/index.ts';
import { 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  Cpu, 
  Download, 
  Check, 
  CheckCircle2, 
  Lock, 
  Terminal, 
  Layers, 
  Plus, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const SovereignSkillStoreView: React.FC = () => {
  const [skills, setSkills] = useState<SovereignSkillItem[]>(() => {
    try {
      const saved = localStorage.getItem('skyshadow_installed_skills');
      if (saved) {
        const installedIds: string[] = JSON.parse(saved);
        return SOVEREIGN_SKILLS.map(s => ({
          ...s,
          installed: installedIds.includes(s.id)
        }));
      }
      return SOVEREIGN_SKILLS;
    } catch {
      return SOVEREIGN_SKILLS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<SovereignSkillItem | null>(null);

  const categories = ['all', 'Enterprise ERP', 'Healthcare', 'Defense & ITAR', 'Software Engineering', 'Legal & Compliance', 'Speech & Audio'];

  const filteredSkills = skills.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleInstall = (skillId: string) => {
    setSkills(prev => {
      const next = prev.map(s => s.id === skillId ? { ...s, installed: !s.installed } : s);
      const installedIds = next.filter(s => s.installed).map(s => s.id);
      localStorage.setItem('skyshadow_installed_skills', JSON.stringify(installedIds));
      return next;
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>THE SOVEREIGN AGENT & SKILL STORE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              The "App Store" of Verified Air-Gapped Intelligence
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Browse pre-compiled offline skills and autonomous agents cryptographically signed for the <strong>Sovereign AI Mesh Protocol (SAMP)</strong>.
              Every skill runs inside micro-VM sandboxes on physical Apple Silicon memory with zero cloud telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Installed on Mesh</span>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                {skills.filter(s => s.installed).length} / {skills.length}
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">100% Air-Gap Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Skills' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills, tags, models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              skill.installed
                ? 'border-cyan-500/40 bg-cyan-950/15 shadow-lg shadow-cyan-950/30'
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  {skill.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Air-Gap Certified
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {skill.description}
                </p>
              </div>

              {/* Capabilities */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Autonomous Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skill.capabilities.map((cap, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Permission Boundary */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400">
                <strong className="text-cyan-400">Boundary:</strong> {skill.permissionBoundary}
              </div>
            </div>

            {/* Bottom Install Button & Memory Specs */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-slate-400">
                RAM: <strong className="text-white">{skill.requiredMemoryMB} MB</strong>
              </span>

              <button
                onClick={() => toggleInstall(skill.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  skill.installed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                }`}
              >
                {skill.installed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Active on Mesh</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Install to Mac Mini</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
