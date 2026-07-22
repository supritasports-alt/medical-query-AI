import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ComplianceNotice } from "./components/ComplianceNotice";
import { QueryInputSection } from "./components/QueryInputSection";
import { EntityGrid } from "./components/EntityGrid";
import { MissingInfoAlert } from "./components/MissingInfoAlert";
import { JsonPayloadViewer } from "./components/JsonPayloadViewer";
import { DownstreamPipelineSimulator } from "./components/DownstreamPipelineSimulator";
import { BatchIntakeView } from "./components/BatchIntakeView";
import { AuditHistoryView } from "./components/AuditHistoryView";
import { EvidenceRetrievalView } from "./components/EvidenceRetrievalView";
import { ScientificReviewView } from "./components/ScientificReviewView";
import { MedInfoLetterView } from "./components/MedInfoLetterView";
import { QualityAssuranceView } from "./components/QualityAssuranceView";
import { DocumentRepositoryView } from "./components/DocumentRepositoryView";
import {
  AnalysisOutput,
  ClinicalDocument,
  ClinicalTrialEvidence,
  HCPContext,
  MedInfoLetterOutput,
  QualityAssuranceOutput,
  RetrievalEngineOutput,
  SampleQueryPreset,
  SavedQueryRecord,
  ScientificReviewOutput,
} from "./types";

import { SAMPLE_QUERIES } from "./data/sampleQueries";
import { SAMPLE_CLINICAL_DOCUMENTS } from "./data/clinicalRepository";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";


export default function App() {
  const [activeTab, setActiveTab] = useState<
    "single" | "retrieval" | "review" | "letter" | "qa" | "repository" | "batch" | "history"
  >("single");

  // Clinical Documents Repository State

  const [documents, setDocuments] = useState<ClinicalDocument[]>(() => {
    try {
      const saved = localStorage.getItem("med_clinical_documents");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_CLINICAL_DOCUMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("med_clinical_documents", JSON.stringify(documents));
    } catch (e) {
      console.error("Failed to persist clinical documents", e);
    }
  }, [documents]);

  const handleAddDocument = (newDoc: ClinicalDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Query & HCP Context State
  const [query, setQuery] = useState("");
  const [hcpContext, setHcpContext] = useState<HCPContext>({
    specialty: "Medical Oncology",
    country: "United States",
    channel: "MSL Inquiry",
    urgency: "Normal",
  });

  // Pre-fill query for Retrieval Engine, Scientific Review & MedInfo Letter
  const [retrievalInitialQuery, setRetrievalInitialQuery] = useState("");
  const [reviewInitialQuery, setReviewInitialQuery] = useState("");
  const [reviewInitialTrials, setReviewInitialTrials] = useState<
    ClinicalTrialEvidence[] | undefined
  >(undefined);

  const [letterInitialQuery, setLetterInitialQuery] = useState("");
  const [letterInitialTrials, setLetterInitialTrials] = useState<
    ClinicalTrialEvidence[] | undefined
  >(undefined);
  const [letterInitialReview, setLetterInitialReview] = useState<
    ScientificReviewOutput | undefined
  >(undefined);

  const [qaInitialDraftLetter, setQaInitialDraftLetter] = useState("");
  const [qaInitialQuery, setQaInitialQuery] = useState("");
  const [qaInitialTrials, setQaInitialTrials] = useState<
    ClinicalTrialEvidence[] | undefined
  >(undefined);



  // Result & Processing State
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisOutput | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History Log State
  const [auditRecords, setAuditRecords] = useState<SavedQueryRecord[]>(() => {
    try {
      const saved = localStorage.getItem("med_query_audit_records");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "med_query_audit_records",
        JSON.stringify(auditRecords)
      );
    } catch (e) {
      console.error("Failed to persist audit log", e);
    }
  }, [auditRecords]);

  // Load sample query preset
  const handleSelectPreset = (preset: SampleQueryPreset) => {
    setQuery(preset.queryText);
    setHcpContext({
      specialty: preset.specialty,
      country: preset.country,
      channel: "Unsolicited Request Form",
      urgency: preset.urgency,
      physicianName: preset.hcpName,
    });
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  // Execute primary backend call for Engine #1 (Intake Analysis)
  const handleAnalyzeQuery = async (
    queryToAnalyze: string,
    contextToAnalyze: HCPContext
  ): Promise<AnalysisOutput> => {
    const res = await fetch("/api/analyze-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: queryToAnalyze,
        hcpContext: contextToAnalyze,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error (${res.status})`);
    }

    const data: AnalysisOutput = await res.json();
    return data;
  };

  // Execute primary backend call for Engine #2 (Evidence Retrieval)
  const handleRetrieveEvidence = async (
    queryText: string,
    selectedDocs: ClinicalDocument[]
  ): Promise<RetrievalEngineOutput> => {
    const res = await fetch("/api/retrieve-evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: queryText,
        documents: selectedDocs,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error (${res.status})`);
    }

    const data: RetrievalEngineOutput = await res.json();
    return data;
  };

  // Execute primary backend call for Engine #3 (Scientific Medical Review)
  const handlePerformScientificReview = async (
    queryText: string,
    trials?: ClinicalTrialEvidence[],
    docsText?: string
  ): Promise<ScientificReviewOutput> => {
    const res = await fetch("/api/scientific-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: queryText,
        clinical_trials: trials,
        documentsText: docsText,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error (${res.status})`);
    }

    const data: ScientificReviewOutput = await res.json();
    return data;
  };

  // Execute primary backend call for Engine #4 (Medical Information Response Generator)
  const handleGenerateMedInfoLetter = async (
    queryText: string,
    hcpCtx?: HCPContext,
    trials?: ClinicalTrialEvidence[],
    review?: ScientificReviewOutput,
    docsText?: string
  ): Promise<MedInfoLetterOutput> => {
    const res = await fetch("/api/generate-medinfo-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: queryText,
        hcpContext: hcpCtx || hcpContext,
        clinical_trials: trials,
        scientific_review: review,
        documentsText: docsText,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error (${res.status})`);
    }

    const data: MedInfoLetterOutput = await res.json();
    return data;
  };

  // Execute primary backend call for Engine #5 (Medical Affairs Quality Assurance AI)
  const handlePerformQualityAssurance = async (
    draftLetter: string,
    queryText?: string,
    trials?: ClinicalTrialEvidence[],
    docsText?: string
  ): Promise<QualityAssuranceOutput> => {
    const res = await fetch("/api/quality-assurance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draft_letter: draftLetter,
        query: queryText || query,
        clinical_trials: trials,
        documentsText: docsText,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error (${res.status})`);
    }

    const data: QualityAssuranceOutput = await res.json();
    return data;
  };

  const handleSubmitSingleQuery = async () => {


    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await handleAnalyzeQuery(query, hcpContext);
      setAnalysisResult(result);

      // Save to audit history
      const newRecord: SavedQueryRecord = {
        id: `rec-${Date.now()}`,
        timestamp: new Date().toISOString(),
        rawQuery: query,
        hcpContext: { ...hcpContext },
        result,
      };

      setAuditRecords((prev) => [newRecord, ...prev]);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to analyze physician query.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassToRetrievalEngine = (queryText: string) => {
    setRetrievalInitialQuery(queryText);
    setActiveTab("retrieval");
  };

  const handlePassToScientificReview = (
    queryText: string,
    trials: ClinicalTrialEvidence[]
  ) => {
    setReviewInitialQuery(queryText);
    setReviewInitialTrials(trials);
    setActiveTab("review");
  };

  const handlePassToMedInfoLetter = (
    queryText: string,
    trials?: ClinicalTrialEvidence[],
    review?: ScientificReviewOutput
  ) => {
    setLetterInitialQuery(queryText);
    setLetterInitialTrials(trials);
    setLetterInitialReview(review);
    setActiveTab("letter");
  };

  const handlePassToQualityAssurance = (
    draftLetter: string,
    queryText?: string,
    trials?: ClinicalTrialEvidence[]
  ) => {
    setQaInitialDraftLetter(draftLetter);
    if (queryText) setQaInitialQuery(queryText);
    if (trials) setQaInitialTrials(trials);
    setActiveTab("qa");
  };



  const handleAddSaveRecordFromBatch = (
    rawQ: string,
    ctx: HCPContext,
    res: AnalysisOutput
  ) => {
    const newRec: SavedQueryRecord = {
      id: `rec-batch-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      rawQuery: rawQ,
      hcpContext: ctx,
      result: res,
    };
    setAuditRecords((prev) => [newRec, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-16 selection:bg-cyan-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        processedCount={auditRecords.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Compliance Banner */}
        <ComplianceNotice />

        {/* Tab 1: Single Query Intake & Intelligence */}
        {activeTab === "single" && (
          <div className="space-y-6">
            {/* Input Form */}
            <QueryInputSection
              query={query}
              setQuery={setQuery}
              hcpContext={hcpContext}
              setHcpContext={setHcpContext}
              onSubmit={handleSubmitSingleQuery}
              isLoading={isLoading}
              onSelectPreset={handleSelectPreset}
            />

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={handleSubmitSingleQuery}
                  className="px-3 py-1 bg-rose-900 hover:bg-rose-800 text-white font-semibold rounded"
                >
                  Retry Analysis
                </button>
              </div>
            )}

            {/* Analysis Results View */}
            {analysisResult && (
              <div id="analysis-results-section" className="space-y-6 animate-fadeIn">
                {/* Result High-level Summary Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Primary Medical Question Summary
                        </span>
                        <h3 className="text-base font-semibold text-slate-100">
                          {analysisResult.query_summary}
                        </h3>
                      </div>
                    </div>

                    {/* Priority & Ready Badges */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                          analysisResult.priority === "High"
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : analysisResult.priority === "Medium"
                            ? "bg-amber-950 text-amber-300 border-amber-800"
                            : "bg-emerald-950 text-emerald-300 border-emerald-800"
                        }`}
                      >
                        {analysisResult.priority} Priority
                      </span>

                      <span
                        className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                          analysisResult.ready_for_retrieval
                            ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {analysisResult.ready_for_retrieval
                          ? "Ready for Retrieval"
                          : "Needs Parameters"}
                      </span>
                    </div>
                  </div>

                  {/* Query Category Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">
                      Query Categories:
                    </span>
                    {analysisResult.query_category
                      .split(",")
                      .map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-950 text-cyan-300 border border-slate-800 rounded-md text-xs font-semibold"
                        >
                          • {cat.trim()}
                        </span>
                      ))}
                  </div>

                  {/* Clinical Risk Rationale */}
                  {analysisResult._metadata?.clinical_risk_note && (
                    <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                      <strong className="text-slate-300">Triage Rationale:</strong>{" "}
                      {analysisResult._metadata.clinical_risk_note}
                    </p>
                  )}
                </div>

                {/* Entity Matrix */}
                <EntityGrid entities={analysisResult.entities} />

                {/* Missing Information Checklist */}
                <MissingInfoAlert
                  missingInfo={analysisResult.missing_information}
                />

                {/* JSON Output Payload */}
                <JsonPayloadViewer result={analysisResult} />

                {/* Downstream Pipeline Simulator */}
                <DownstreamPipelineSimulator
                  result={analysisResult}
                  onPassToRetrievalEngine={handlePassToRetrievalEngine}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Evidence Retrieval Engine */}
        {activeTab === "retrieval" && (
          <EvidenceRetrievalView
            documents={documents}
            initialQuery={retrievalInitialQuery || query}
            onRetrieveEvidence={handleRetrieveEvidence}
            onPassToScientificReview={handlePassToScientificReview}
          />
        )}

        {/* Tab 3: Scientific Medical Review AI */}
        {activeTab === "review" && (
          <ScientificReviewView
            documents={documents}
            initialQuery={reviewInitialQuery || retrievalInitialQuery || query}
            initialTrials={reviewInitialTrials}
            onPerformReview={handlePerformScientificReview}
            onPassToMedInfoLetter={handlePassToMedInfoLetter}
          />
        )}

        {/* Tab 4: MSL Medical Information Response Generator */}
        {activeTab === "letter" && (
          <MedInfoLetterView
            documents={documents}
            initialQuery={
              letterInitialQuery || reviewInitialQuery || retrievalInitialQuery || query
            }
            initialHcpContext={hcpContext}
            initialTrials={letterInitialTrials || reviewInitialTrials}
            initialScientificReview={letterInitialReview}
            onGenerateLetter={handleGenerateMedInfoLetter}
            onPassToQualityAssurance={handlePassToQualityAssurance}
          />
        )}

        {/* Tab 5: Medical Affairs Quality Assurance AI */}
        {activeTab === "qa" && (
          <QualityAssuranceView
            documents={documents}
            initialDraftLetter={qaInitialDraftLetter}
            initialQuery={
              qaInitialQuery ||
              letterInitialQuery ||
              reviewInitialQuery ||
              retrievalInitialQuery ||
              query
            }
            initialTrials={qaInitialTrials || letterInitialTrials || reviewInitialTrials}
            onAuditQA={handlePerformQualityAssurance}
          />
        )}

        {/* Tab 6: Clinical Documents Repository */}

        {activeTab === "repository" && (
          <DocumentRepositoryView
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {/* Tab 5: Batch Inquiries Intake */}
        {activeTab === "batch" && (
          <BatchIntakeView
            onAnalyzeQuery={handleAnalyzeQuery}
            onAddSaveRecord={handleAddSaveRecordFromBatch}
          />
        )}

        {/* Tab 6: Audit Log & History */}
        {activeTab === "history" && (
          <AuditHistoryView
            records={auditRecords}
            onClearRecords={() => setAuditRecords([])}
          />
        )}

      </main>
    </div>
  );
}

