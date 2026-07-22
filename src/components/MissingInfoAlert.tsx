import React from "react";
import { AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";

interface MissingInfoAlertProps {
  missingInfo: string[];
}

export const MissingInfoAlert: React.FC<MissingInfoAlertProps> = ({
  missingInfo,
}) => {
  const hasMissing = missingInfo && missingInfo.length > 0;

  return (
    <div
      id="missing-info-alert-box"
      className={`p-4 rounded-xl border transition-all ${
        hasMissing
          ? "bg-amber-950/30 border-amber-800/80 text-amber-200"
          : "bg-emerald-950/20 border-emerald-800/80 text-emerald-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div
            className={`p-2 rounded-lg mt-0.5 ${
              hasMissing
                ? "bg-amber-900/60 text-amber-300"
                : "bg-emerald-900/60 text-emerald-300"
            }`}
          >
            {hasMissing ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <span>
                {hasMissing
                  ? "Missing Clinical / Patient Information"
                  : "All Necessary Clinical Parameters Present"}
              </span>
              {hasMissing && (
                <span className="text-[10px] bg-amber-900 text-amber-200 px-2 py-0.5 rounded-full font-bold">
                  {missingInfo.length} Items Pending
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {hasMissing
                ? "The following clinical or patient parameters were not specified in the physician inquiry. Downstream response generators will flag these as essential data requests."
                : "The physician query contains sufficient clinical context (dosing, indication, demographics) for immediate Medical Information retrieval."}
            </p>

            {hasMissing && (
              <ul className="mt-3 space-y-1.5 pl-1">
                {missingInfo.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center space-x-2 text-xs text-amber-100 font-medium bg-amber-950/60 px-3 py-1.5 rounded border border-amber-900/80"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
