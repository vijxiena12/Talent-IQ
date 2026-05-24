import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Calendar,
  Filter
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SketchyDashboardLayout } from "@/components/SketchyDashboardLayout"
import { SketchyCard } from "@/components/SketchyCard"

const metrics = [
  { label: "Hire Rate", val: "14.2%", change: "+2.4%", icon: Target, color: "text-amber-800", bg: "bg-amber-100" },
  { label: "Time to Fill", val: "18 days", change: "-4 days", icon: Clock, color: "text-emerald-800", bg: "bg-emerald-100" },
  { label: "Cost per Hire", val: "$1,240", change: "-12%", icon: TrendingUp, color: "text-rose-800", bg: "bg-rose-100" },
  { label: "Talent Pool", val: "4,821", change: "+420", icon: Users, color: "text-indigo-800", bg: "bg-indigo-100" },
]

export default function Analytics() {
  return (
    <SketchyDashboardLayout 
      title="Analytics" 
      role="RECRUITER"
      headerAction={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-800 rounded-xl gap-2 font-bold h-10 px-4">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-800 rounded-xl gap-2 font-bold h-10 px-4">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      }
    >
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Hiring Performance</h1>
            <p className="text-slate-500 font-medium">Deep dive into your recruitment funnel and team efficiency.</p>
          </div>
          <Button className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all h-12 px-6 flex items-center gap-2">
            Download Full Report
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={item.label}
              className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-900 hover:border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] hover:shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[-1px] transition-all text-left relative"
              style={{ filter: "url(#squiggle)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl border-2 border-slate-900 ${item.bg} ${item.color} flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_#000]`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <Badge className="rounded-xl px-2 py-0.5 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000] font-bold text-[9px] uppercase tracking-wider bg-white text-slate-800" variant="outline">
                  {item.change}
                </Badge>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">{item.label}</h3>
                <span className="text-3xl font-black text-slate-900 tracking-tight">{item.val}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              Candidate Flow
              <Badge className="bg-yellow-250 border-2 border-slate-900 text-slate-900 shadow-[1px_1px_0px_0px_#000] text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider">
                Funnel View
              </Badge>
            </h2>
            
            <div 
              className="h-96 rounded-[2.5rem] bg-white border-2 border-slate-900 p-8 flex flex-col justify-end relative group overflow-hidden shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]"
              style={{ filter: "url(#squiggle)" }}
            >
              <div className="absolute top-0 right-0 p-8">
                <BarChart3 className="w-12 h-12 text-slate-200 group-hover:text-amber-250 transition-colors" />
              </div>
              <div className="flex items-end gap-3 h-full pb-2">
                {[40, 70, 45, 90, 65, 80, 55, 75, 60, 85].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1 }}
                    className="flex-1 bg-yellow-100 border-2 border-slate-900 rounded-t-xl group-hover:bg-yellow-200 transition-colors relative shadow-[2px_2px_0px_0px_#000]"
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}%
                    </div>
                  </motion.div>
                ))}
              </div>
              <Separator className="bg-slate-900 border-t-2 border-slate-900" />
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <PieChartIcon className="w-5 h-5 text-indigo-650" />
              Departments
            </h3>
            <div 
              className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] relative overflow-hidden group space-y-8"
              style={{ filter: "url(#squiggle)" }}
            >
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <div className="absolute w-44 h-44 rounded-full border-4 border-slate-900 bg-yellow-200 shadow-[2px_2px_0px_0px_#000]" />
                <div className="absolute w-32 h-32 rounded-full border-4 border-slate-900 bg-emerald-100 shadow-[2px_2px_0px_0px_#000]" />
                <div className="absolute w-20 h-20 rounded-full border-4 border-slate-900 bg-rose-100 shadow-[2px_2px_0px_0px_#000]" />
                <div className="absolute z-10 flex flex-col items-center justify-center">
                  <p className="text-2xl font-black text-slate-900 leading-none">42%</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider font-mono">Eng</p>
                </div>
              </div>
              <div className="space-y-4 font-bold text-xs uppercase tracking-wider">
                {[
                  { label: "Engineering", color: "bg-yellow-200", val: "42%" },
                  { label: "Design", color: "bg-emerald-100", val: "28%" },
                  { label: "Product", color: "bg-rose-100", val: "30%" }
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-md border-2 border-slate-900 ${d.color} shadow-[1px_1px_0px_0px_#000]`} />
                      <span className="text-slate-650 font-bold">{d.label}</span>
                    </div>
                    <span className="text-slate-950 font-black">{d.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SketchyDashboardLayout>
  )
}

