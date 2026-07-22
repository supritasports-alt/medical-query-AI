export type PriorityLevel = "Low" | "Medium" | "High";

export interface ExtractedEntities {
  drug_name: string;
  disease: string;
  indication: string;
  patient_age: string;
  gender: string;
  pregnancy_status: string;
  comorbidities: string[];
  current_medications: string[];
  dose: string;
  route: string;
  duration: string;
  country: string;
  question_type: string;
}

export interface AnalysisOutput {
  query_summary: string;
  query_category: string;
  entities: ExtractedEntities;
  missing_information: string[];
  priority: PriorityLevel;
  ready_for_retrieval: boolean;
  _metadata?: {
    categories_list?: string[];
    clinical_risk_note?: string;
    processed_at?: string;
    model?: string;
    guardrail_passed?: boolean;
  };
}

export interface HCPContext {
  specialty: string;
  country: string;
  channel: "MSL Inquiry" | "Medical Information Call" | "Web Portal" | "Unsolicited Request Form" | "Congress / Symposium";
  urgency: "Normal" | "Urgent Patient Case" | "Regulatory Deadline";
  physicianName?: string;
  institution?: string;
}

export interface SampleQueryPreset {
  id: string;
  title: string;
  therapeuticArea: string;
  hcpName: string;
  specialty: string;
  country: string;
  urgency: "Normal" | "Urgent Patient Case" | "Regulatory Deadline";
  queryText: string;
  expectedCategory: string;
}

export interface SavedQueryRecord {
  id: string;
  timestamp: string;
  rawQuery: string;
  hcpContext: HCPContext;
  result: AnalysisOutput;
}

export interface ClinicalTrialEvidence {
  study_name: string;
  phase: string;
  population: string;
  sample_size: string;
  endpoint: string;
  results: string;
  safety: string;
  limitations: string;
  source_section: string;
}

export interface RetrievalEngineOutput {
  evidence_found: boolean;
  message?: string;
  clinical_trials: ClinicalTrialEvidence[];
  _metadata?: {
    queried_at?: string;
    document_count?: number;
    model?: string;
    no_evidence_fallback?: boolean;
  };
}

export interface ClinicalDocument {
  id: string;
  title: string;
  therapeuticArea: string;
  type: "Clinical Trial Monograph" | "FDA/EMA Prescribing Info" | "Observational Study" | "Stability Report" | "Custom Upload";
  source: string;
  date: string;
  content: string;
  tags: string[];
  isDefault?: boolean;
}

export interface ScientificReviewOutput {
  scientific_summary: string;
  benefit_risk: string;
  evidence_strength: "High" | "Moderate" | "Low";
  conflicting_data: string[];
  knowledge_gaps: string[];
  _metadata?: {
    reviewed_at?: string;
    model?: string;
  };
}

export interface MedInfoLetterOutput {
  letter_markdown: string;
  evidence_found: boolean;
  sections: {
    executive_summary: string;
    clinical_data_review: string;
    scientific_interpretation: string;
    limitations: string;
    conclusion: string;
    clinical_references: string[];
  };
  _metadata?: {
    generated_at?: string;
    model?: string;
    msl_disclaimer?: string;
  };
}

export interface QualityAssuranceOutput {
  approval_status: "Approved" | "Revision Required";
  compliance_score: number;
  issues: string[];
  corrected_response: string;
  checklist?: {
    no_hallucinations: boolean;
    unsupported_claims_free: boolean;
    scientifically_neutral: boolean;
    no_promotional_wording: boolean;
    references_valid: boolean;
    grammar_and_formatting: boolean;
    terminology_consistent: boolean;
    sections_complete: boolean;
    medinfo_standards_compliant: boolean;
  };
  _metadata?: {
    audited_at?: string;
    model?: string;
  };
}


