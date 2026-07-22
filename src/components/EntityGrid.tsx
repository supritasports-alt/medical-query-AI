import React from "react";
import { ExtractedEntities } from "../types";
import {
  Pill,
  Activity,
  HeartPulse,
  User,
  Baby,
  Calendar,
  AlertTriangle,
  Stethoscope,
  Clock,
  Compass,
  FileQuestion,
  MapPin,
  Syringe,
} from "lucide-react";

interface EntityGridProps {
  entities: ExtractedEntities;
}

export const EntityGrid: React.FC<EntityGridProps> = ({ entities }) => {
  const isSpecified = (val: string | undefined | null) => {
    if (!val) return false;
    const lower = val.toLowerCase().trim();
    return (
      lower !== "not specified" &&
      lower !== "none" &&
      lower !== "unknown" &&
      lower !== "n/a" &&
      lower !== "unspecified"
    );
  };

  const renderArrayBadge = (
    items: string[],
    emptyLabel: string,
    colorClass: string
  ) => {
    if (!items || items.length === 0) {
      return (
        <span className="text-slate-500 italic text-xs">
          {emptyLabel}
        </span>
      );
    }
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {items.map((item, idx) => (
          <span
            key={idx}
            className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  const entityCards = [
    {
      label: "Drug Name",
      value: entities.drug_name,
      icon: Pill,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-800/60",
      specified: isSpecified(entities.drug_name),
    },
    {
      label: "Disease / Condition",
      value: entities.disease,
      icon: HeartPulse,
      color: "text-rose-400 bg-rose-950/60 border-rose-800/60",
      specified: isSpecified(entities.disease),
    },
    {
      label: "Indication",
      value: entities.indication,
      icon: Activity,
      color: "text-indigo-400 bg-indigo-950/60 border-indigo-800/60",
      specified: isSpecified(entities.indication),
    },
    {
      label: "Patient Age",
      value: entities.patient_age,
      icon: Calendar,
      color: "text-amber-400 bg-amber-950/60 border-amber-800/60",
      specified: isSpecified(entities.patient_age),
    },
    {
      label: "Gender",
      value: entities.gender,
      icon: User,
      color: "text-sky-400 bg-sky-950/60 border-sky-800/60",
      specified: isSpecified(entities.gender),
    },
    {
      label: "Pregnancy Status",
      value: entities.pregnancy_status,
      icon: Baby,
      color: "text-purple-400 bg-purple-950/60 border-purple-800/60",
      specified: isSpecified(entities.pregnancy_status),
    },
    {
      label: "Dose",
      value: entities.dose,
      icon: Syringe,
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60",
      specified: isSpecified(entities.dose),
    },
    {
      label: "Route of Admin",
      value: entities.route,
      icon: Compass,
      color: "text-teal-400 bg-teal-950/60 border-teal-800/60",
      specified: isSpecified(entities.route),
    },
    {
      label: "Duration",
      value: entities.duration,
      icon: Clock,
      color: "text-orange-400 bg-orange-950/60 border-orange-800/60",
      specified: isSpecified(entities.duration),
    },
    {
      label: "Country / Region",
      value: entities.country,
      icon: MapPin,
      color: "text-blue-400 bg-blue-950/60 border-blue-800/60",
      specified: isSpecified(entities.country),
    },
    {
      label: "Question Type",
      value: entities.question_type,
      icon: FileQuestion,
      color: "text-violet-400 bg-violet-950/60 border-violet-800/60",
      specified: isSpecified(entities.question_type),
    },
  ];

  return (
    <div id="entity-grid-container" className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-cyan-400" />
          <span>Extracted Medical Entity Matrix</span>
        </h3>
        <span className="text-xs text-slate-400">
          Automated Extraction Engine
        </span>
      </div>

      {/* Grid of Single Value Entities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {entityCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border transition-all ${
                card.specified
                  ? "bg-slate-900 border-slate-800 shadow-sm"
                  : "bg-slate-950/40 border-slate-900 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${card.color.split(" ")[0]}`} />
                  {card.label}
                </span>
                {card.specified ? (
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                    Extracted
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                    Not Specified
                  </span>
                )}
              </div>
              <div className="text-xs font-semibold text-slate-100 truncate mt-0.5">
                {card.specified ? card.value : "Not specified"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Array Entities: Comorbidities & Current Medications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Comorbidities */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Comorbidities / Underlying Conditions</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {entities.comorbidities?.length || 0} Detected
            </span>
          </div>
          {renderArrayBadge(
            entities.comorbidities,
            "No underlying comorbidities specified in query.",
            "bg-amber-950 text-amber-200 border border-amber-800/80"
          )}
        </div>

        {/* Current Medications */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-cyan-300 flex items-center gap-1.5">
              <Pill className="w-4 h-4" />
              <span>Current Medications / Co-Therapies</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {entities.current_medications?.length || 0} Detected
            </span>
          </div>
          {renderArrayBadge(
            entities.current_medications,
            "No concurrent medications specified in query.",
            "bg-cyan-950 text-cyan-200 border border-cyan-800/80"
          )}
        </div>
      </div>
    </div>
  );
};
