import React, { useState } from "react";
import { AnalysisOutput, HCPContext } from "../types";
import { SAMPLE_QUERIES } from "../data/sampleQueries";
import {
  Layers,
  Play,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Trash2,
  ListFilter,
} from "lucide-react";

interface BatchIntakeViewProps {
  onAnalyzeQuery: (
    query: string,
    hcpContext: HCPContext
  ) => Promise<AnalysisOutput>;
  onAddSaveRecord: (
    query: string,
    context: HCPContext,
    result: AnalysisOutput
  ) => void;
}

interface BatchItem {
  id: string;
  query: string;
  specialty: string;
  country: string;
  status: "pending" | "processing" | "completed" | "failed";
  result?: AnalysisOutput;
  error?: string;
}

export const BatchIntakeView: React.FC<BatchIntakeViewProps> = ({
  onAnalyzeQuery,
  onAddSaveRecord,
}) => {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([
    {
      id: "b-1",
      query: SAMPLE_QUERIES[0].queryText,
      specialty: SAMPLE_QUERIES[0].specialty,
      country: SAMPLE_QUERIES[0].country,
      status: "pending",
    },
    {
      id: "b-2",
      query: SAMPLE_QUERIES[1].queryText,
      specialty: SAMPLE_QUERIES[1].specialty,
      country: SAMPLE_QUERIES[1].country,
      status: "pending",
    },
    {
      id: "b-3",
      query: SAMPLE_QUERIES[2].queryText,
      specialty: SAMPLE_QUERIES[2].specialty,
      country: SAMPLE_QUERIES[2].country,
      status: "pending",
    },
  ]);

  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [newBatchText, setNewBatchText] = useState("");

  const handleAddCustomQuery = () => {
    if (!newBatchText.trim()) return;
    const newItem: BatchItem = {
      id: `b-${Date.now()}`,
      query: newBatchText.trim(),
      specialty: "General Medicine",
      country: "United States",
      status: "pending",
    };
    setBatchItems((prev) => [...prev, newItem]);
    setNewBatchText("");
  };

  const handleRunBatch = async () => {
    setIsProcessingBatch(true);

    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      if (item.status === "completed") continue;

      // Update status to processing
      setBatchItems((prev) =>
        prev.map((b) => (b.id === item.id ? { ...b, status: "processing" } : b))
      );

      try {
        const context: HCPContext = {
          specialty: item.specialty,
          country: item.country,
          channel: "Unsolicited Request Form",
          urgency: "Normal",
        };

        const res = await onAnalyzeQuery(item.query, context);

        setBatchItems((prev) =>
          prev.map((b) =>
            b.id === item.id ? { ...b, status: "completed", result: res } : b
          )
        );

        onAddSaveRecord(item.query, context, res);
      } catch (err: any) {
        setBatchItems((prev) =>
          prev.map((b) =>
            b.id === item.id
              ? {
                  ...b,
                  status: "failed",
                  error: err.message || "Processing failed",
                }
              : b
          )
        );
      }
    }

    setIsProcessingBatch(false);
  };

  const handleExportBatchCSV = () => {
    const completed = batchItems.filter((b) => b.result);
    if (completed.length === 0) return;

    const headers = [
      "ID",
      "Summary",
      "Category",
      "Drug Name",
      "Disease",
      "Priority",
      "Ready For Retrieval",
      "Missing Information Count",
    ];

    const rows = completed.map((b) => [
      b.id,
      `"${b.result?.query_summary.replace(/"/g, '""')}"`,
      `"${b.result?.query_category}"`,
      `"${b.result?.entities.drug_name}"`,
      `"${b.result?.entities.disease}"`,
      b.result?.priority,
      b.result?.ready_for_retrieval ? "TRUE" : "FALSE",
      b.result?.missing_information.length || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `batch_medical_query_intake_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="batch-intake-container" className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-950 text-blue-400 rounded-lg border border-blue-800">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-slate-100">
              Batch Medical Inquiries Processing
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyze multiple unsolicited HCP requests simultaneously to extract entities and generate structured JSON payloads in bulk.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="run-batch-analysis-button"
            onClick={handleRunBatch}
            disabled={
              isProcessingBatch ||
              batchItems.every((b) => b.status === "completed")
            }
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs rounded-lg shadow disabled:opacity-50 flex items-center space-x-2 transition-all"
          >
            {isProcessingBatch ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Batch...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Batch Intake Analysis</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportBatchCSV}
            disabled={!batchItems.some((b) => b.result)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 disabled:opacity-50 flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Add Custom Query to Batch */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Add New Query to Batch List
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBatchText}
            onChange={(e) => setNewBatchText(e.target.value)}
            placeholder="Type or paste physician query text to queue..."
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddCustomQuery}
            disabled={!newBatchText.trim()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 disabled:opacity-50"
          >
            + Queue Item
          </button>
        </div>
      </div>

      {/* Batch Items Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ListFilter className="w-4 h-4 text-cyan-400" />
            <span>Batch Queue ({batchItems.length} Items)</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {batchItems.filter((b) => b.status === "completed").length} Completed
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {batchItems.map((item, index) => (
            <div key={item.id} className="p-4 hover:bg-slate-950/40 transition-colors">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold text-slate-400">
                      #{index + 1}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded text-[10px]">
                      {item.specialty}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-[10px]">
                      {item.country}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    "{item.query}"
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center space-x-3 shrink-0">
                  {item.status === "pending" && (
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs rounded-md border border-slate-700">
                      Pending Queue
                    </span>
                  )}
                  {item.status === "processing" && (
                    <span className="px-2.5 py-1 bg-blue-950 text-blue-300 text-xs rounded-md border border-blue-800 flex items-center gap-1.5">
                      <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Extracting Entities...</span>
                    </span>
                  )}
                  {item.status === "completed" && item.result && (
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[11px] font-semibold rounded border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{item.result.priority} Priority</span>
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded">
                        {item.result.query_category}
                      </span>
                    </div>
                  )}
                  {item.status === "failed" && (
                    <span className="px-2.5 py-1 bg-rose-950 text-rose-300 text-xs rounded-md border border-rose-800 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      <span>Failed</span>
                    </span>
                  )}

                  <button
                    onClick={() =>
                      setBatchItems((prev) =>
                        prev.filter((b) => b.id !== item.id)
                      )
                    }
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Result Preview if Completed */}
              {item.result && (
                <div className="mt-3 bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1.5 font-mono text-slate-300">
                  <div>
                    <strong className="text-cyan-400">Drug:</strong>{" "}
                    {item.result.entities.drug_name} |{" "}
                    <strong className="text-rose-400">Disease:</strong>{" "}
                    {item.result.entities.disease} |{" "}
                    <strong className="text-amber-400">Age:</strong>{" "}
                    {item.result.entities.patient_age}
                  </div>
                  <div>
                    <strong className="text-indigo-400">Missing Info:</strong>{" "}
                    {item.result.missing_information.length > 0
                      ? item.result.missing_information.join(", ")
                      : "None"}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
