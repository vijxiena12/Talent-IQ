import React from "react"
import { cn } from "@/lib/utils"
import { HTMLMotionProps, motion } from "framer-motion"

export interface SketchyCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean
  sketchFilter?: boolean
}

export function SketchyCard({ 
  children, 
  className,
  hover = true,
  sketchFilter = true,
  ...props 
}: SketchyCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        "relative p-6 md:p-8 rounded-[2rem] border-3 border-slate-900 bg-white shadow-lg",
        className
      )}
      style={sketchFilter ? { filter: "url(#squiggle)" } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SketchyMetricCard({ 
  label, 
  value, 
  icon: Icon,
  color = "text-red-600",
  bgColor = "bg-red-100"
}: {
  label: string
  value: string | number
  icon?: React.ComponentType<{ className?: string }>
  color?: string
  bgColor?: string
}) {
  return (
    <SketchyCard className="text-center group">
      {Icon && (
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform", bgColor)}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
      )}
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </SketchyCard>
  )
}
