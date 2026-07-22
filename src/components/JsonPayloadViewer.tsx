import React, { useState } from "react";
import { AnalysisOutput } from "../types";
import {
  Code,
  Copy,
  Check,
  Download,
  FileCheck2,
  ListTree,
  Terminal,
} from "lucide-react";

interface JsonPayloadViewerProps {
  result: AnalysisOutput;
}

export const JsonPayloadViewer: React.FC<JsonPayloadViewerProps> = ({
  result,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"formatted" | "compact">("formatted");

  // Construct standard output format requested by user
  const jsonStandardPayload = {
    query_summary: result.query_summary,
    query_category: result.query_category,
    entities: result.entities,
    missing_information: result.missing_information,
    priority: result.priority,
    ready_for_retrieval: result.ready_for_retrieval,
  };

  const jsonString =
    viewMode === "formatted"
      ? JSON.stringify(jsonStandardPayload, null, 2)
      : JSON.stringify(jsonStandardPayload);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medical_query_intake_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="json-payload-viewer-container" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Top Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">
            Downstream JSON Payload Output
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded-full border border-emerald-800 font-mono">
            Schema V1.0 Validated
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <button
            onClick={() =>
              setViewMode(viewMode === "formatted" ? "compact" : "formatted")
            }
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 flex items-center space-x-1 transition-colors"
          >
            <ListTree className="w-3.5 h-3.5 text-blue-400" />
            <span>{viewMode === "formatted" ? "Pretty JSON" : "Minified"}</span>
          </button>

          {/* Copy Button */}
          <button
            id="copy-json-payload-button"
            onClick={handleCopy}
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

          {/* Download Button */}
          <button
            id="download-json-payload-button"
            onClick={handleDownload}
            className="px-2.5 py-1 bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs rounded border border-blue-700/80 flex items-center space-x-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-300" />
            <span>Export .json</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="p-4 bg-slate-950/90 font-mono text-xs overflow-x-auto text-cyan-300 leading-relaxed max-h-96">
        <pre id="raw-json-output">{jsonString}</pre>
      </div>

      {/* Schema Footer */}
      <div className="bg-slate-900 px-4 py-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ready for VEEVA Vault & MedCOMM AI Consumption</span>
        </span>
        <span className="font-mono text-slate-500">
          Size: {new Blob([jsonString]).size} bytes
        </span>
      </div>
    </div>
  );
};
