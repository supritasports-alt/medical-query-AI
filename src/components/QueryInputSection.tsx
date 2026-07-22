import React, { useState } from "react";
import { SAMPLE_QUERIES } from "../data/sampleQueries";
import { HCPContext, SampleQueryPreset } from "../types";
import {
  Send,
  Sparkles,
  UserCheck,
  Globe2,
  AlertCircle,
  Mic,
  MicOff,
  RotateCcw,
  BookOpen,
} from "lucide-react";

interface QueryInputSectionProps {
  query: string;
  setQuery: (q: string) => void;
  hcpContext: HCPContext;
  setHcpContext: React.Dispatch<React.SetStateAction<HCPContext>>;
  onSubmit: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: SampleQueryPreset) => void;
}

export const QueryInputSection: React.FC<QueryInputSectionProps> = ({
  query,
  setQuery,
  hcpContext,
  setHcpContext,
  onSubmit,
  isLoading,
  onSelectPreset,
}) => {
  const [isDictating, setIsDictating] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  // Dictation simulation for HCP voice notes
  const handleToggleDictation = () => {
    if (isDictating) {
      setIsDictating(false);
    } else {
      setIsDictating(true);
      const simulatedDictation =
        "Dr. Amanda Vance calling regarding a 55-year-old female patient with severe hepatic impairment (Child-Pugh Class B) and rheumatoid arthritis. We are evaluating whether upadacitinib 15mg daily requires dose modification or if Tofacitinib would be safer based on metabolic hepatic clearance profiles.";
      
      let index = 0;
      setQuery("");
      const interval = setInterval(() => {
        if (index < simulatedDictation.length) {
          setQuery((prev) => prev + simulatedDictation.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          setIsDictating(false);
        }
      }, 25);
    }
  };

  const wordCount = query.trim() ? query.trim().split(/\s+/).length : 0;

  return (
    <div id="query-input-container" className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-950 text-blue-400 rounded-lg border border-blue-800/50">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Healthcare Professional (HCP) Query Intake
            </h2>
            <p className="text-xs text-slate-400">
              Enter or dictate unsolicited medical information inquiries from physicians or MSL encounters.
            </p>
          </div>
        </div>

        {/* Preset Selector Button */}
        <div className="relative">
          <button
            id="preset-queries-button"
            onClick={() => setShowPresetDropdown(!showPresetDropdown)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample Cases ({SAMPLE_QUERIES.length})</span>
          </button>

          {showPresetDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
              <div className="p-2.5 bg-slate-900/90 text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Select HCP Preset Query</span>
                <span className="text-[10px] text-slate-500">Clinical Scenarios</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-900">
                {SAMPLE_QUERIES.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      setShowPresetDropdown(false);
                    }}
                    className="w-full text-left p-3 hover:bg-slate-900 transition-colors block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-cyan-300 group-hover:text-cyan-200">
                        {preset.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                        {preset.therapeuticArea}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-normal">
                      "{preset.queryText}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HCP Context Metadata Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Specialist / Specialty
          </label>
          <input
            id="hcp-specialty-input"
            type="text"
            placeholder="e.g. Medical Oncology, Cardiology"
            value={hcpContext.specialty}
            onChange={(e) =>
              setHcpContext({ ...hcpContext, specialty: e.target.value })
            }
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Globe2 className="w-3 h-3 text-slate-400" /> Country / Jurisdiction
          </label>
          <select
            id="hcp-country-select"
            value={hcpContext.country}
            onChange={(e) =>
              setHcpContext({ ...hcpContext, country: e.target.value })
            }
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="United States">United States (FDA)</option>
            <option value="United Kingdom">United Kingdom (MHRA)</option>
            <option value="Germany">Germany (EMA / BfArM)</option>
            <option value="Canada">Canada (Health Canada)</option>
            <option value="Japan">Japan (PMDA)</option>
            <option value="Global / Unspecified">Global / Unspecified</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Intake Channel
          </label>
          <select
            id="hcp-channel-select"
            value={hcpContext.channel}
            onChange={(e) =>
              setHcpContext({
                ...hcpContext,
                channel: e.target.value as HCPContext["channel"],
              })
            }
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="MSL Inquiry">MSL Field Inquiry</option>
            <option value="Medical Information Call">Medical Info Call Center</option>
            <option value="Web Portal">HCP Digital Portal</option>
            <option value="Unsolicited Request Form">Unsolicited Request Form</option>
            <option value="Congress / Symposium">Medical Congress / Symposium</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" /> Priority / Urgency
          </label>
          <select
            id="hcp-urgency-select"
            value={hcpContext.urgency}
            onChange={(e) =>
              setHcpContext({
                ...hcpContext,
                urgency: e.target.value as HCPContext["urgency"],
              })
            }
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="Normal">Normal Request (Standard SLA)</option>
            <option value="Urgent Patient Case">Urgent Patient Treatment Case</option>
            <option value="Regulatory Deadline">Regulatory / Audit Deadline</option>
          </select>
        </div>
      </div>

      {/* Primary Query Text Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span>Physician Query Text</span>
            <span className="text-[10px] font-normal text-slate-500">
              (Include details like age, comorbidities, drug names, dosage, duration)
            </span>
          </label>

          <div className="flex items-center space-x-2">
            {/* Dictation Simulation button */}
            <button
              id="dictate-query-button"
              type="button"
              onClick={handleToggleDictation}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-all ${
                isDictating
                  ? "bg-red-950 text-red-300 border border-red-700 animate-pulse"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {isDictating ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-red-400" />
                  <span>Dictating Voice Note...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Simulate Voice Dictation</span>
                </>
              )}
            </button>

            {/* Clear Button */}
            {query && (
              <button
                id="clear-query-button"
                onClick={() => setQuery("")}
                className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
                title="Clear input"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <textarea
            id="physician-query-textarea"
            rows={5}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type or paste the healthcare provider's medical query here (e.g., 'What is the dosage adjustment and renal monitoring protocol for pemetrexed in a 62-year-old male with NSCLC and stage 3b CKD?')..."
            className="w-full bg-slate-950 border border-slate-700/90 rounded-xl p-3.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed font-sans shadow-inner"
          />

          <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 font-mono">
            {wordCount} words | {query.length} chars
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>
            Powered by <strong>Gemini 3.6 Flash</strong> Medical Intelligence Engine
          </span>
        </div>

        <button
          id="analyze-query-submit-button"
          onClick={onSubmit}
          disabled={isLoading || !query.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Medical Intent...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Analyze & Generate Payload</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
