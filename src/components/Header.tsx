import React from "react";
import { Stethoscope, ShieldCheck, Cpu, Database, FileText, Microscope, FileCheck, Scale } from "lucide-react";

interface HeaderProps {
  processedCount: number;
  activeTab: "single" | "retrieval" | "review" | "letter" | "qa" | "repository" | "batch" | "history";
  setActiveTab: (tab: "single" | "retrieval" | "review" | "letter" | "qa" | "repository" | "batch" | "history") => void;
}

export const Header: React.FC<HeaderProps> = ({
  processedCount,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header id="app-header" className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-2 md:h-16 gap-2">
          {/* Left Branding */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-lg shadow-inner flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  GenAI Pioneer
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Medical Affairs Intelligence
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
                Clinical Evidence & Query Suite
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap items-center justify-center space-x-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <button
              id="tab-single-query"
              onClick={() => setActiveTab("single")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "single"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>1. Query Intake AI</span>
            </button>

            <button
              id="tab-evidence-retrieval"
              onClick={() => setActiveTab("retrieval")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "retrieval"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>2. Evidence Retrieval</span>
            </button>

            <button
              id="tab-scientific-review"
              onClick={() => setActiveTab("review")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "review"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>3. Scientific Review</span>
            </button>

            <button
              id="tab-medinfo-letter"
              onClick={() => setActiveTab("letter")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "letter"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>4. MSL MedInfo Letter</span>
            </button>

            <button
              id="tab-qa-audit"
              onClick={() => setActiveTab("qa")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "qa"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>5. Quality Assurance AI</span>
            </button>

            <button
              id="tab-clinical-repository"
              onClick={() => setActiveTab("repository")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "repository"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Repository</span>
            </button>

            <button
              id="tab-batch-intake"
              onClick={() => setActiveTab("batch")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "batch"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>Batch Intake</span>
            </button>

            <button
              id="tab-audit-history"
              onClick={() => setActiveTab("history")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === "history"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>Audit Log</span>
              {processedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-blue-900 text-blue-200 text-[10px] rounded-full font-bold">
                  {processedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Status Badge */}
          <div className="hidden xl:flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">5 AI Engines Active</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Grounded & Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};




