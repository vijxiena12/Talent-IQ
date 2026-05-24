import { CheckCircle2, BarChart4 } from "lucide-react"
import heroBg from "@/assets/hero.png"
import { Badge } from "./badge"
import { Progress } from "./progress"

interface ATSCardProps {
  score?: number
  status?: string
  confidence?: string
  recommendation?: string
}

export function ATSCard({
  score = 84,
  status = "Strong Match",
  confidence = "High confidence",
  recommendation = "Keep your resume ATS-friendly by matching top keywords and formatting consistently.",
}: ATSCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/70 bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
      <img
        src={heroBg}
        alt="ATS background"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90" />
      <div className="relative p-8 sm:p-10 lg:p-12 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-200/90">ATS Compatibility</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white">Resume Match Score</h2>
          </div>
          <Badge className="bg-amber-50/15 text-amber-200 border border-amber-200/30 px-4 py-2 text-sm font-semibold">
            {status}
          </Badge>
        </div>

        <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-6xl font-black tracking-tight text-white">{score}%</p>
            <p className="mt-3 max-w-xl text-sm text-slate-300 leading-6">
              Your profile is evaluated against real employer ATS rules, parsing accuracy, keyword relevance,
              and formatting signal strength.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl bg-white/10 px-5 py-3 text-sm text-slate-100">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            {confidence}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>ATS fit</span>
            <span>{score}%</span>
          </div>
          <Progress value={score} className="h-3 rounded-full bg-slate-700" />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-200">
          <div className="flex items-center gap-2 font-semibold text-amber-100">
            <BarChart4 className="h-4 w-4" />
            Recommendation
          </div>
          <p className="mt-2 text-slate-300">{recommendation}</p>
        </div>
      </div>
    </div>
  )
}
