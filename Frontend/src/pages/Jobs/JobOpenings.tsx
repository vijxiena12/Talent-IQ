import { 
  LayoutGrid, 
  Search, 
  Plus, 
  MoreVertical,
  Users,
  Clock,
  Briefcase,
  MapPin,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SketchyDashboardLayout } from "@/components/SketchyDashboardLayout"
import { SketchyCard } from "@/components/SketchyCard"

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    applicants: 124,
    status: "Active",
    posted: "2 days ago",
    trend: "+12%"
  },
  {
    id: 2,
    title: "Backend Developer",
    department: "Engineering",
    location: "New York, NY",
    applicants: 86,
    status: "Active",
    posted: "4 days ago",
    trend: "+5%"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Design",
    location: "London, UK",
    applicants: 42,
    status: "Closed",
    posted: "1 week ago",
    trend: "0%"
  },
  {
    id: 4,
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    applicants: 63,
    status: "Active",
    posted: "3 days ago",
    trend: "+18%"
  }
]

export default function JobOpenings() {
  const activeCount = jobs.filter(j => j.status === 'Active').length
  const totalApplicants = jobs.reduce((acc, j) => acc + j.applicants, 0)
  
  return (
    <SketchyDashboardLayout 
      title="Job Openings" 
      role="RECRUITER"
      headerAction={
        <Button className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all h-10 cursor-pointer flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      }
    >
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Hiring Pipeline</h1>
            <p className="text-slate-500 font-medium">Track your active job postings and recruitment progress.</p>
          </div>
        </div>

        {/* Pipeline Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SketchyCard className="bg-amber-100 text-center relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-amber-200 border-2 border-slate-900 flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#000]">
              <Briefcase className="w-6 h-6 text-slate-800" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Openings</p>
            <p className="text-3xl font-black text-slate-900">{jobs.length}</p>
          </SketchyCard>

          <SketchyCard className="bg-emerald-100 text-center relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-200 border-2 border-slate-900 flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#000]">
              <Users className="w-6 h-6 text-slate-800" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Roles</p>
            <p className="text-3xl font-black text-slate-900">{activeCount}</p>
          </SketchyCard>

          <SketchyCard className="bg-indigo-100 text-center relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-indigo-200 border-2 border-slate-900 flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#000]">
              <TrendingUp className="w-6 h-6 text-slate-800" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Applicants</p>
            <p className="text-3xl font-black text-slate-900">{totalApplicants}</p>
          </SketchyCard>

          <SketchyCard className="bg-rose-100 text-center relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-rose-200 border-2 border-slate-900 flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#000]">
              <Clock className="w-6 h-6 text-slate-800" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg. Time-to-Fill</p>
            <p className="text-3xl font-black text-slate-900">18 Days</p>
          </SketchyCard>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {jobs.map((job, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={job.id}
              className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] hover:shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[-2px] transition-all group"
              style={{ filter: "url(#squiggle)" }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-slate-900 text-slate-800 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-650 transition-colors tracking-tight">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <Separator orientation="vertical" className="h-3 bg-slate-900/20" />
                      <span className="text-xs font-black text-indigo-650 uppercase tracking-wider">
                        {job.department}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={`rounded-xl px-3 py-1 font-bold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] ${
                  job.status === 'Active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 text-slate-600'
                }`} variant="outline">
                  {job.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applicants</p>
                  <p className="text-xl font-black text-slate-900">{job.applicants}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trend</p>
                  <p className="text-xl font-black text-emerald-700">{job.trend}</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Left</p>
                  <p className="text-xl font-black text-rose-700">14d</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-slate-900/10">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock className="w-4 h-4" />
                  Posted {job.posted}
                </div>
                <Button className="bg-yellow-100 hover:bg-yellow-200 text-slate-900 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[-1px] transition-all gap-2 font-bold px-4 py-2 text-xs">
                  Manage Pipeline
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SketchyDashboardLayout>
  )
}

