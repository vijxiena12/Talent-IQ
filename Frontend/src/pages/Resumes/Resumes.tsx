import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  ExternalLink,
  Plus,
  ArrowUpDown,
  Zap,
  TrendingUp
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { SketchyDashboardLayout } from "@/components/SketchyDashboardLayout"
import { SketchyCard } from "@/components/SketchyCard"

const resumes = [
  { 
    id: 1,
    name: "Sarah Johnson", 
    role: "Senior Frontend Engineer", 
    experience: "8 years",
    score: 94, 
    status: "Shortlisted", 
    date: "2024-03-20" 
  },
  { 
    id: 2,
    name: "Michael Chen", 
    role: "Backend Developer", 
    experience: "5 years",
    score: 82, 
    status: "Under Review", 
    date: "2024-03-19" 
  },
  { 
    id: 3,
    name: "Emily Rodriguez", 
    role: "UI/UX Designer", 
    experience: "4 years",
    score: 65, 
    status: "Screened", 
    date: "2024-03-19" 
  },
  { 
    id: 4,
    name: "David Kim", 
    role: "Data Scientist", 
    experience: "6 years",
    score: 89, 
    status: "Shortlisted", 
    date: "2024-03-18" 
  },
  { 
    id: 5, 
    name: "Anna Smith", 
    role: "Product Manager", 
    experience: "7 years",
    score: 74, 
    status: "Under Review", 
    date: "2024-03-17" 
  },
]

export default function Resumes() {
  return (
    <SketchyDashboardLayout 
      title="Resumes" 
      role="RECRUITER"
      headerAction={
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#000] font-bold h-10 px-4">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all h-10 cursor-pointer flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Upload New
          </Button>
        </div>
      }
    >
      <div className="space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Resume Database</h1>
          <p className="text-slate-500 font-medium">Manage and review all processed resumes in one place.</p>
        </div>

        {/* AI Screening Box */}
        <div 
          className="p-6 md:p-8 bg-amber-50 rounded-[2.5rem] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]"
          style={{ filter: "url(#squiggle)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-yellow-200 border-2 border-slate-900 flex items-center justify-center shadow-[1px_1px_0px_0px_#000]">
              <Zap className="w-4 h-4 text-slate-800" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Run AI Screening</h3>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resume PDF File</label>
              <input 
                id="resume-file" 
                type="file" 
                accept=".pdf"
                className="p-3 bg-white border-2 border-slate-900 rounded-xl font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-2 file:border-slate-900 file:bg-amber-100 file:font-black file:text-xs file:cursor-pointer" 
              />
            </div>
            <div className="flex-1 lg:flex-[2] flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Description / Requirements</label>
              <textarea 
                id="jd-text" 
                placeholder="Paste requirements or job description here to analyze compatibility..." 
                className="p-3 bg-white border-2 border-slate-900 rounded-xl font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none min-h-[90px]" 
              />
            </div>
            <div className="flex justify-end items-end">
              <Button
                onClick={async () => {
                  const fileInput = document.getElementById("resume-file") as HTMLInputElement
                  const jdText = (document.getElementById("jd-text") as HTMLTextAreaElement).value
                  if (!fileInput.files || fileInput.files.length === 0) {
                    alert("Please choose a resume PDF to upload")
                    return
                  }
                  const fd = new FormData()
                  fd.append("resume", fileInput.files[0])
                  fd.append("jd_text", jdText)

                  try {
                    const resp = await api.post("/assessment/analyze", fd)
                    const data = resp.data
                    alert("Screening complete. ATS score: " + (data.ats_result?.ats_score ?? "N/A"))
                  } catch (err: any) {
                    alert("Analysis failed: " + (err.response?.data?.detail || err.message))
                  }
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all h-12 px-6 w-full lg:w-auto"
              >
                Run Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div 
          className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-5 rounded-[2rem] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]"
          style={{ filter: "url(#squiggle)" }}
        >
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by name, role, or skill..." 
              className="pl-11 border-2 border-slate-900 rounded-xl focus-visible:ring-indigo-500 font-bold bg-slate-50/50"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="ghost" size="sm" className="text-slate-850 hover:bg-slate-100 border-2 border-transparent hover:border-slate-900 rounded-xl font-bold gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-850 hover:bg-slate-100 border-2 border-transparent hover:border-slate-900 rounded-xl font-bold gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Resumes Table */}
        <div 
          className="bg-white rounded-[2rem] border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] overflow-hidden" 
          style={{ filter: "url(#squiggle)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-amber-50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-800 uppercase tracking-widest font-mono">Candidate</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-800 uppercase tracking-widest font-mono">Exp.</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-800 uppercase tracking-widest font-mono">AI Score</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-800 uppercase tracking-widest font-mono">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-800 uppercase tracking-widest font-mono text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-900/10">
                {resumes.map((resume, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={resume.id} 
                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                          {resume.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">{resume.name}</div>
                          <div className="text-xs text-slate-400 font-bold">{resume.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-650">{resume.experience}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3.5 w-20 bg-slate-100 rounded-xl border-2 border-slate-900 overflow-hidden">
                          <div 
                            className={`h-full ${
                              resume.score >= 80 ? 'bg-emerald-400' : 
                              resume.score >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${resume.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-900">{resume.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={`rounded-xl px-3 py-1 font-bold text-[10px] uppercase tracking-wider border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000] ${
                        resume.status === 'Shortlisted' ? 'bg-indigo-100 text-indigo-850' :
                        resume.status === 'Under Review' ? 'bg-amber-100 text-amber-850' :
                        'bg-slate-150 text-slate-700'
                      }`} variant="outline">
                        {resume.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-800 border-2 border-transparent hover:border-slate-900 hover:bg-slate-100 rounded-lg">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-800 border-2 border-transparent hover:border-slate-900 hover:bg-slate-100 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SketchyDashboardLayout>
  )
}

