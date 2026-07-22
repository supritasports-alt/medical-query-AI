import React from "react";
import { ShieldAlert, CheckCircle2, Lock } from "lucide-react";

export const ComplianceNotice: React.FC = () => {
  return (
    <div id="compliance-notice-banner" className="bg-slate-900 border-l-4 border-amber-500 rounded-r-lg p-3.5 shadow-sm text-xs sm:text-sm text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start space-x-3">
        <div className="p-1.5 bg-amber-500/10 rounded-md text-amber-400 mt-0.5 sm:mt-0 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-100 uppercase tracking-wide text-xs">
              Medical Affairs Compliance Guardrail Active
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              <Lock className="w-3 h-3 mr-1" /> STRICT INTAKE MODE
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            This AI strictly analyzes HCP inquiries to extract entities, classify intent, detect missing clinical parameters, and format downstream JSON payloads. <strong className="text-amber-200 font-medium">It never answers medical questions or provides clinical treatment advice.</strong>
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800 text-xs text-slate-400 shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Downstream Payload Ready</span>
      </div>
    </div>
  );
};
