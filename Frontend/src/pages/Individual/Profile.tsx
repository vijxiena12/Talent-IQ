import { ChangeEvent, useEffect, useState } from "react"
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SketchyDashboardLayout } from "@/components/SketchyDashboardLayout"
import { SketchyCard } from "@/components/SketchyCard"
import { api, API_BASE } from "@/lib/api"

interface ExperienceItem {
  role: string
  company: string
  period: string
  description: string
}

interface ProjectItem {
  title: string
  description: string
}

interface ResumeProfile {
  name: string
  title: string
  location: string
  email: string
  phone: string
  summary: string
  skills: string[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  ats_score: number
  resume_url?: string
}

const defaultProfile: ResumeProfile = {
  name: "Candidate User",
  title: "Full Stack Engineer",
  location: "San Francisco, CA",
  email: "candidate@example.com",
  phone: "+1 (555) 000-0000",
  summary: "Results-driven engineer with a strong focus on building scalable web applications and optimizing resume performance for modern hiring pipelines.",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "GraphQL"],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "TechFlow Systems",
      period: "2021 - Present",
      description: "Led the development of enterprise analytics tools used by thousands of customers."
    },
    {
      role: "Full Stack Developer",
      company: "Innovate AI",
      period: "2019 - 2021",
      description: "Built AI-powered recruitment features and optimized frontend performance for enterprise dashboards."
    }
  ],
  projects: [
    {
      title: "Resume Intelligence Dashboard",
      description: "Created an AI-driven dashboard that analyzes resumes and provides actionable ATS optimization advice."
    },
    {
      title: "Interview Prep Suite",
      description: "Built a real-time interview simulator with proctored voice prompts and question tracking."
    }
  ],
  ats_score: 82,
}

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<ResumeProfile>(defaultProfile)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [lastParsed, setLastParsed] = useState("")

  const fetchProfile = async () => {
    try {
      const response = await api.get("/individual/profile")
      if (response.data && response.data.has_profile && response.data.profile) {
        setProfile(response.data.profile)
        setHasProfile(true)
      } else {
        setHasProfile(false)
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err)
      setHasProfile(false)
    }
  }

  const handleDownloadResume = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!profile.resume_url) return
    
    const url = profile.resume_url.startsWith("http") 
      ? profile.resume_url 
      : `${API_BASE.replace(/\/api$/, "")}${profile.resume_url}`
      
    try {
      const response = await api.get(url, { responseType: "blob" })
      const contentType = response.headers["content-type"] || "application/pdf"
      const file = new Blob([response.data], { type: contentType })
      const fileURL = URL.createObjectURL(file)
      window.open(fileURL, "_blank")
    } catch (err) {
      console.error("Error downloading resume:", err)
      alert("Failed to view the resume. Please check the backend connection.")
    }
  }

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const parsedUser = JSON.parse(userStr)
      setUser(parsedUser)
    }
    fetchProfile()
  }, [])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setResumeFile(file)
  }

  const handleAnalyze = async () => {
    if (!resumeFile) {
      alert("Please select a resume file first.")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)
      formData.append("jd", "Resume Profile Analysis")
      formData.append("job_title", "Profile Analysis")

      await api.post("/assessment/analyze", formData)
      
      // Successfully analyzed! Now fetch the updated profile from the backend.
      await fetchProfile()
      
      setLastParsed(new Date().toLocaleString())
    } catch (err: any) {
      console.error("Profile analyze failed", err)
      alert("Failed to parse resume: " + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SketchyDashboardLayout
      title="My Profile"
      role="INDIVIDUAL"
      headerAction={
        <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2 text-slate-900 border-2 border-slate-900">
          <ShieldCheck className="w-4 h-4" />
          Sync Resume
        </Button>
      }
    >
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          {!hasProfile ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm text-center flex flex-col items-center justify-center min-h-[450px]">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-900">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">No Profile Generated Yet</h2>
              <p className="text-slate-500 max-w-md mt-4 leading-relaxed">
                Upload your resume in the card on the right to dynamically extract your professional highlights, skills, and projects!
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Resume Profile</p>
                  <h1 className="text-4xl font-black text-slate-900 mt-3">{profile.name}</h1>
                  <p className="text-slate-500 mt-2">{profile.title} • {profile.location}</p>
                </div>
                <div className="space-y-2 text-right">
                  <Badge className="bg-emerald-100 text-emerald-700">ATS {profile.ats_score}%</Badge>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Last updated</p>
                  <p className="text-sm text-slate-700">{lastParsed || "Auto-extracted"}</p>
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 font-bold">Contact</h2>
                  <div className="space-y-2 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400 font-bold">Resume Link</h2>
                  {profile.resume_url ? (
                    <a 
                      href="#"
                      onClick={handleDownloadResume} 
                      className="inline-flex items-center gap-2 text-slate-900 font-semibold underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View uploaded resume
                    </a>
                  ) : (
                    <p className="text-slate-500">Upload a resume to generate a live preview link.</p>
                  )}
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <h2 className="text-xl font-black text-slate-900">Summary</h2>
                <p className="text-slate-600 leading-relaxed">{profile.summary}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <SketchyCard className="p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Resume Upload</p>
                  <h2 className="text-2xl font-black text-slate-900">Load Your Latest CV</h2>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <label className="block rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center cursor-pointer hover:border-slate-900 transition-all">
                  <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileChange} />
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-900">
                    <FileText className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{resumeFile ? resumeFile.name : "Click to upload your resume"}</p>
                  <p className="text-sm text-slate-500">PDF, DOC, DOCX or TXT</p>
                </label>

                <Button onClick={handleAnalyze} disabled={loading} className="w-full rounded-3xl bg-slate-900 hover:bg-black text-white py-4 font-bold">
                  {loading ? "Parsing resume..." : "Parse Resume"}
                </Button>
              </div>
            </SketchyCard>

            <SketchyCard className="p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Skills</p>
                  <h2 className="text-2xl font-black text-slate-900">Your Top Keywords</h2>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 uppercase tracking-widest text-xs px-3 py-2 rounded-full">
                  {profile.skills ? profile.skills.length : 0}
                </Badge>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No skills keywords extracted yet.</p>
                )}
              </div>
            </SketchyCard>
          </div>
        </div>

        {hasProfile && (
          <div className="grid gap-6 xl:grid-cols-2">
            <SketchyCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Experience</p>
                  <h2 className="text-2xl font-black text-slate-900">Career Highlights</h2>
                </div>
                <Badge className="bg-slate-100 text-slate-900 uppercase tracking-widest text-xs px-3 py-2 rounded-full">
                  {profile.experience ? profile.experience.length : 0} roles
                </Badge>
              </div>
              <div className="space-y-6">
                {profile.experience && profile.experience.length > 0 ? (
                  profile.experience.map((exp) => (
                    <div key={exp.role + exp.company} className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">{exp.role}</h3>
                          <p className="text-sm text-slate-500 uppercase tracking-wider">{exp.company}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">{exp.period}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No experience highlights extracted yet.</p>
                )}
              </div>
            </SketchyCard>

            <SketchyCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Projects</p>
                  <h2 className="text-2xl font-black text-slate-900">Recent Work</h2>
                </div>
                <Badge className="bg-slate-100 text-slate-900 uppercase tracking-widest text-xs px-3 py-2 rounded-full">
                  {profile.projects ? profile.projects.length : 0}
                </Badge>
              </div>
              <div className="space-y-6">
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((project) => (
                    <div key={project.title} className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-black text-slate-900">{project.title}</h3>
                        <Badge className="bg-slate-900 text-white uppercase tracking-widest text-[10px] px-3 py-2 rounded-full">Featured</Badge>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{project.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No projects extracted yet.</p>
                )}
              </div>
            </SketchyCard>
          </div>
        )}
      </div>
    </SketchyDashboardLayout>
  )
}
