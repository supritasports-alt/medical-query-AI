import React, { useState } from "react";
import {
  ClinicalDocument,
  ClinicalTrialEvidence,
  HCPContext,
  MedInfoLetterOutput,
  ScientificReviewOutput,
} from "../types";
import {
  FileText,
  Search,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  AlertTriangle,
  User,
  Building,
  Bookmark,
  BookOpen,
  FileCheck,
  CheckCircle2,
  Terminal,
  Scale,
} from "lucide-react";

interface MedInfoLetterViewProps {
  documents: ClinicalDocument[];
  initialQuery?: string;
  initialHcpContext?: HCPContext;
  initialTrials?: ClinicalTrialEvidence[];
  initialScientificReview?: ScientificReviewOutput;
  onGenerateLetter: (
    queryText: string,
    hcpCtx?: HCPContext,
    trials?: ClinicalTrialEvidence[],
    review?: ScientificReviewOutput,
    docsText?: string
  ) => Promise<MedInfoLetterOutput>;
  onPassToQualityAssurance?: (
    draftLetter: string,
    queryText?: string,
    trials?: ClinicalTrialEvidence[]
  ) => void;
}

export const MedInfoLetterView: React.FC<MedInfoLetterViewProps> = ({
  documents,
  initialQuery = "",
  initialHcpContext = {
    specialty: "Oncology",
    country: "United States",
    channel: "MSL Inquiry",
    urgency: "Normal",
    physicianName: "Dr. Eleanor Vance",
    institution: "Johns Hopkins Hospital",
  },
  initialTrials,
  initialScientificReview,
  onGenerateLetter,
  onPassToQualityAssurance,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [hcpContext, setHcpContext] = useState<HCPContext>(initialHcpContext);
  const [activeTrials, setActiveTrials] = useState<ClinicalTrialEvidence[] | undefined>(
    initialTrials
  );
  const [activeReview] = useState<ScientificReviewOutput | undefined>(
    initialScientificReview
  );

  const [isLoading, setIsLoading] = useState(false);
  const [letterOutput, setLetterOutput] = useState<MedInfoLetterOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"formatted" | "markdown">("formatted");

  const handleExecuteGenerate = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const docsText = documents.map((d) => `[${d.title}]: ${d.content}`).join("\n\n");
      const res = await onGenerateLetter(
        query,
        hcpContext,
        activeTrials,
        activeReview,
        docsText
      );
      setLetterOutput(res);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to generate Medical Information Response Letter."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!letterOutput?.letter_markdown) return;
    navigator.clipboard.writeText(letterOutput.letter_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!letterOutput?.letter_markdown) return;
    const blob = new Blob([letterOutput.letter_markdown], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MSL_MedInfo_Response_${(hcpContext.physicianName || "HCP").replace(/\s+/g, "_")}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="medinfo-letter-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-lg shadow-inner">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Engine #4
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  MSL Medical Affairs Response
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Medical Information Response Generator
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Formal, Regulatory Compliant & Non-Promotional</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Generates a formal Medical Information Response Letter in standard MSL format (Executive Summary, Clinical Data Review, Scientific Interpretation, Limitations, Conclusion, and Clinical References). Strictly uses supplied evidence without promotional wording or fabricated citations.
        </p>
      </div>

      {/* Query & HCP Recipient Parameters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2 border-b border-slate-800">
          <div>
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Requesting Physician (HCP Name)</span>
            </label>
            <input
              type="text"
              value={hcpContext.physicianName || ""}
              onChange={(e) =>
                setHcpContext({ ...hcpContext, physicianName: e.target.value })
              }
              placeholder="e.g. Dr. Eleanor Vance, MD"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>Specialty & Institution</span>
            </label>
            <input
              type="text"
              value={hcpContext.institution || ""}
              onChange={(e) =>
                setHcpContext({ ...hcpContext, institution: e.target.value })
              }
              placeholder="e.g. Johns Hopkins Hospital"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
              <Bookmark className="w-3.5 h-3.5 text-purple-400" />
              <span>Inquiry Channel</span>
            </label>
            <select
              value={hcpContext.channel}
              onChange={(e) =>
                setHcpContext({
                  ...hcpContext,
                  channel: e.target.value as any,
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="MSL Inquiry">MSL Unsolicited Inquiry</option>
              <option value="Medical Information Call">Medical Information Call</option>
              <option value="Web Portal">HCP Web Portal</option>
              <option value="Unsolicited Request Form">Unsolicited Request Form</option>
              <option value="Congress / Symposium">Congress / Symposium</option>
            </select>
          </div>
        </div>

        {/* Inquiry Text */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Unsolicited Physician Inquiry Text</span>
          </label>
          <textarea
            id="medinfo-letter-textarea"
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter the unsolicited physician query (e.g., 'What is the overall survival benefit and safety profile of pembrolizumab in metastatic nonsquamous NSCLC from KEYNOTE-189?')..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans shadow-inner leading-relaxed"
          />
        </div>

        {/* Context Status Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {activeTrials && activeTrials.length > 0 ? (
              <span className="text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeTrials.length} Trial(s) Evidence Attached</span>
              </span>
            ) : (
              <span className="text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>No Specific Trial Attached (Will Search Repository)</span>
              </span>
            )}

            {activeReview && (
              <span className="text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Scientific Assessment Attached</span>
              </span>
            )}
          </div>

          <button
            id="generate-letter-button"
            onClick={handleExecuteGenerate}
            disabled={isLoading || !query.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg shadow disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Drafting MSL Letter...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                <span>Generate Medical Info Letter</span>
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
            onClick={handleExecuteGenerate}
            className="px-3 py-1 bg-rose-900 text-white text-xs font-bold rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* Generated Response Display */}
      {letterOutput && (
        <div id="medinfo-letter-output-section" className="space-y-6 animate-fadeIn">
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-300">View Mode:</span>
              <button
                onClick={() => setViewMode("formatted")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  viewMode === "formatted"
                    ? "bg-cyan-600 text-white shadow"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                Formatted MSL Letter
              </button>
              <button
                onClick={() => setViewMode("markdown")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  viewMode === "markdown"
                    ? "bg-cyan-600 text-white shadow"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                Raw Markdown
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export .md</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-cyan-900 hover:bg-cyan-800 text-cyan-200 text-xs font-semibold rounded-lg border border-cyan-700 flex items-center space-x-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>

              {onPassToQualityAssurance && letterOutput && (
                <button
                  onClick={() =>
                    onPassToQualityAssurance(
                      letterOutput.letter_markdown,
                      query,
                      activeTrials
                    )
                  }
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow flex items-center space-x-1.5 transition-all"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Pass to QA Audit Gatekeeper</span>
                </button>
              )}
            </div>
          </div>

          {viewMode === "formatted" ? (
            /* Rendered Document View */
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl space-y-8 text-slate-200 font-sans max-w-4xl mx-auto">
              {/* Formal Letterhead Header */}
              <div className="border-b-2 border-cyan-500/80 pb-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white uppercase">
                      Global Medical Affairs & Medical Information
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Medical Science Liaison Response System • Confidential Healthcare Response
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-400 space-y-0.5">
                    <p className="font-semibold text-slate-200">
                      Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p>Ref ID: MEDINFO-MSL-{Math.floor(100000 + Math.random() * 900000)}</p>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs space-y-1">
                  <p className="font-bold text-slate-100">
                    TO: {hcpContext.physicianName || "Healthcare Professional"}, MD
                  </p>
                  <p className="text-slate-300">
                    {hcpContext.specialty || "Medical Specialist"}, {hcpContext.institution || "Medical Institution"}
                  </p>
                  <p className="text-slate-400 pt-1 border-t border-slate-900 mt-1">
                    <strong className="text-cyan-400">SUBJECT:</strong> Medical Information Response to Unsolicited Clinical Inquiry: "{query}"
                  </p>
                </div>
              </div>

              {/* Required Sections Cards */}
              <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
                {/* 1. Executive Summary */}
                <section className="space-y-2">
                  <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wide border-b border-slate-800 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    1. Executive Summary
                  </h2>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                    <p>{letterOutput.sections.executive_summary}</p>
                  </div>
                </section>

                {/* 2. Clinical Data Review */}
                <section className="space-y-2">
                  <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wide border-b border-slate-800 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    2. Clinical Data Review
                  </h2>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-3">
                    <p className="whitespace-pre-line">{letterOutput.sections.clinical_data_review}</p>
                  </div>
                </section>

                {/* 3. Scientific Interpretation */}
                <section className="space-y-2">
                  <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wide border-b border-slate-800 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    3. Scientific Interpretation
                  </h2>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                    <p>{letterOutput.sections.scientific_interpretation}</p>
                  </div>
                </section>

                {/* 4. Limitations */}
                <section className="space-y-2">
                  <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wide border-b border-slate-800 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    4. Limitations
                  </h2>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                    <p>{letterOutput.sections.limitations}</p>
                  </div>
                </section>

                {/* 5. Conclusion */}
                <section className="space-y-2">
                  <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wide border-b border-slate-800 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    5. Conclusion
                  </h2>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                    <p>{letterOutput.sections.conclusion}</p>
                  </div>
                </section>

                {/* 6. Clinical References */}
                <section className="space-y-2">
                  <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wide border-b border-slate-800 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    6. Clinical References
                  </h2>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                    {letterOutput.sections.clinical_references &&
                    letterOutput.sections.clinical_references.length > 0 ? (
                      <ol className="list-decimal list-inside space-y-1.5 font-mono text-[11px] text-slate-300">
                        {letterOutput.sections.clinical_references.map((ref, idx) => (
                          <li key={idx} className="leading-normal">
                            {ref}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-slate-400 italic">No formal repository citations available.</p>
                    )}
                  </div>
                </section>
              </div>

              {/* MSL Regulatory Disclaimer Footer */}
              <div className="pt-6 border-t border-slate-800 space-y-2 text-[10px] text-slate-400 leading-relaxed">
                <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>REGULATORY COMPLIANCE & NON-PROMOTIONAL NOTICE</span>
                </div>
                <p>
                  {letterOutput._metadata?.msl_disclaimer ||
                    "This response has been prepared by Global Medical Affairs in response to an unsolicited request from a licensed Healthcare Professional. This document contains objective scientific data and is strictly non-promotional. It does not constitute medical advice or treatment recommendations."}
                </p>
              </div>
            </div>
          ) : (
            /* Raw Markdown Mode */
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Raw Medical Information Letter Markdown
                  </span>
                </div>
              </div>
              <pre className="p-5 bg-slate-950/90 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed max-h-[600px] whitespace-pre-wrap">
                {letterOutput.letter_markdown}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
