import React, { useState } from "react";
import { SavedQueryRecord } from "../types";
import {
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Database,
  Calendar,
  Globe2,
  Tag,
  AlertCircle,
  X,
} from "lucide-react";
import { JsonPayloadViewer } from "./JsonPayloadViewer";

interface AuditHistoryViewProps {
  records: SavedQueryRecord[];
  onClearRecords: () => void;
}

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({
  records,
  onClearRecords,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<SavedQueryRecord | null>(
    null
  );

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.rawQuery.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.result.query_summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.result.entities.drug_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.result.entities.disease.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" || rec.result.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const handleExportFullJSON = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medical_affairs_audit_history_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="audit-history-container" className="space-y-5">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-950 text-blue-400 rounded-lg border border-blue-800">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-slate-100">
              Medical Affairs Query Audit & Dispatch Log
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical log of all processed physician inquiries, entity extractions, and downstream payloads.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {records.length > 0 && (
            <>
              <button
                onClick={handleExportFullJSON}
                className="px-3.5 py-2 bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-semibold rounded-lg border border-blue-700/80 flex items-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit Log (.json)</span>
              </button>

              <button
                onClick={onClearRecords}
                className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 text-xs font-semibold rounded-lg border border-slate-700 hover:border-rose-800 flex items-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by drug, disease, or query summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      {filteredRecords.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400 space-y-2">
          <Database className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-medium">No audit log records found.</p>
          <p className="text-xs text-slate-500">
            Submit HCP queries from the intake section to populate the audit trail.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg divide-y divide-slate-800">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-4 hover:bg-slate-950/50 transition-colors space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-mono text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(rec.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>

                  <span className="text-slate-500">•</span>

                  <span className="text-cyan-300 font-semibold">
                    {rec.hcpContext.specialty}
                  </span>

                  <span className="text-slate-500">•</span>

                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Globe2 className="w-3 h-3" />
                    {rec.hcpContext.country}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.result.priority === "High"
                        ? "bg-rose-950 text-rose-300 border border-rose-800"
                        : rec.result.priority === "Medium"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    }`}
                  >
                    {rec.result.priority} Priority
                  </span>

                  <button
                    onClick={() => setSelectedRecord(rec)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 flex items-center space-x-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View JSON</span>
                  </button>
                </div>
              </div>

              {/* Summary and Query */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-200">
                  {rec.result.query_summary}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  "{rec.rawQuery}"
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded border border-slate-800 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-400" />
                  Category: {rec.result.query_category}
                </span>

                <span className="px-2 py-0.5 bg-slate-950 text-cyan-300 rounded border border-slate-800 font-mono">
                  Drug: {rec.result.entities.drug_name}
                </span>

                <span className="px-2 py-0.5 bg-slate-950 text-rose-300 rounded border border-slate-800 font-mono">
                  Disease: {rec.result.entities.disease}
                </span>

                {rec.result.missing_information.length > 0 && (
                  <span className="px-2 py-0.5 bg-amber-950/80 text-amber-300 rounded border border-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    {rec.result.missing_information.length} Missing Info Items
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* JSON Payload Inspector Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  Intake Payload Inspector
                </h3>
                <p className="text-xs text-slate-400">
                  Record ID: #{selectedRecord.id} | Processed:{" "}
                  {new Date(selectedRecord.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <JsonPayloadViewer result={selectedRecord.result} />
          </div>
        </div>
      )}
    </div>
  );
};
