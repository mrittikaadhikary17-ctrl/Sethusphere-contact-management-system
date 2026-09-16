import React, { useState } from "react";
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Table as TableIcon,
  RefreshCw
} from "lucide-react";
import { useContacts } from "../context/ContactContext";

export function ImportExportPage() {
  const { contacts, interactions, addContact, showToast } = useContacts();

  const [activeTab, setActiveTab] = useState("import"); // 'import' | 'export'
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);

  const parseFile = (file) => {
    if (!file || !file.name.toLowerCase().endsWith(".csv")) {
      showToast("Please select a CSV file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result || "").split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        showToast("The selected CSV does not contain any contact rows.", "error");
        return;
      }
      const headers = lines[0].split(",").map((header) => header.trim().toLowerCase());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));
        const record = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
        return {
          firstName: record.firstname || record["first name"] || "",
          lastName: record.lastname || record["last name"] || "",
          email: record.email || record["work email"] || "",
          phone: record.phone || "",
          company: record.company || "",
          jobTitle: record.jobtitle || record.title || "",
          category: record.category || ""
        };
      }).filter((row) => row.firstName || row.lastName || row.email);
      setSelectedFile({ name: file.name, size: `${Math.round(file.size / 1024)} KB` });
      setPreviewRows(rows);
    };
    reader.onerror = () => showToast("Unable to read the selected CSV file.", "error");
    reader.readAsText(file);
  };

  const handleImport = async () => {
    for (const row of previewRows) {
      await addContact({
        ...row,
        fullName: `${row.firstName} ${row.lastName}`.trim()
      });
    }
    showToast(`Imported ${previewRows.length} contacts.`);
    setSelectedFile(null);
    setPreviewRows([]);
  };

  const handleDownloadCSV = (filename, dataset) => {
    const headers = Object.keys(dataset[0] || {}).join(",");
    const rows = dataset.map((d) => Object.values(d).map((v) => `"${v}"`).join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${dataset.length} records to ${filename}`);
  };

  return (
    <div className="space-y-6">
      {/* 19. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-[#121316]">
              Import & Export Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE8DF] text-[#494C55]">
              CSV Tools
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#757985] mt-0.5">
            Migrate datasets seamlessly. Inspect columns, verify sample records, and export network audits.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-white border border-[#DCD7CE] rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("import")}
            className={`whitespace-nowrap px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "import" ? "bg-[#722F37] text-white" : "text-[#757985]"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Data</span>
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`whitespace-nowrap px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "export" ? "bg-[#722F37] text-white" : "text-[#757985]"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Center</span>
          </button>
        </div>
      </div>

      {/* TAB 1: IMPORT WORKFLOW */}
      {activeTab === "import" && (
        <div className="space-y-6">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              parseFile(e.dataTransfer.files[0]);
            }}
            onClick={() => document.getElementById("contacts-csv-input")?.click()}
            className={`surface-card rounded-2xl p-8 text-center border-2 border-dashed transition-all cursor-pointer ${
              isDragging
                ? "border-[#722F37] bg-[#722F37]/5"
                : "border-[#DCD7CE] hover:border-[#722F37]"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#EDE8DF] flex items-center justify-center text-[#722F37] mx-auto mb-3">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#121316]">
              Drag & Drop your CSV file here
            </h3>
            <p className="text-xs text-[#757985] mt-1 max-w-sm mx-auto">
              Supports standard UTF-8 CSV exports from Google Contacts, LinkedIn, Salesforce, HubSpot, or Excel.
            </p>
            <input
              id="contacts-csv-input"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => parseFile(e.target.files[0])}
            />
            <div className="mt-4 flex items-center justify-center gap-3">
              {selectedFile ? (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F5F2EB] text-[#494C55] border border-[#E5E0D8]">
                  {selectedFile.name} ({selectedFile.size})
                </span>
              ) : (
                <span className="text-xs text-[#757985]">No file selected</span>
              )}
            </div>
          </div>

          {/* Column Mapping Preview */}
          {selectedFile && (
          <div className="surface-card rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
              <div>
                <h3 className="text-sm font-bold text-[#121316]">
                  CSV Column Mapping & Live Preview
                </h3>
                <p className="text-xs text-[#757985]">
                  Previewing {previewRows.length} records from <strong>{selectedFile.name}</strong>.
                </p>
              </div>

              <span className="text-xs font-semibold text-[#4E6E55] bg-[#E8F0EA] px-2.5 py-1 rounded-lg">
                All 6 fields mapped
              </span>
            </div>

            {/* Preview Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1E2024]">
                <thead className="bg-[#F5F2EB] text-[#757985] font-semibold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">First Name</th>
                    <th className="py-2.5 px-3">Last Name</th>
                    <th className="py-2.5 px-3">Work Email</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE1]">
                  {previewRows.map((r, i) => (
                    <tr key={i} className="hover:bg-[#FBF9F5]">
                      <td className="py-2.5 px-3 font-semibold text-[#121316]">{r.firstName}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#121316]">{r.lastName}</td>
                      <td className="py-2.5 px-3 text-[#757985]">{r.email}</td>
                      <td className="py-2.5 px-3 text-[#757985]">{r.phone}</td>
                      <td className="py-2.5 px-3 font-medium text-[#121316]">{r.company}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDE8DF] text-[#494C55]">
                          {r.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Import Execution Bar */}
            <div className="mt-6 pt-4 border-t border-[#F0ECE1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-[#757985]">
                Ready to ingest {previewRows.length} contacts into active workspace memory.
              </span>

              <button
                onClick={handleImport}
                disabled={!previewRows.length}
                className="px-5 py-2 rounded-xl bg-[#722F37] hover:bg-[#5C1521] text-xs font-semibold text-white transition-all shadow-sm flex items-center justify-center gap-2 self-end sm:self-auto disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Ingest Contacts</span>
              </button>
            </div>
          </div>
          )}
        </div>
      )}

      {/* TAB 2: EXPORT WORKFLOW */}
      {activeTab === "export" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="surface-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#722F37]/10 text-[#722F37] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#121316]">
                All Contacts ({contacts.length})
              </h3>
              <p className="text-xs text-[#757985] mt-1 leading-relaxed">
                Export complete relationship dossier including health scores, cadences, emails, and address records.
              </p>
            </div>
            <button
              onClick={() => handleDownloadCSV("sethusphere_contacts_full.csv", contacts)}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#722F37] hover:bg-[#5C1521] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export All Contacts
            </button>
          </div>

          <div className="surface-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#4E6E55]/10 text-[#4E6E55] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#121316]">
                VIP & Active Relationships
              </h3>
              <p className="text-xs text-[#757985] mt-1 leading-relaxed">
                Export healthy and VIP accounts for quarterly executive reporting and investor updates.
              </p>
            </div>
            <button
              onClick={() =>
                handleDownloadCSV(
                  "sethusphere_vip_active.csv",
                  contacts.filter((c) => c.category === "VIP" || c.healthStatus === "Healthy")
                )
              }
              className="mt-6 w-full py-2.5 rounded-xl bg-[#4E6E55] hover:bg-[#38533E] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export VIP Records
            </button>
          </div>

          <div className="surface-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#4A6B82]/10 text-[#4A6B82] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#121316]">
                Touchpoints & Interactions ({interactions.length})
              </h3>
              <p className="text-xs text-[#757985] mt-1 leading-relaxed">
                Export interaction audit log with timestamps, meeting transcripts, and follow-up commitments.
              </p>
            </div>
            <button
              onClick={() => handleDownloadCSV("sethusphere_interactions_log.csv", interactions)}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#4A6B82] hover:bg-[#3B5B72] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Interaction Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
