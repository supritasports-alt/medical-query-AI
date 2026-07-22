import React, { useState } from "react";
import {
  ClinicalDocument,
  ClinicalTrialEvidence,
  MedInfoLetterOutput,
  QualityAssuranceOutput,
} from "../types";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Terminal,
  FileCheck,
  RefreshCw,
  Search,
  Sparkles,
  FileText,
  Scale,
} from "lucide-react";

interface QualityAssuranceViewProps {
  documents: ClinicalDocument[];
  initialDraftLetter?: string;
  initialQuery?: string;
  initialTrials?: ClinicalTrialEvidence[];
  onAuditQA: (
    draftLetter: string,
    queryText?: string,
    trials?: ClinicalTrialEvidence[],
    docsText?: string
  ) => Promise<QualityAssuranceOutput>;
}

export const QualityAssuranceView: React.FC<QualityAssuranceViewProps> = ({
  documents,
  initialDraftLetter = "",
  initialQuery = "",
  initialTrials,
  onAuditQA,
}) => {
  const [draftLetter, setDraftLetter] = useState(
    initialDraftLetter ||
      `# MEDICAL INFORMATION RESPONSE LETTER

**Date:** July 22, 2026
**To:** Dr. Eleanor Vance, MD (Oncology, Johns Hopkins Hospital)
**Re:** Clinical Inquiry Regarding Pembrolizumab in Metastatic NSCLC

## 1. Executive Summary
This response provides objective clinical evidence regarding pembrolizumab in combination with pemetrexed and platinum chemotherapy in patients with previously untreated metastatic nonsquamous non-small-cell lung cancer (NSCLC), based on findings from the phase 3 KEYNOTE-189 clinical trial.

## 2. Clinical Data Review
In the double-blind, phase 3 KEYNOTE-189 study (N = 616), patients with metastatic nonsquamous NSCLC without EGFR or ALK alterations were randomized 2:1 to receive pembrolizumab plus chemotherapy or placebo plus chemotherapy.
- Overall Survival (OS): At a median follow-up of 23.1 months, hazard ratio (HR) for OS was 0.56 (95% CI, 0.45 to 0.70; p < 0.00001). Median OS was 22.0 months in the pembrolizumab combination arm versus 10.7 months in the placebo combination arm.
- Safety: Grade 3 to 5 adverse events occurred in 72.1% of patients receiving pembrolizumab combination vs 66.8% in placebo arm. Immune-mediated adverse events occurred in 28.6% vs 10.9%.

## 3. Scientific Interpretation
The randomized phase 3 data demonstrate a statistically significant and clinically meaningful overall survival advantage when adding pembrolizumab to standard pemetrexed-platinum chemotherapy in first-line metastatic nonsquamous NSCLC.

## 4. Limitations
Trial excluded patients with active brain metastases requiring steroids or autoimmune diseases. Results may not apply to unstudied patient subgroups.

## 5. Conclusion
The current clinical evidence supports overall survival efficacy for first-line pembrolizumab combination therapy in metastatic nonsquamous NSCLC.

## 6. Clinical References
1. Gandhi L, Rodríguez-Abreu D, Gadgeel S, et al. Pembrolizumab plus Chemotherapy in Metastatic Non-Small-Cell Lung Cancer. N Engl J Med. 2018;378(22):2078-2092.`
  );

  const [query, setQuery] = useState(initialQuery || "What is the overall survival benefit and safety profile of pembrolizumab in metastatic nonsquamous NSCLC from KEYNOTE-189?");
  const [activeTrials] = useState<ClinicalTrialEvidence[] | undefined>(initialTrials);

  const [isLoading, setIsLoading] = useState(false);
  const [qaOutput, setQaOutput] = useState<QualityAssuranceOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "json">("summary");

  const handleExecuteQA = async () => {
    if (!draftLetter.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const docsText = documents.map((d) => `[${d.title}]: ${d.content}`).join("\n\n");
      const res = await onAuditQA(draftLetter, query, activeTrials, docsText);
      setQaOutput(res);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to execute Quality Assurance audit."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCorrected = () => {
    if (!qaOutput?.corrected_response) return;
    navigator.clipboard.writeText(qaOutput.corrected_response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checklistItems = [
    { key: "no_hallucinations", label: "No Hallucinated Information", desc: "Data strictly derived from supplied trial repository" },
    { key: "unsupported_claims_free", label: "No Unsupported Claims", desc: "Zero extrapolations or off-label unverified claims" },
    { key: "scientifically_neutral", label: "Scientific Neutrality Maintained", desc: "Balanced, non-prescriptive, objective medical tone" },
    { key: "no_promotional_wording", label: "No Promotional Wording", desc: "Free of commercial slogans, superlatives, or bias" },
    { key: "references_valid", label: "References Correctly Cited", desc: "Verified trial monographs without fabricated DOIs/authors" },
    { key: "grammar_and_formatting", label: "Grammar & Formatting Standards", desc: "Formal medical writing style and clean Markdown layout" },
    { key: "terminology_consistent", label: "Medical Terminology Consistency", desc: "Standardized disease states, dosing, and endpoint acronyms" },
    { key: "sections_complete", label: "Required Sections Complete", desc: "Includes all 6 mandatory Medical Info letter sections" },
    { key: "medinfo_standards_compliant", label: "Medical Information Standards", desc: "Compliant with MSL global regulatory requirements" },
  ];

  return (
    <div id="qa-engine-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-lg shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Engine #5
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Regulatory & Compliance Gatekeeper
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Medical Affairs Quality Assurance AI
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Final Regulatory & Scientific Quality Gatekeeper</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Executes strict final regulatory and scientific verification before release. Audits responses for zero hallucinations, zero promotional wording, strict scientific neutrality, verified references, and complete standard Medical Information sections.
        </p>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              Draft Response / Medical Information Letter to Audit
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Provide draft Markdown text or MSL response
            </span>
          </label>
          <textarea
            id="qa-draft-textarea"
            rows={8}
            value={draftLetter}
            onChange={(e) => setDraftLetter(e.target.value)}
            placeholder="Paste or edit the draft Medical Information Response Letter here..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-slate-100 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            Original Unsolicited Physician Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Original physician inquiry..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Execute Button Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Ready for 9-Point Regulatory Audit</span>
          </div>

          <button
            id="execute-qa-button"
            onClick={handleExecuteQA}
            disabled={isLoading || !draftLetter.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-lg shadow disabled:opacity-50 flex items-center space-x-2 transition-all shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Auditing Compliance & Quality...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Run Quality Assurance Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={handleExecuteQA}
            className="px-3 py-1 bg-rose-900 text-white text-xs font-bold rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* QA Audit Output Section */}
      {qaOutput && (
        <div id="qa-output-section" className="space-y-6 animate-fadeIn">
          {/* Top Result Banner */}
          <div
            className={`p-6 rounded-xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              qaOutput.approval_status === "Approved"
                ? "bg-slate-900 border-emerald-500/50"
                : "bg-slate-900 border-amber-500/50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`p-3.5 rounded-full ${
                  qaOutput.approval_status === "Approved"
                    ? "bg-emerald-950 border border-emerald-700 text-emerald-400"
                    : "bg-amber-950 border border-amber-700 text-amber-400"
                }`}
              >
                {qaOutput.approval_status === "Approved" ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <AlertTriangle className="w-8 h-8" />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                      qaOutput.approval_status === "Approved"
                        ? "bg-emerald-900/80 text-emerald-300 border border-emerald-700"
                        : "bg-amber-900/80 text-amber-300 border border-amber-700"
                    }`}
                  >
                    Status: {qaOutput.approval_status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Audit Score: {qaOutput.compliance_score}/100
                  </span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {qaOutput.approval_status === "Approved"
                    ? "APPROVED FOR MEDICAL INFORMATION RESPONSE"
                    : "REVISION REQUIRED BEFORE RELEASE"}
                </h3>
              </div>
            </div>

            {/* Score Metric Card */}
            <div className="flex items-center space-x-4 bg-slate-950 px-5 py-3 rounded-xl border border-slate-800 shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Compliance
                </span>
                <span
                  className={`text-2xl font-black ${
                    qaOutput.compliance_score >= 90
                      ? "text-emerald-400"
                      : qaOutput.compliance_score >= 70
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {qaOutput.compliance_score}%
                </span>
              </div>
              <div className="w-20 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    qaOutput.compliance_score >= 90
                      ? "bg-emerald-500"
                      : qaOutput.compliance_score >= 70
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${qaOutput.compliance_score}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Audit Navigation Tabs */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2 px-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "summary"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Compliance Checklist & Findings
              </button>
              <button
                onClick={() => setActiveTab("json")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "json"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Raw JSON Schema Output
              </button>
            </div>

            {qaOutput.corrected_response && (
              <button
                onClick={handleCopyCorrected}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied Output</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Final Response</span>
                  </>
                )}
              </button>
            )}
          </div>

          {activeTab === "summary" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 9-Point Checklist Grid */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Validation Checklist
                  </h3>
                  <span className="text-[11px] text-slate-400">9 Regulatory Directives</span>
                </div>

                <div className="space-y-2.5">
                  {checklistItems.map((item) => {
                    const isPassed = qaOutput.checklist
                      ? (qaOutput.checklist as any)[item.key] !== false
                      : qaOutput.approval_status === "Approved";

                    return (
                      <div
                        key={item.key}
                        className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-200">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                        <div className="shrink-0 mt-0.5">
                          {isPassed ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              VERIFIED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                              <XCircle className="w-3.5 h-3.5" />
                              DEFECT
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Issues Identified & Corrected Response Output */}
              <div className="space-y-6">
                {/* Identified Issues Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                  <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Detected Quality & Compliance Issues
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {qaOutput.issues.length} Issue(s)
                    </span>
                  </div>

                  {qaOutput.issues.length === 0 ? (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-900/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Zero issues detected. Response is fully compliant with all Medical Affairs directives.
                      </span>
                    </div>
                  ) : (
                    <ul className="space-y-2 text-xs">
                      {qaOutput.issues.map((issue, idx) => (
                        <li
                          key={idx}
                          className="p-3 bg-amber-950/50 border border-amber-900/60 rounded-lg text-amber-200 flex items-start space-x-2"
                        >
                          <span className="font-bold text-amber-400">{idx + 1}.</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Final Verified Output Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                  <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      Verified Response Status / Corrected Version
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      APPROVED FOR RELEASE
                    </span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-sans text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {qaOutput.corrected_response}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* JSON View */
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Engine #5 Output JSON
                  </span>
                </div>
              </div>
              <pre className="p-5 bg-slate-950/90 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed max-h-[500px]">
                {JSON.stringify(qaOutput, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
