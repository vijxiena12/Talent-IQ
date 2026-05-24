import { 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  AlertCircle,
  Zap,
  Target,
  ZapOff,
  Lightbulb,
  ArrowUpRight
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SketchyDashboardLayout } from "@/components/SketchyDashboardLayout"
import { SketchyCard } from "@/components/SketchyCard"

const insights = [
  {
    title: "Skill Gap Analysis",
    description: "Candidates are lacking advanced React patterns like RSC and Server Actions in recent batches.",
    impact: "High",
    icon: Target,
    color: "text-red-700",
    bg: "bg-red-100"
  },
  {
    title: "Source Quality",
    description: "LinkedIn candidates have a 24% higher match score compared to direct applications.",
    impact: "Medium",
    icon: TrendingUp,
    color: "text-emerald-700",
    bg: "bg-emerald-100"
  },
  {
    title: "Bias Alert",
    description: "Screening scores show a slight preference for candidates from top-tier universities.",
    impact: "Critical",
    icon: AlertCircle,
    color: "text-rose-700",
    bg: "bg-rose-100"
  }
]

export default function AIInsights() {
  return (
    <SketchyDashboardLayout 
      title="Overview" 
      role="RECRUITER"
      headerAction={
        <Badge className="bg-yellow-200 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#000] px-3 py-1 font-bold flex items-center gap-1.5 rounded-xl">
          <BrainCircuit className="w-4 h-4" />
          Intelligence Active
        </Badge>
      }
    >
      <div className="space-y-10">
        {/* Hero Section */}
        <div 
          className="relative p-8 md:p-12 rounded-[2.5rem] border-2 border-slate-900 bg-amber-100 text-slate-900 overflow-hidden shadow-[6px_6px_0px_0px_rgba(30,41,59,1)]"
          style={{ filter: "url(#squiggle)" }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[80px] -mr-32 -mt-32" />
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-[10px] font-bold uppercase tracking-widest shadow-[1px_1px_0px_0px_#000]">
                Powered by GPT-4o
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Smart Intelligence</h1>
            <p className="text-slate-750 text-base md:text-lg font-bold leading-relaxed">
              Our AI analyzes thousands of data points to give you actionable insights into your hiring process and candidate quality.
            </p>
          </div>
          <Sparkles className="absolute bottom-10 right-10 w-48 h-48 text-slate-900/5 hidden md:block" />
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {insights.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={item.title}
              className="group p-8 rounded-[2.5rem] bg-white border-2 border-slate-900 hover:border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] hover:shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[-2px] transition-all text-left relative"
              style={{ filter: "url(#squiggle)" }}
            >
              <div className={`w-12 h-12 rounded-xl border-2 border-slate-900 ${item.bg} ${item.color} flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_#000]`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{item.title}</h3>
                  <Badge className={`rounded-xl px-2.5 py-0.5 font-bold uppercase tracking-widest text-[9px] border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000] ${
                    item.impact === 'Critical' ? 'text-rose-800 bg-rose-100' :
                    item.impact === 'High' ? 'text-red-800 bg-red-100' :
                    'text-emerald-800 bg-emerald-100'
                  }`} variant="outline">
                    {item.impact}
                  </Badge>
                </div>
                <p className="text-sm text-slate-650 leading-relaxed font-bold">
                  {item.description}
                </p>
                <div className="pt-2">
                  <Button className="bg-yellow-100 hover:bg-yellow-200 text-slate-900 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[-1px] transition-all gap-1.5 font-bold px-4 py-2 text-xs h-9">
                    View Details
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Suggestions Area */}
        <div 
          className="rounded-[2.5rem] bg-slate-900 border-2 border-slate-900 p-8 md:p-12 text-white overflow-hidden relative shadow-[6px_6px_0px_0px_rgba(30,41,59,1)]"
          style={{ filter: "url(#squiggle)" }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black mb-6 tracking-tight flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-yellow-350" />
                Optimization Ideas
              </h2>
              <div className="space-y-6">
                {[
                  "Rewrite 'Senior Frontend' JD to emphasize system design over library skills.",
                  "Integrate automated technical assessment for mid-level roles.",
                  "Diversify candidate sourcing to include niche developer communities."
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-yellow-350 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-sm shrink-0 shadow-[2px_2px_0px_0px_#000]">
                      {i + 1}
                    </div>
                    <p className="text-slate-350 text-sm font-bold leading-relaxed pt-1">{s}</p>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <Button className="bg-yellow-300 hover:bg-yellow-400 text-slate-900 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all h-12 px-6 font-bold text-sm">
                  Generate Full Report
                </Button>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-yellow-300/10 blur-3xl rounded-full" />
              <div className="relative bg-white border-2 border-slate-900 rounded-3xl p-8 text-slate-900 shadow-[4px_4px_0px_0px_#000]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-slate-900 text-white flex items-center justify-center font-black shadow-[1px_1px_0px_0px_#000] italic">
                    AI
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-900">AI Assistant</p>
                    <p className="text-[10px] text-slate-400 font-bold">Connected</p>
                  </div>
                </div>
                <p className="text-sm text-slate-650 font-bold mb-6 leading-relaxed">
                  "I noticed a 15% drop in conversion from Interview &rarr; Offer. Most candidates cite 'Compensation Misalignment'. I recommend reviewing salary benchmarks for React roles."
                </p>
                <div className="w-full h-3 bg-slate-100 border-2 border-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="w-1/3 h-full bg-yellow-350 border-r-2 border-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SketchyDashboardLayout>
  )
}

