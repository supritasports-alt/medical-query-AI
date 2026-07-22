import React, { useState } from "react";
import { ClinicalDocument, ClinicalTrialEvidence, RetrievalEngineOutput } from "../types";
import {
  FileSearch,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldAlert,
  FileText,
  Filter,
  Sparkles,
  ChevronRight,
  Database,
  Microscope,
} from "lucide-react";

interface EvidenceRetrievalViewProps {
  documents: ClinicalDocument[];
  initialQuery?: string;
  onRetrieveEvidence: (
    query: string,
    selectedDocs: ClinicalDocument[]
  ) => Promise<RetrievalEngineOutput>;
  onPassToScientificReview?: (query: string, trials: ClinicalTrialEvidence[]) => void;
}

export const EvidenceRetrievalView: React.FC<EvidenceRetrievalViewProps> = ({
  documents,
  initialQuery = "",
  onRetrieveEvidence,
  onPassToScientificReview,
}) => {

  const [retrievalQuery, setRetrievalQuery] = useState(initialQuery);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(
    documents.map((d) => d.id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RetrievalEngineOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleDocSelection = (id: string) => {
    if (selectedDocIds.includes(id)) {
      if (selectedDocIds.length === 1) return; // Keep at least 1 document
      setSelectedDocIds(selectedDocIds.filter((dId) => dId !== id));
    } else {
      setSelectedDocIds([...selectedDocIds, id]);
    }
  };

  const selectAllDocs = () => {
    setSelectedDocIds(documents.map((d) => d.id));
  };

  const handleExecuteSearch = async () => {
    if (!retrievalQuery.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    const activeDocs = documents.filter((d) => selectedDocIds.includes(d.id));

    try {
      const res = await onRetrieveEvidence(retrievalQuery, activeDocs);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to search clinical evidence repository."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Standard JSON payload for display
  const jsonOutput = result
    ? result.evidence_found
      ? {
          evidence_found: true,
          clinical_trials: result.clinical_trials,
        }
      : {
          evidence_found: false,
          message:
            result.message ||
            "The current clinical data repository does not contain sufficient evidence to answer this query.",
          clinical_trials: [],
        }
    : null;

  const jsonString = jsonOutput ? JSON.stringify(jsonOutput, null, 2) : "";

  const handleCopyJson = () => {
    if (!jsonString) return;
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!jsonString) return;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clinical_evidence_retrieval_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="evidence-retrieval-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-lg shadow-inner">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Engine #2
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Strict Grounded RAG Mode
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Clinical Evidence Retrieval Engine
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Zero External Hallucination Guarantee</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          This engine searches strictly within the supplied clinical document repository to extract exact trial design, endpoints, efficacy, safety, and limitations. If evidence is absent, it returns the standard ungrounded warning message.
        </p>
      </div>

      {/* Query & Document Scope Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Query Input Box */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Target Clinical Medical Query</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {retrievalQuery.length} characters
            </span>
          </div>

          <textarea
            id="retrieval-query-textarea"
            rows={4}
            value={retrievalQuery}
            onChange={(e) => setRetrievalQuery(e.target.value)}
            placeholder="Type or paste the target medical question to retrieve evidence for (e.g., 'What is the overall survival benefit and renal impairment safety profile of pembrolizumab plus pemetrexed in metastatic NSCLC from KEYNOTE-189?')..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans shadow-inner leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Grounded Extraction with Gemini 3.6 Flash</span>
            </span>

            <button
              id="execute-retrieval-button"
              onClick={handleExecuteSearch}
              disabled={isLoading || !retrievalQuery.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-lg shadow disabled:opacity-50 flex items-center space-x-2 transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching Documents...</span>
                </>
              ) : (
                <>
                  <FileSearch className="w-4 h-4" />
                  <span>Retrieve Evidence</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Repository Scope Filter */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Active Search Repository ({selectedDocIds.length}/{documents.length})</span>
            </span>
            <button
              onClick={selectAllDocs}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Select All
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {documents.map((doc) => {
              const isSelected = selectedDocIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDocSelection(doc.id)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start space-x-2 ${
                    isSelected
                      ? "bg-slate-950 border-cyan-800 text-slate-100"
                      : "bg-slate-950/40 border-slate-900 text-slate-500 opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-700 text-cyan-600 focus:ring-0"
                  />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="font-semibold truncate text-[11px]">
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {doc.type} • {doc.therapeuticArea}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={handleExecuteSearch}
            className="px-3 py-1 bg-rose-900 text-white text-xs font-bold rounded"
          >
            Retry Search
          </button>
        </div>
      )}

      {/* Output Results */}
      {result && (
        <div id="retrieval-results-section" className="space-y-6 animate-fadeIn">
          {/* Status Alert Banner */}
          {result.evidence_found ? (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-900/80 text-emerald-300 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">
                    Clinical Trial Evidence Retrieved Successfully
                  </h3>
                  <p className="text-xs text-emerald-300/80 mt-0.5">
                    Found {result.clinical_trials.length} matching trial record(s) in supplied clinical repository.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {onPassToScientificReview && (
                  <button
                    onClick={() =>
                      onPassToScientificReview(retrievalQuery, result.clinical_trials)
                    }
                    className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow flex items-center space-x-1.5 transition-all"
                  >
                    <Microscope className="w-3.5 h-3.5" />
                    <span>Pass to Scientific Review AI</span>
                  </button>
                )}

                <span className="px-3 py-1 bg-emerald-900 text-emerald-200 text-xs font-bold rounded-full border border-emerald-700">
                  evidence_found: true
                </span>
              </div>
            </div>
          ) : (

            <div className="p-5 bg-amber-950/50 border-2 border-amber-800/90 rounded-xl text-amber-200 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-900/80 text-amber-300 rounded-lg">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-900 text-amber-200 text-xs font-bold rounded border border-amber-700">
                    evidence_found: false
                  </span>
                  <h3 className="text-base font-bold text-amber-100 mt-1">
                    No Matching Evidence Found in Supplied Repository
                  </h3>
                </div>
              </div>
              <p className="text-sm font-mono bg-slate-950 p-3 rounded-lg border border-amber-900/80 text-amber-300">
                "{jsonOutput?.message}"
              </p>
            </div>
          )}

          {/* Extracted Clinical Trial Cards */}
          {result.evidence_found && result.clinical_trials.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Extracted Clinical Trial Evidence Matrix</span>
              </h3>

              <div className="space-y-5">
                {result.clinical_trials.map((trial, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                          {trial.phase || "Clinical Trial"}
                        </span>
                        <h4 className="text-lg font-bold text-slate-100 mt-1">
                          {trial.study_name}
                        </h4>
                      </div>
                      <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1 rounded border border-slate-800">
                        {trial.source_section}
                      </span>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-slate-400 font-medium block">
                          Population Studied:
                        </span>
                        <span className="text-slate-200 font-semibold">
                          {trial.population}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">
                          Sample Size:
                        </span>
                        <span className="text-cyan-300 font-mono font-bold">
                          {trial.sample_size}
                        </span>
                      </div>
                    </div>

                    {/* Results & Safety Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Efficacy */}
                      <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-1.5">
                        <span className="font-semibold text-emerald-400 block border-b border-slate-900 pb-1">
                          Primary Endpoints & Key Efficacy Outcomes:
                        </span>
                        <div className="text-slate-300 space-y-1 leading-relaxed">
                          <p>
                            <strong className="text-slate-200">
                              Endpoints:
                            </strong>{" "}
                            {trial.endpoint}
                          </p>
                          <p>
                            <strong className="text-slate-200">Efficacy:</strong>{" "}
                            {trial.results}
                          </p>
                        </div>
                      </div>

                      {/* Safety */}
                      <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-1.5">
                        <span className="font-semibold text-rose-400 block border-b border-slate-900 pb-1">
                          Safety Profile & Adverse Events:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {trial.safety}
                        </p>
                      </div>
                    </div>

                    {/* Limitations */}
                    <div className="p-3 bg-amber-950/20 border border-amber-900/60 rounded-lg text-xs space-y-1">
                      <span className="font-semibold text-amber-300 block">
                        Study Limitations & Caveats:
                      </span>
                      <p className="text-amber-200/90 leading-relaxed">
                        {trial.limitations}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strict JSON Output Code Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Exact Output JSON (Required Format)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 flex items-center space-x-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">
                        Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs rounded border border-blue-700 flex items-center space-x-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .json</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-slate-950/90 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed max-h-96">
              {jsonString}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
