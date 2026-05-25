import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Briefcase, 
  Upload, 
  Users, 
  TrendingUp, 
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  X,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  ArrowUpRight,
  Zap
} from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { api } from "@/lib/api"
import { SketchyDashboardLayout } from "@/components/SketchyDashboardLayout"

interface Job {
  id: number
  title: string
  raw_text: string
  requirements: string[]
  created_at: string
  resume_count: number
}

interface Candidate {
  id: number
  candidate_email: string
  file_name: string
  ats_score: number
  matching_skills: { requirement: string; similarity_score: number }[]
  missing_skills: { requirement: string; similarity_score: number }[]
  uploaded_at: string
}

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [isBulkUploading, setIsBulkUploading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCandidateModal, setShowCandidateModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const [newJobTitle, setNewJobTitle] = useState("")
  const [newJobText, setNewJobText] = useState("")
  const [newJobRequirements, setNewJobRequirements] = useState("")

  // Real-time polling every 30 seconds
  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedJob) {
      const interval = setInterval(() => fetchCandidates(selectedJob.id), 10000)
      return () => clearInterval(interval)
    }
  }, [selectedJob])

  const fetchJobs = async () => {
    const userStr = localStorage.getItem("user")
    if (!userStr) return
    const user = JSON.parse(userStr)
    const userId = user.id

    try {
      const res = await api.get(`/jobs?user_id=${userId}`)
      setJobs(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchCandidates = async (jobId: number) => {
    try {
      const res = await api.get(`/recruiter/candidates/${jobId}`)
      setCandidates(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const createJob = async () => {
    if (!newJobTitle || !newJobText) return
    const userStr = localStorage.getItem("user")
    if (!userStr) return
    const user = JSON.parse(userStr)
    const userId = user.id

    setLoading(true)
    try {
      const requirements = newJobRequirements.split("\n").filter(r => r.trim())
      await api.post(`/jobs?user_id=${userId}`, {
        title: newJobTitle,
        raw_text: newJobText,
        requirements
      })
      setShowCreateModal(false)
      setNewJobTitle("")
      setNewJobText("")
      setNewJobRequirements("")
      fetchJobs()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (jobId: number) => {
    const userStr = localStorage.getItem("user")
    if (!userStr) return
    const user = JSON.parse(userStr)
    const userId = user.id

    if (!window.confirm("Are you sure you want to delete this job opening? This will also delete all associated resumes and assessments.")) return
    try {
      await api.delete(`/jobs/${jobId}?user_id=${userId}`)
      if (selectedJob?.id === jobId) setSelectedJob(null)
      fetchJobs()
    } catch (err) {
      console.error(err)
      alert("Failed to delete job.")
    }
  }

  const selectJob = async (job: Job) => {
    setSelectedJob(job)
    setCandidates([])
    setLoading(true)
    await fetchCandidates(job.id)
    setLoading(false)
  }

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedJob || !e.target.files) return
    setIsBulkUploading(true)
    const formData = new FormData()
    formData.append("job_id", selectedJob.id.toString())
    Array.from(e.target.files).forEach(file => {
      formData.append("files", file)
    })

    try {
      await api.post(`/recruiter/upload-resumes`, formData)
      fetchCandidates(selectedJob.id)
      fetchJobs()
    } catch (err) {
      console.error(err)
      alert("Bulk upload failed. Ensure the backend is active.")
    } finally {
      setIsBulkUploading(false)
    }
  }

  const sortedCandidates = [...candidates].sort((a, b) => b.ats_score - a.ats_score)

  return (
    <SketchyDashboardLayout
      title="Recruiter Command Center"
      role="RECRUITER"
      headerAction={
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="animate-pulse bg-emerald-50 text-emerald-700 border-2 border-slate-900 gap-1 rounded-xl shadow-[2px_2px_0px_0px_#000] px-3 py-1 font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Live Monitoring
           </Badge>
           <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-650 hover:bg-indigo-700 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] border-2 border-slate-900 text-white font-bold rounded-xl transition-all duration-100 cursor-pointer h-10"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Opening
            </Button>
        </div>
      }
    >
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Jobs List Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Openings</h3>
            <Badge className="bg-slate-900 border-2 border-slate-900 text-white shadow-[2px_2px_0px_0px_#000]">{jobs.length}</Badge>
          </div>
          
          <div className="space-y-4">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ scale: 1.01, rotate: 0.5 }}
                onClick={() => selectJob(job)}
                className={`p-5 rounded-3xl border-2 border-slate-900 cursor-pointer transition-all ${
                  selectedJob?.id === job.id 
                    ? "bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]" 
                    : "bg-white shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]"
                }`}
                style={{ filter: "url(#squiggle)" }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-xl border-2 border-slate-900 ${selectedJob?.id === job.id ? "bg-slate-900 text-white" : "bg-white text-slate-500 shadow-[1px_1px_0px_0px_#000]"}`}>
                       <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest border-2 border-slate-900 bg-white shadow-[1px_1px_0px_0px_#000]">{job.resume_count} Resumes</Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-slate-900 rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteJob(job.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">{job.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {jobs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-450 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                <Briefcase className="w-10 h-10 mx-auto mb-4 text-slate-350" />
                <p className="text-sm font-bold text-slate-450">No active job openings</p>
              </div>
            )}
          </div>
        </div>

            {/* Candidates Leaderboard */}
            <div className="lg:col-span-3 space-y-6">
              {selectedJob ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedJob.title}</h2>
                      <p className="text-slate-500 font-medium">Top ranking candidates based on ATS compatibility and skill matching.</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="relative">
                          <input 
                            type="file" 
                            multiple 
                            id="bulk-upload" 
                            className="hidden" 
                            onChange={handleBulkUpload} 
                            disabled={isBulkUploading}
                          />
                          <Button 
                            asChild 
                            disabled={isBulkUploading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all h-12 cursor-pointer flex items-center"
                          >
                            <label htmlFor="bulk-upload" className="cursor-pointer flex items-center">
                              {isBulkUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                              Bulk Upload Resumes
                            </label>
                          </Button>
                       </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="py-20 flex justify-center">
                       <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
                    </div>
                  ) : sortedCandidates.length > 0 ? (
                    <div className="grid gap-6">
                      {sortedCandidates.map((candidate, idx) => (
                        <motion.div
                          key={candidate.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => {
                            setSelectedCandidate(candidate)
                            setShowCandidateModal(true)
                          }}
                          className="p-6 rounded-3xl bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] hover:shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] transition-all cursor-pointer group"
                          style={{ filter: "url(#squiggle)" }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl border-2 border-slate-900 flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_#000] ${
                                idx === 0 ? "bg-amber-200 text-amber-800" :
                                idx === 1 ? "bg-slate-100 text-slate-850" :
                                idx === 2 ? "bg-orange-100 text-orange-800" :
                                "bg-white text-slate-400"
                              }`}>
                                {idx + 1}
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-650 transition-colors">{candidate.candidate_email}</h4>
                                <div className="flex flex-wrap items-center gap-3">
                                  <Badge variant="outline" className="text-[10px] font-bold border-2 border-slate-900 bg-white shadow-[1px_1px_0px_0px_#000]">{candidate.file_name}</Badge>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    AI Scored
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-8">
                               <div className="text-right">
                                  <div className="text-3xl font-black text-slate-900 leading-none">{candidate.ats_score.toFixed(0)}%</div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ATS Match</div>
                               </div>
                               <div className="h-10 w-10 rounded-xl bg-white border-2 border-slate-900 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-[2px_2px_0px_0px_#000] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
                                  <ArrowUpRight className="w-5 h-5" />
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-20 text-center border-2 border-slate-900 rounded-3xl bg-white shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]" style={{ filter: "url(#squiggle)" }}>
                       <div className="w-20 h-20 bg-slate-50 border-2 border-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#000]">
                          <Users className="w-10 h-10 text-slate-400" />
                       </div>
                       <h3 className="text-2xl font-black text-slate-900">No candidates analyzed yet</h3>
                       <p className="text-slate-550 max-w-sm mx-auto mt-2 font-medium">Upload multiple resumes to see them ranked by our AI engine in real-time.</p>
                       <Button asChild className="mt-8 bg-slate-900 hover:bg-black border-2 border-slate-900 text-white font-bold rounded-xl shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] cursor-pointer">
                          <label htmlFor="bulk-upload" className="cursor-pointer">Upload First Batch</label>
                       </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]" style={{ filter: "url(#squiggle)" }}>
                   <div className="w-32 h-32 bg-indigo-50 border-2 border-slate-900 text-indigo-650 rounded-3xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                      <Briefcase className="w-16 h-16" />
                   </div>
                   <div className="space-y-2">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recruiter Command Center</h2>
                     <p className="text-slate-550 font-medium max-w-md">Select an active job opening from the sidebar to view candidate rankings and process resumes.</p>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Modals */}
          <AnimatePresence>
            {showCreateModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-3xl p-10 w-full max-w-2xl border-3 border-slate-900 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]" style={{ filter: "url(#squiggle)" }}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Job Opening</h3>
                    <Button variant="ghost" size="icon" className="rounded-full border border-transparent hover:border-slate-900" onClick={() => setShowCreateModal(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Job Title</label>
                      <Input placeholder="Senior Software Engineer..." value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} className="h-14 rounded-2xl border-2 border-slate-900 focus-visible:ring-0 focus-visible:border-slate-900 shadow-[2px_2px_0px_0px_#000] font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Job Description</label>
                      <textarea placeholder="The ideal candidate..." value={newJobText} onChange={(e) => setNewJobText(e.target.value)} className="w-full h-32 p-4 rounded-2xl border-2 border-slate-900 focus:ring-0 focus:border-slate-900 outline-none transition-all resize-none shadow-[2px_2px_0px_0px_#000] font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Technical Requirements (One per line)</label>
                      <textarea placeholder="React.js&#10;FastAPI&#10;PostgreSQL" value={newJobRequirements} onChange={(e) => setNewJobRequirements(e.target.value)} className="w-full h-32 p-4 rounded-2xl border-2 border-slate-900 focus:ring-0 focus:border-slate-900 outline-none transition-all resize-none font-mono text-xs font-bold bg-slate-50 shadow-[2px_2px_0px_0px_#000]" />
                    </div>
                    <Button onClick={createJob} disabled={loading || !newJobTitle || !newJobText} className="w-full h-16 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all cursor-pointer">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : "Post Job Opening"}
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
            
            {showCandidateModal && selectedCandidate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCandidateModal(false)} />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-3xl p-12 w-full max-w-3xl border-3 border-slate-900 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] max-h-[90vh] overflow-y-auto" style={{ filter: "url(#squiggle)" }}>
                  <div className="flex items-start justify-between mb-10">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white border-2 border-slate-900 flex items-center justify-center text-3xl font-black shadow-[3px_3px_0px_0px_#000]">
                          {selectedCandidate.candidate_email.charAt(0).toUpperCase()}
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedCandidate.candidate_email}</h3>
                          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Processed: {new Date(selectedCandidate.uploaded_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full border border-transparent hover:border-slate-900" onClick={() => setShowCandidateModal(false)}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="p-8 rounded-[2rem] border-2 border-slate-900 bg-indigo-50 space-y-2 shadow-[4px_4px_0px_0px_#000]">
                         <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">AI Matching Score</h4>
                         <p className="text-6xl font-black text-indigo-750">{selectedCandidate.ats_score.toFixed(0)}%</p>
                         <Progress value={selectedCandidate.ats_score} className="h-3 bg-indigo-200 border-2 border-slate-900 rounded-full" />
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
                           Matching Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.matching_skills.map((skill, idx) => (
                            <Badge key={idx} className="bg-emerald-50 text-emerald-700 border-2 border-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-[2px_2px_0px_0px_#000]">
                              {skill.requirement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-900" />
                           Missing Prerequisites
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.missing_skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="bg-rose-50 text-rose-700 border-2 border-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-[2px_2px_0px_0px_#000]">
                              {skill.requirement}
                            </Badge>
                          ))}
                          {selectedCandidate.missing_skills.length === 0 && (
                            <p className="text-sm font-bold text-emerald-650 italic">No missing skills detected! Perfect match.</p>
                          )}
                        </div>
                      </div>
                      
                      <Separator className="bg-slate-900/10" />
                      
                      <div className="space-y-4">
                         <Button className="w-full h-14 bg-emerald-650 hover:bg-emerald-700 font-bold border-2 border-slate-900 rounded-2xl gap-2 shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] text-white transition-all cursor-pointer">
                            <CheckCircle2 className="w-5 h-5" />
                            Invite to Interview
                         </Button>
                         <Button variant="outline" className="w-full h-14 border-2 border-slate-900 font-bold rounded-2xl bg-white shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all cursor-pointer">
                            Download Resume (PDF)
                         </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
    </SketchyDashboardLayout>
  )
}