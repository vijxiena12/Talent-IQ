import { ChangeEvent, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { SketchyDashboardLayout } from "@/components/SketchyDashboardLayout"
import { SketchyCard } from "@/components/SketchyCard"
import { RefreshCw, FileText } from "lucide-react"

interface AssessmentHistory {
  id: number
  mcq_score: number
  integrity_score: number
  overall_score: number
  completed_at: string
}

interface Profile {
  user_id: number
  email: string
  role: string
  total_assessments: number
  average_score: number
  ats_score?: number
  name?: string
}

interface Suggestions {
  missing_skills?: { requirement: string; similarity_score: number }[]
  matching_skills?: { requirement: string; similarity_score: number }[]
  ats_score?: number
  file_name?: string
  suggestions?: string[]
}

export default function IndividualDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [history, setHistory] = useState<AssessmentHistory[]>([])
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null)
  const [loading, setLoading] = useState(true)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeName, setResumeName] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastSynced, setLastSynced] = useState(new Date())

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await api.get("/user/dashboard")
      const data = response.data
      setProfile(data.profile)
      setHistory(data.history || [])
      setSuggestions(data.suggestions)

    } catch (err) {
      console.warn("Dashboard fetch failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setLastSynced(new Date())
    await fetchData()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setResumeFile(file)
    setResumeName(file ? file.name : "")

    if (!file) {
      setResumeText("")
      return
    }

    if (file.type.startsWith("text") || file.name.endsWith(".txt")) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        setResumeText(evt.target?.result as string)
      }
      reader.readAsText(file)
    } else {
      setResumeText(`Resume uploaded: ${file.name}`)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeFile && !resumeText) {
      alert("Please upload a resume or paste resume text.")
      return
    }

    if (!jobDescription) {
      alert("Please paste the job description.")
      return
    }

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      if (resumeFile) formData.append("resume", resumeFile)
      formData.append("jd", jobDescription)
      formData.append("job_title", "Resume ATS Analysis")

      const response = await api.post("/assessment/analyze", formData)
      const analysisData = response.data.analysis
      
      const result = {
        finalScore: analysisData.ats_score,
        ats_score: analysisData.ats_score,
        breakdown: analysisData.breakdown || {},
        matchingSkills: (analysisData.matching_skills || []).map((s: any) => typeof s === "object" ? (s.skill || s.requirement || JSON.stringify(s)) : s),
        missingSkills: (analysisData.missing_skills || []).map((s: any) => typeof s === "object" ? (s.skill || s.requirement || JSON.stringify(s)) : s),
        suggestions: analysisData.suggestions || []
      }
      
      setAnalysisResult(result)

      // Refresh other dashboard metrics and history list
      const dashResponse = await api.get("/user/dashboard")
      setProfile(dashResponse.data.profile)
      setHistory(dashResponse.data.history || [])
      setSuggestions(dashResponse.data.suggestions)
    } catch (err: any) {
      console.error("Analyze error:", err)
      const details = err.response?.data?.detail || err.message || "Please try again."
      alert("Analysis failed: " + details)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  })

  const matchedSkills = analysisResult?.matchingSkills ?? []
  const missingSkills = analysisResult?.missingSkills ?? []
  const topAts = analysisResult?.ats_score ?? 0
  const averageFitness = profile?.average_score ?? 0
  const assessmentsCount = profile?.total_assessments ?? history.length

  const safeTopAts = Number(topAts) || 0
  const safeAverageFitness = Number(averageFitness) || 0

  const suggestionItems = Array.isArray(analysisResult?.suggestions)
    ? analysisResult.suggestions
    : [
        "Upload your resume and compare it with a job description.",
        "Get tailored advice on skills and format improvements.",
        "Boost ATS compatibility with clear resume structure."
      ]

  console.log("TYPE: analysisResult?.suggestions", typeof analysisResult?.suggestions)
  console.log("VALUE: analysisResult?.suggestions", analysisResult?.suggestions)
  console.log("Array.isArray(analysisResult?.suggestions)", Array.isArray(analysisResult?.suggestions))
  console.log("TYPE: suggestions?.suggestions", typeof suggestions?.suggestions)
  console.log("VALUE: suggestions?.suggestions", suggestions?.suggestions)
  console.log("Array.isArray(suggestions?.suggestions)", Array.isArray(suggestions?.suggestions))

  return (
    <SketchyDashboardLayout
      title="Candidate Dashboard"
      role="INDIVIDUAL"
      headerAction={
        <Button variant="outline" size="sm" onClick={handleSync} className="gap-2 font-bold text-slate-900 rounded-xl border-2 border-slate-900">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Sync Data
        </Button>
      }
    >
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{getGreeting()}</p>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">{profile?.name || profile?.email?.split("@")[0] || "Candidate"}</h1>
            <p className="max-w-2xl text-slate-600 text-lg">Monitor your resume fitness, request AI guidance, and keep track of your recent assessments.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Today</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{formattedDate}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-400">Last synced</p>
            <p className="mt-1 text-slate-900">{lastSynced.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Average Fitness</p>
            <p className="text-4xl font-black text-slate-900">{safeAverageFitness.toFixed(0)}%</p>
            <p className="mt-3 text-sm text-slate-500">How well your resume matches your latest scans.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Assessments</p>
            <p className="text-4xl font-black text-slate-900">{assessmentsCount}</p>
            <p className="mt-3 text-sm text-slate-500">Total resume reviews completed.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">ATS Compatibility</p>
            <p className="text-4xl font-black text-slate-900">{safeTopAts.toFixed(0)}%</p>
            <p className="mt-3 text-sm text-slate-500">Estimated ATS readiness.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">AI Resume Insights</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Smart recommendations</h2>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full max-w-[240px] rounded-3xl bg-slate-900 hover:bg-black text-white py-4 font-bold"
            >
              {isAnalyzing ? "Running Analysis..." : "Run Analysis"}
            </Button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {suggestionItems.map((item: any, idx: number) => (
              <div key={idx} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-600">{typeof item === "object" ? (item.reason || item.suggestion || JSON.stringify(item)) : item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <SketchyCard className="p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Main Analysis Section</p>
                <h2 className="text-2xl font-black text-slate-900">Upload Resume & Paste JD</h2>
              </div>
              <Badge className="bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-widest px-3 py-2 rounded-full">
                {resumeFile?.name ? resumeFile.name : "No file selected"}
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">Upload Resume</p>
                <label className="block rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center cursor-pointer hover:border-slate-900 transition-colors">
                  <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileChange} />
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-900">
                    <FileText className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{resumeFile ? resumeFile.name : "Click to upload your resume"}</p>
                  <p className="text-sm text-slate-500">PDF, DOC, DOCX, or TXT.</p>
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Paste JD</p>
                  <span className="text-xs uppercase tracking-[0.35em] text-slate-400">Required</span>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  placeholder="Paste the job description here..."
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full rounded-3xl bg-slate-900 hover:bg-black text-white py-4 font-bold"
              >
                {isAnalyzing ? "Analyzing Resume..." : "Analyze Resume"}
              </Button>
            </div>
          </SketchyCard>

          <SketchyCard className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Resume Preview</p>
                <h2 className="text-2xl font-black text-slate-900">Preview</h2>
              </div>
              <Badge className="bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-widest px-3 py-2 rounded-full">
                Live
              </Badge>
            </div>
            <div className="min-h-[360px] rounded-3xl bg-slate-50 p-6 overflow-y-auto border border-slate-200">
              <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {resumeText || "Your resume preview will appear here after upload or paste."}
              </pre>
            </div>
          </SketchyCard>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Score Breakdown</p>
              <h2 className="text-2xl font-black text-slate-900">How your resume scored</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Skills", value: analysisResult?.breakdown?.skillMatch ?? 0 },
              { label: "Experience", value: analysisResult?.breakdown?.experience ?? 0 },
              { label: "Keywords", value: analysisResult?.breakdown?.keywords ?? 0 },
              { label: "Formatting", value: analysisResult?.breakdown?.formatting ?? 0 }
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-bold mb-3">{item.label}</p>
                <p className="text-4xl font-black text-slate-900">{item.value}%</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <SketchyCard className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-bold">Skills Section</p>
                <h2 className="text-xl font-black text-slate-900">Matched Skills</h2>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 text-xs uppercase tracking-widest px-3 py-2 rounded-full">
                {matchedSkills.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              {(matchedSkills.length > 0 ? matchedSkills : ["No matched skills yet."]).map((skill: any, idx: number) => (
                <span key={idx} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  {typeof skill === "object" ? (skill.requirement || skill.skill || JSON.stringify(skill)) : skill}
                </span>
              ))}
            </div>
          </SketchyCard>

          <SketchyCard className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-bold">Skills Section</p>
                <h2 className="text-xl font-black text-slate-900">Missing Skills</h2>
              </div>
              <Badge className="bg-rose-100 text-rose-700 text-xs uppercase tracking-widest px-3 py-2 rounded-full">
                {missingSkills.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              {(missingSkills.length > 0 ? missingSkills : ["No missing skills yet."]).map((skill: any, idx: number) => (
                <span key={idx} className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">
                  {typeof skill === "object" ? (skill.requirement || skill.skill || JSON.stringify(skill)) : skill}
                </span>
              ))}
            </div>
          </SketchyCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <SketchyCard className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-bold">Analytics</p>
                <h2 className="text-xl font-black text-slate-900">ATS Trends</h2>
              </div>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-500"><span>Current ATS Score</span><span>{safeTopAts.toFixed(0)}%</span></div>
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-slate-900" style={{ width: `${safeTopAts}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-500"><span>Resume Fit Trend</span><span>{Number(analysisResult?.breakdown?.skillMatch ?? 0).toFixed(0)}%</span></div>
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${Number(analysisResult?.breakdown?.skillMatch ?? 0)}%` }} />
                </div>
              </div>
            </div>
          </SketchyCard>

          <SketchyCard className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-bold">Analytics</p>
                <h2 className="text-xl font-black text-slate-900">Performance Charts</h2>
              </div>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-500"><span>Formatting</span><span>{analysisResult?.breakdown?.formatting ?? 0}%</span></div>
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${analysisResult?.breakdown?.formatting ?? 0}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-500"><span>Experience</span><span>{analysisResult?.breakdown?.experience ?? 0}%</span></div>
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-600" style={{ width: `${analysisResult?.breakdown?.experience ?? 0}%` }} />
                </div>
              </div>
            </div>
          </SketchyCard>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-bold">Recent History</p>
              <h2 className="text-2xl font-black text-slate-900">Previous uploads & scores</h2>
            </div>
          </div>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-slate-900">Assessment {item.id}</p>
                    <p className="text-sm text-slate-500 mt-1">{new Date(item.completed_at).toLocaleDateString()}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm text-slate-700">
                    <div className="rounded-3xl bg-white p-3 border border-slate-200">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400 font-bold">Score</p>
                      <p className="text-xl font-black text-slate-900">{item.overall_score}%</p>
                    </div>
                    <div className="rounded-3xl bg-white p-3 border border-slate-200">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400 font-bold">Integrity</p>
                      <p className="text-xl font-black text-slate-900">{item.integrity_score}%</p>
                    </div>
                    <div className="rounded-3xl bg-white p-3 border border-slate-200">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400 font-bold">Technical</p>
                      <p className="text-xl font-black text-slate-900">{item.mcq_score}%</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">No previous assessments found. Start by taking an assessment or analyzing your resume.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </SketchyDashboardLayout>
  )
}
