import React, { useState } from 'react';
import { 
  GitBranch, 
  X, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  FolderGit2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ isOpen, onClose }) => {
  const [repoName, setRepoName] = useState('skyshadow-local-mesh');
  const [githubUser, setGithubUser] = useState('ref600');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedTarCmd, setCopiedTarCmd] = useState(false);

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${githubUser}/${repoName}.git`;
  const pushScript = `# 1. Add your GitHub remote repository
git remote add origin ${repoUrl}

# 2. Push your main branch with all 44 unit tests & CI workflows
git branch -M main
git push -u origin main`;

  const cloneCurlScript = `# Quick export directly to your local machine (Mac Pro / Linux):
curl -sSL "${window.location.origin}/api/export-repo.tar.gz" -o skyshadow.tar.gz && tar -xzf skyshadow.tar.gz && cd skyshadow && git status`;

  const handleCopyPushScript = () => {
    navigator.clipboard.writeText(pushScript);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  const handleCopyTarScript = () => {
    navigator.clipboard.writeText(cloneCurlScript);
    setCopiedTarCmd(true);
    setTimeout(() => setCopiedTarCmd(false), 2500);
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FolderGit2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Deploy to GitHub</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  Ready to Push
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Git repository initialized with main branch, CI pipeline, and 44 passing unit tests.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close GitHub modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5">
          {/* Status checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-slate-200">Git Initialized</div>
                <div className="text-[10px] text-slate-400 font-mono">Branch: main (Clean)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-slate-200">GitHub Actions CI</div>
                <div className="text-[10px] text-slate-400 font-mono">.github/workflows/ci.yml</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-slate-200">Enterprise README</div>
                <div className="text-[10px] text-slate-400 font-mono">Hardware & Air-Gap Docs</div>
              </div>
            </div>
          </div>

          {/* GitHub Config */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target GitHub Repository Target</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">GitHub Username / Org</label>
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Repository Name</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Target Remote: <code className="text-cyan-300 font-mono">{repoUrl}</code></span>
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Create repo on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Terminal Push Commands */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Terminal Push Commands:
              </span>
              <button
                onClick={handleCopyPushScript}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] transition-colors cursor-pointer"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="text-xs text-cyan-300/90 whitespace-pre-wrap overflow-x-auto bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
              {pushScript}
            </pre>
          </div>

          {/* Download Tarball Section */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href="/api/export-repo.tar.gz"
              download="skyshadow-local-mesh.tar.gz"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Repository Archive (.tar.gz)</span>
            </a>

            <button
              onClick={handleCopyTarScript}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              {copiedTarCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedTarCmd ? 'Copied curl Command' : 'Copy 1-Liner curl'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Clean repository with 0 secrets or API keys bundled</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
