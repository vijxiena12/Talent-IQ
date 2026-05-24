import { useState } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

export default function Screening() {
  const [file, setFile] = useState<File | null>(null)
  const [jdText, setJdText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function runAnalysis() {
    if (!file) return alert("Please choose a resume file")
    setLoading(true)
    const fd = new FormData()
    fd.append("resume", file)
    fd.append("jd_text", jdText)

    try {
      const resp = await api.post("/assessment/analyze", fd)
      setResult(resp.data)
    } catch (e: any) {
      alert(e.response?.data?.detail || e.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Screening</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-700">Resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            className="mt-2"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Job Description</label>
          <textarea
            rows={8}
            className="w-full mt-2 p-3 border rounded-md"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={runAnalysis} className="bg-indigo-600" disabled={loading}>
          {loading ? "Running..." : "Run Analysis"}
        </Button>
        <Button variant="ghost" onClick={() => { setResult(null); setJdText(""); setFile(null) }}>
          Reset
        </Button>
      </div>

      {result && (
        <div className="mt-8 bg-white p-6 rounded-lg border">
          <h2 className="font-semibold text-lg">Results</h2>
          <p className="mt-2">ATS Score: <strong>{result.ats_result?.ats_score ?? "N/A"}</strong></p>

          {result.assessment && (
            <div className="mt-4">
              <h3 className="font-medium">Assessment</h3>
              <div className="mt-2">
                <h4 className="font-semibold">MCQs</h4>
                <ol className="list-decimal ml-6">
                  {result.assessment.mcqs?.map((q: any) => (
                    <li key={q.id} className="mt-2">
                      <div className="font-medium">{q.question}</div>
                      <div className="text-sm text-slate-600">Options: {q.options?.join(", ")}</div>
                    </li>
                  ))}
                </ol>

                <h4 className="font-semibold mt-4">DSA</h4>
                <div className="mt-1">
                  <div className="font-medium">{result.assessment.dsa?.title}</div>
                  <pre className="mt-2 bg-slate-50 p-3 rounded">{result.assessment.dsa?.description}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
