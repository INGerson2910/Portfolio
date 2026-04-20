import { useMemo, useState } from "react";
import { exportWorkbook, generateTestCases } from "../api/testgenApi";
import type { GenerationResponse } from "../types/generation";

export default function GeneratePage() {
  const [requirementText, setRequirementText] = useState("");
  const [generationNotes, setGenerationNotes] = useState(
    "Focus on functional, negative, validation, and boundary scenarios."
  );
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GenerationResponse | null>(null);

  const canGenerate = useMemo(() => requirementText.trim().length >= 20, [requirementText]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await generateTestCases({
        requirement_text: requirementText,
        prompt_preset: "standard_exhaustive",
        generation_notes: generationNotes,
      });

      setResult(data);
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Generation failed.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!result) return;

    try {
      setExporting(true);
      setError("");

      const blob = await exportWorkbook(result);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(result.feature_name || "testgen_export").replace(/\s+/g, "_")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Export failed.";
      setError(detail);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>TestGen AI</h1>
        <p style={styles.subtitle}>
          Generate test cases from requirement text and export them to Excel.
        </p>

        <div style={styles.card}>
          <label style={styles.label}>Requirement text</label>
          <textarea
            value={requirementText}
            onChange={(e) => setRequirementText(e.target.value)}
            placeholder="Paste the user story and acceptance criteria here..."
            style={styles.textarea}
          />

          <label style={styles.label}>Generation notes</label>
          <textarea
            value={generationNotes}
            onChange={(e) => setGenerationNotes(e.target.value)}
            placeholder="Optional notes for generation..."
            style={styles.notesArea}
          />

          <div style={styles.actions}>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
              style={styles.primaryButton}
            >
              {loading ? "Generating..." : "Generate Test Cases"}
            </button>

            <button
              onClick={handleExport}
              disabled={!result || exporting}
              style={styles.secondaryButton}
            >
              {exporting ? "Exporting..." : "Export Workbook"}
            </button>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {result && (
          <>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Summary</h2>
              <p><strong>Feature:</strong> {result.feature_name}</p>
              <p><strong>Test plan:</strong> {result.test_plan_summary}</p>

              <div style={styles.grid}>
                <div>
                  <h3 style={styles.smallTitle}>Assumptions</h3>
                  <ul>
                    {result.assumptions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 style={styles.smallTitle}>Coverage Areas</h3>
                  <ul>
                    {result.coverage_areas.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 style={styles.smallTitle}>Warnings</h3>
                  <ul>
                    {result.warnings.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Generated Test Cases</h2>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>TC ID</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Description</th>
                      <th style={styles.th}>Steps</th>
                      <th style={styles.th}>Test data</th>
                      <th style={styles.th}>Expected result</th>
                      <th style={styles.th}>Pre-conditions</th>
                      <th style={styles.th}>Automatable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.test_cases.map((tc) => (
                      <tr key={tc.tc_id}>
                        <td style={styles.td}>{tc.tc_id}</td>
                        <td style={styles.td}>{tc.test_type}</td>
                        <td style={styles.td}>{tc.description}</td>
                        <td style={styles.tdWhiteSpace}>{tc.steps}</td>
                        <td style={styles.tdWhiteSpace}>{tc.test_data}</td>
                        <td style={styles.tdWhiteSpace}>{tc.expected_result}</td>
                        <td style={styles.tdWhiteSpace}>{tc.pre_conditions}</td>
                        <td style={styles.td}>{tc.automatable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "32px 16px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    color: "#17324d",
  },
  subtitle: {
    color: "#4b647d",
    marginBottom: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 700,
    color: "#17324d",
  },
  textarea: {
    width: "100%",
    minHeight: "220px",
    marginBottom: "16px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #c8d4e3",
    fontSize: "14px",
    resize: "vertical",
  },
  notesArea: {
    width: "100%",
    minHeight: "90px",
    marginBottom: "16px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #c8d4e3",
    fontSize: "14px",
    resize: "vertical",
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    background: "#1f5eff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondaryButton: {
    background: "#fff",
    color: "#1f5eff",
    border: "1px solid #1f5eff",
    borderRadius: "8px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 700,
  },
  errorBox: {
    marginTop: "16px",
    background: "#ffe7e7",
    color: "#a11a1a",
    padding: "12px",
    borderRadius: "8px",
  },
  sectionTitle: {
    marginTop: 0,
    color: "#17324d",
  },
  smallTitle: {
    color: "#17324d",
    marginBottom: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#17324d",
    color: "#fff",
    textAlign: "left",
    padding: "12px",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
  td: {
    border: "1px solid #d9e2ec",
    padding: "10px",
    verticalAlign: "top",
    fontSize: "14px",
  },
  tdWhiteSpace: {
    border: "1px solid #d9e2ec",
    padding: "10px",
    verticalAlign: "top",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
  },
};