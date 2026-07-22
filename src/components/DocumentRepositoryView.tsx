import React, { useState } from "react";
import { ClinicalDocument } from "../types";
import {
  FileText,
  Plus,
  Trash2,
  BookOpen,
  Search,
  Tag,
  CheckCircle2,
  Calendar,
  X,
  Upload,
} from "lucide-react";

interface DocumentRepositoryViewProps {
  documents: ClinicalDocument[];
  onAddDocument: (doc: ClinicalDocument) => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentRepositoryView: React.FC<DocumentRepositoryViewProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Document Form
  const [newTitle, setNewTitle] = useState("");
  const [newArea, setNewArea] = useState("Oncology");
  const [newType, setNewType] =
    useState<ClinicalDocument["type"]>("Clinical Trial Monograph");
  const [newSource, setNewSource] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.therapeuticArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: ClinicalDocument = {
      id: `doc-custom-${Date.now()}`,
      title: newTitle.trim(),
      therapeuticArea: newArea,
      type: newType,
      source: newSource.trim() || "Custom Medical Upload",
      date: new Date().toISOString().split("T")[0],
      content: newContent.trim(),
      tags: newTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isDefault: false,
    };

    onAddDocument(created);
    setShowAddModal(false);

    // Reset Form
    setNewTitle("");
    setNewSource("");
    setNewContent("");
    setNewTags("");
  };

  return (
    <div id="document-repository-container" className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-950 text-blue-400 rounded-lg border border-blue-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-slate-100">
              Clinical Literature & Label Repository
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supplied clinical trial monographs, study designs, prescribing information, and stability reports used for grounded evidence retrieval.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-lg shadow flex items-center space-x-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Clinical Document</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search repository documents by title, keyword, or therapeutic area..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {doc.type}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-100 mt-1 leading-snug">
                    {doc.title}
                  </h3>
                </div>

                {!doc.isDefault && (
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                    title="Delete custom document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                <span>
                  <strong>Area:</strong> {doc.therapeuticArea}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" /> {doc.date}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-4 bg-slate-950 p-2.5 rounded border border-slate-800/80 font-sans leading-relaxed">
                "{doc.content}"
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
              {doc.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 bg-slate-950 text-slate-400 rounded text-[10px] border border-slate-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Custom Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-slate-100">
                  Upload Custom Clinical Trial / Monograph
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Document / Trial Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phase III Trial of Drug X in Relapsing MS"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Therapeutic Area
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oncology, Cardiology"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Document Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) =>
                      setNewType(e.target.value as ClinicalDocument["type"])
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Clinical Trial Monograph">
                      Clinical Trial Monograph
                    </option>
                    <option value="FDA/EMA Prescribing Info">
                      FDA/EMA Prescribing Info
                    </option>
                    <option value="Observational Study">
                      Observational Study
                    </option>
                    <option value="Stability Report">Stability Report</option>
                    <option value="Custom Upload">Custom Upload</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Source Journal / Institution
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lancet, NEJM, FDA Label"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Document Text / Trial Summary Content
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste clinical study details including trial design, population, sample size, primary endpoints, efficacy results, safety outcomes, and limitations..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. DrugX, Phase 3, Renal, Safety"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow"
                >
                  Add to Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
