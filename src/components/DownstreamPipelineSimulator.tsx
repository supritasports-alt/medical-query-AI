import React, { useState } from "react";
import { AnalysisOutput } from "../types";
import {
  Send,
  Database,
  FileCheck,
  Bot,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface DownstreamPipelineSimulatorProps {
  result: AnalysisOutput;
  onPassToRetrievalEngine?: (queryText: string) => void;
}

export const DownstreamPipelineSimulator: React.FC<
  DownstreamPipelineSimulatorProps
> = ({ result, onPassToRetrievalEngine }) => {
  const [pipelineStatus, setPipelineStatus] = useState<
    "idle" | "dispatching" | "dispatched"
  >("idle");
  const [logMessages, setLogMessages] = useState<string[]>([]);


  const handleSimulateDispatch = () => {
    setPipelineStatus("dispatching");
    setLogMessages(["[0.0s] Initializing downstream payload dispatch..."]);

    setTimeout(() => {
      setLogMessages((prev) => [
        ...prev,
        `[0.4s] Validating JSON schema structure against Medical Affairs API specs...`,
      ]);
    }, 400);

    setTimeout(() => {
      setLogMessages((prev) => [
        ...prev,
        `[0.8s] Routing query to VEEVA Vault MedCOMM module (Category: ${result.query_category})...`,
      ]);
    }, 800);

    setTimeout(() => {
      setLogMessages((prev) => [
        ...prev,
        `[1.2s] Querying FDA/EMA Monograph Index for '${result.entities.drug_name}' & '${result.entities.disease}'...`,
      ]);
    }, 1200);

    setTimeout(() => {
      setLogMessages((prev) => [
        ...prev,
        `[1.6s] Dispatch complete! Downstream Retrieval Task ID: #MED-RET-${Math.floor(
          100000 + Math.random() * 900000
        )}`,
      ]);
      setPipelineStatus("dispatched");
    }, 1600);
  };

  return (
    <div id="downstream-pipeline-container" className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Downstream AI Pipeline Integration Simulator</span>
          </h3>
          <p className="text-xs text-slate-400">
            Simulate handing off this structured intake JSON to downstream Medical Information Retrieval & Drafting Agents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onPassToRetrievalEngine && (
            <button
              onClick={() =>
                onPassToRetrievalEngine(
                  `Retrieve clinical trial evidence, endpoints, efficacy, safety, and limitations for: ${result.query_summary}`
                )
              }
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-lg shadow flex items-center space-x-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Pass to Evidence Retrieval Engine</span>
            </button>
          )}

          <button
            id="dispatch-payload-button"
            onClick={handleSimulateDispatch}
            disabled={pipelineStatus === "dispatching"}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg shadow disabled:opacity-50 flex items-center space-x-1.5 shrink-0 transition-all border border-slate-700"
          >
            {pipelineStatus === "dispatching" ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Dispatching...</span>
              </>
            ) : pipelineStatus === "dispatched" ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>Payload Dispatched</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Simulate CRM Dispatch</span>
              </>
            )}
          </button>
        </div>
      </div>


      {/* Pipeline Modules Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Module 1: VEEVA Vault */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              1. VEEVA Vault MedCOMM
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-950 text-blue-300 rounded border border-blue-800">
              Retrieval
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Matches <strong className="text-slate-200">{result.entities.drug_name}</strong> and <strong className="text-slate-200">{result.query_category}</strong> against approved Standard Medical Letters (SMLs).
          </p>
        </div>

        {/* Module 2: Regulatory Label Cross-Checker */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              2. Label Cross-Checker
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
              FDA / EMA
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Verifies if <strong className="text-slate-200">{result.entities.indication}</strong> is on-label vs off-label under {result.entities.country} jurisdiction.
          </p>
        </div>

        {/* Module 3: MSL Drafting Agent */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-purple-400" />
              3. MSL Draft Response Agent
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800">
              Drafting
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Generates compliant response draft addressing missing items: <span className="text-amber-300">{result.missing_information.length} items flagged</span>.
          </p>
        </div>
      </div>

      {/* Log Console Output */}
      {logMessages.length > 0 && (
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] text-cyan-300 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-sans font-bold border-b border-slate-900 pb-1 mb-1">
            Pipeline Activity Stream Log
          </div>
          {logMessages.map((msg, i) => (
            <div key={i} className="flex items-center gap-2">
              <ArrowRight className="w-3 h-3 text-cyan-500 shrink-0" />
              <span>{msg}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
