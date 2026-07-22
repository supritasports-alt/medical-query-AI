import React, { useState } from "react";
import { ClinicalDocument, ClinicalTrialEvidence, ScientificReviewOutput } from "../types";
import {
  Microscope,
  Search,
  Scale,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Download,
  Terminal,
  Sparkles,
  FileText,
  Layers,
  CheckCircle2,
  FileCheck,
} from "lucide-react";

interface ScientificReviewViewProps {
  documents: ClinicalDocument[];
  initialQuery?: string;
  initialTrials?: ClinicalTrialEvidence[];
  onPerformReview: (
    queryText: string,
    trials?: ClinicalTrialEvidence[],
    docsText?: string
  ) => Promise<ScientificReviewOutput>;
  onPassToMedInfoLetter?: (
    query: string,
    trials?: ClinicalTrialEvidence[],
    review?: ScientificReviewOutput
  ) => void;
}

export const ScientificReviewView: React.FC<ScientificReviewViewProps> = ({
  documents,
  initialQuery = "",
  initialTrials,
  onPerformReview,
  onPassToMedInfoLetter,
}) => {

  const [reviewQuery, setReviewQuery] = useState(initialQuery);
  const [activeTrials, setActiveTrials] = useState<ClinicalTrialEvidence[] | undefined>(
    initialTrials
  );
  const [isLoading, setIsLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<ScientificReviewOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExecuteReview = async () => {
    if (!reviewQuery.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const docsText = documents.map((d) => `[${d.title}]: ${d.content}`).join("\n\n");
      const res = await onPerformReview(reviewQuery, activeTrials, docsText);
      setReviewResult(res);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to generate scientific medical review."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const jsonOutput = reviewResult
    ? {
        scientific_summary: reviewResult.scientific_summary,
        benefit_risk: reviewResult.benefit_risk,
        evidence_strength: reviewResult.evidence_strength,
        conflicting_data: reviewResult.conflicting_data,
        knowledge_gaps: reviewResult.knowledge_gaps,
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
    a.download = `scientific_medical_review_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="scientific-review-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-lg shadow-inner">
              <Microscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  Engine #3
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Objective Evidence Evaluation
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Scientific Medical Review AI
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Scientifically Neutral & Non-Promotional Mandate</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Evaluates retrieved clinical trial data to synthesize an objective scientific assessment, analyzing evidence strength, clinical relevance, study consistency, benefit-risk profile, conflicting data, and remaining knowledge gaps without treatment recommendations.
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-purple-400" />
            <span>Medical Topic / Clinical Inquiry for Evaluation</span>
          </label>
          {activeTrials && activeTrials.length > 0 && (
            <span className="text-[11px] text-cyan-400 font-medium bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
              Attached Evidence: {activeTrials.length} Trial Record(s)
            </span>
          )}
        </div>

        <textarea
          id="scientific-review-textarea"
          rows={3}
          value={reviewQuery}
          onChange={(e) => setReviewQuery(e.target.value)}
          placeholder="Enter the clinical topic to evaluate (e.g. 'Evaluate the overall survival benefit, renal safety, and consistency of pembrolizumab plus chemotherapy in metastatic nonsquamous NSCLC from KEYNOTE-189')..."
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans shadow-inner leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Assessing {documents.length} repository document(s) & extracted trials</span>
          </div>

          <button
            id="execute-review-button"
            onClick={handleExecuteReview}
            disabled={isLoading || !reviewQuery.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Evaluating Evidence...</span>
              </>
            ) : (
              <>
                <Microscope className="w-4 h-4" />
                <span>Generate Scientific Assessment</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={handleExecuteReview}
            className="px-3 py-1 bg-rose-900 text-white text-xs font-bold rounded"
          >
            Retry Review
          </button>
        </div>
      )}

      {/* Output Display */}
      {reviewResult && (
        <div id="scientific-review-results-section" className="space-y-6 animate-fadeIn">
          {/* Top Strength & Compliance Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-400">
                Overall Strength of Evidence:
              </span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  reviewResult.evidence_strength === "High"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : reviewResult.evidence_strength === "Moderate"
                    ? "bg-amber-950 text-amber-300 border-amber-800"
                    : "bg-rose-950 text-rose-300 border-rose-800"
                }`}
              >
                {reviewResult.evidence_strength}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {onPassToMedInfoLetter && (
                <button
                  onClick={() =>
                    onPassToMedInfoLetter(reviewQuery, activeTrials, reviewResult)
                  }
                  className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow flex items-center space-x-1.5 transition-all"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Pass to MSL MedInfo Letter AI</span>
                </button>
              )}

              <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compliant with Medical Affairs Directives</span>
              </div>
            </div>

          </div>

          {/* Core Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Scientific Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Scientific Summary & Consistency
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                {reviewResult.scientific_summary}
              </p>
            </div>

            {/* Benefit-Risk Discussion */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <Scale className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Benefit-Risk Assessment
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                {reviewResult.benefit_risk}
              </p>
            </div>
          </div>

          {/* Conflicting Data & Knowledge Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Conflicting Data */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Conflicting Data & Divergent Findings ({reviewResult.conflicting_data?.length || 0})
                </h3>
              </div>

              {reviewResult.conflicting_data && reviewResult.conflicting_data.length > 0 ? (
                <ul className="space-y-2 text-xs">
                  {reviewResult.conflicting_data.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-amber-950/20 border border-amber-900/60 rounded-lg text-amber-200/90 leading-relaxed flex items-start space-x-2"
                    >
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 text-xs">
                  No explicit conflicting trial endpoints or divergent findings identified in supplied evidence.
                </div>
              )}
            </div>

            {/* Knowledge Gaps */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Remaining Knowledge Gaps & Uncertainties ({reviewResult.knowledge_gaps?.length || 0})
                </h3>
              </div>

              {reviewResult.knowledge_gaps && reviewResult.knowledge_gaps.length > 0 ? (
                <ul className="space-y-2 text-xs">
                  {reviewResult.knowledge_gaps.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 leading-relaxed flex items-start space-x-2"
                    >
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 text-xs">
                  No major knowledge gaps identified.
                </div>
              )}
            </div>
          </div>

          {/* JSON Output Viewer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-purple-400" />
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
                      <span className="text-emerald-400 font-medium">Copied!</span>
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
                  className="px-2.5 py-1 bg-purple-900 hover:bg-purple-800 text-purple-200 text-xs rounded border border-purple-700 flex items-center space-x-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .json</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-slate-950/90 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed max-h-96">
              {jsonString}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
