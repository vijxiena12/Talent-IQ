import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BrainCircuit, 
  ShieldCheck, 
  Mic, 
  Video, 
  Send, 
  FileText, 
  CheckCircle2, 
  BarChart4,
  ArrowRight,
  Loader2,
  AlertCircle,
  Volume2,
  VolumeX,
  Code2,
  Play,
  RotateCcw,
  Target
} from "lucide-react"
import Editor from "@monaco-editor/react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ATSCard } from "@/components/ui/ATSCard"
import { api } from "@/lib/api"
import { ProctorStream } from "@/components/interview/ProctorStream"
import { SketchyDashboardLayout } from "@/components/SketchyDashboardLayout"
import { SketchyCard } from "@/components/SketchyCard"
import { SquiggleFilter, GraphPaper } from "@/components/ui/Sketchy"

type Step = "workspace" | "setup" | "interview" | "test" | "report"

export default function AssessmentSuite() {
  const [step, setStep] = useState<Step>("workspace")
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [resumeId, setResumeId] = useState<number | null>(null)
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [proctorLogs, setProctorLogs] = useState<any[]>([])
  const [interviewAnswers, setInterviewAnswers] = useState<any[]>([])

  // --- RENDERING HELPERS ---
  const renderStep = () => {
    switch(step) {
      case "workspace": return <WorkspaceStep onComplete={handleScreeningComplete} />
      case "setup": return <SetupStep onStart={(() => setStep("interview"))} />
      case "interview": return <InterviewStep sessionId={sessionId!} data={assessmentData} onComplete={handleInterviewComplete} />
      case "test": return <TestStep sessionId={sessionId!} data={assessmentData} resumeId={resumeId} interviewAnswers={interviewAnswers} onComplete={() => setStep("report")} />
      case "report": return <ReportStep sessionId={sessionId!} onReset={() => setStep("workspace")} />
      default: return null
    }
  }

  const handleScreeningComplete = (data: any, sid: string, rid?: number) => {
    setAssessmentData(data)
    setSessionId(sid)
    if (rid) setResumeId(rid)
    setStep("setup")
  }

  const handleInterviewComplete = (answers: any[]) => {
    setInterviewAnswers(answers)
    setStep("test")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8efe2] relative overflow-hidden">
        <SquiggleFilter />
        <GraphPaper />
        
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 bg-[#f8efe2]/95 backdrop-blur-sm px-4 border-b-2 border-slate-900/20">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-slate-900/20" />
          <div className="flex-1">
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">AI Proctored Assessment</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-lg border-2 border-slate-900">
              {step.replace("_", " ")}
            </Badge>
          </div>
        </header>

        <main className="p-6 md:p-10 lg:p-12 w-full max-w-[1600px] mx-auto min-h-[calc(100svh-4rem)] relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

// --- STEP 1: WORKSPACE ---
function WorkspaceStep({ onComplete }: { onComplete: (data: any, sid: string, rid?: number) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    if (!file || !jd) {
      alert("Please upload your resume and paste the job description first.")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("resume", file)
      formData.append("jd_text", jd)
      formData.append("job_title", title || "Target Role")
      
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        formData.append("candidate_email", user.email)
      }

      const response = await api.post("/screen", formData)
      const data = response.data.data
      const sid = response.data.session_id
      const rid = response.data.resume_id
      onComplete(data, sid, rid)
    } catch (error: any) {
      console.error("Error during screening analysis:", error)
      alert(error.response?.data?.detail || error.message || "Assessment screening failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Candidate Workspace</h1>
        <p className="text-slate-500 font-medium">To begin the assessment, please upload your resume and the job description.</p>
      </div>

      <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/40 rounded-[2rem] bg-white overflow-hidden relative">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Candidate Resume</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-red-400 hover:bg-slate-50/50 transition-all cursor-pointer group">
              <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" id="resume-upload" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <label htmlFor="resume-upload" className="cursor-pointer space-y-4 block">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{file ? file.name : "Click to upload resume"}</p>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">PDF, DOC, DOCX or TXT (Max 10MB)</p>
                </div>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Target Job Title</label>
              <Input placeholder="e.g. Senior Frontend Developer" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Job Description</label>
            <textarea 
              placeholder="Paste the job description requirements here..."
              className="w-full h-40 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none font-medium text-slate-600"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-8 rounded-2xl shadow-lg shadow-red-200 gap-2 text-lg"
            onClick={handleRun}
            disabled={loading || !file || !jd}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
            {loading ? "Analyzing Requirements..." : "Proceed to Assessment"}
          </Button>
        </div>
      </Card>
    </div>
  )
}

// --- STEP 2: SETUP ---
function SetupStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-xl mx-auto text-center space-y-10 py-20">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
        <ShieldCheck className="w-12 h-12" />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Ready to Begin?</h1>
        <p className="text-slate-500 leading-relaxed font-medium">
          The following session will be proctored using your webcam and microphone. 
          Please ensure you are in a quiet, well-lit environment.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 border-slate-200 rounded-2xl flex flex-col items-center gap-3">
          <Video className="w-6 h-6 text-red-600" />
          <span className="text-xs font-bold uppercase text-slate-400">Camera Active</span>
        </Card>
        <Card className="p-6 border-slate-200 rounded-2xl flex flex-col items-center gap-3">
          <Mic className="w-6 h-6 text-red-600" />
          <span className="text-xs font-bold uppercase text-slate-400">Mic Ready</span>
        </Card>
      </div>

      <Button onClick={onStart} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-8 rounded-2xl text-lg shadow-xl shadow-slate-200">
        Start Proctored Session
      </Button>
    </div>
  )
}

// --- STEP 3: INTERVIEW ---
function InterviewStep({ sessionId, data, onComplete }: { sessionId: string, data: any, onComplete: (answers: any[]) => void }) {
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [isAnswering, setIsAnswering] = useState(false)
  const [answers, setAnswers] = useState<any[]>([])

  const allQs = [
    ...(data.interview_questions?.technical || []),
    ...(data.interview_questions?.behavioral || []),
    ...(data.interview_questions?.scenario_based || []),
  ]

  useEffect(() => {
    if (allQs.length > 0) {
      if (ttsEnabled) {
        speakText(allQs[currentQIdx])
      }
    }
  }, [currentQIdx])

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const startSTT = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsAnswering(true)
      }
      recognition.start()
    } else {
      alert("Speech recognition not supported in this browser.")
    }
  }

  const handleNext = () => {
    // Save current answer before moving on
    const updatedAnswers = [...answers]
    updatedAnswers[currentQIdx] = {
      question: allQs[currentQIdx],
      answer: input
    }

    if (currentQIdx < allQs.length - 1) {
      setAnswers(updatedAnswers)
      setCurrentQIdx(currentQIdx + 1)
      setInput("")
      setIsAnswering(false)
    } else {
      // Save last answer and complete
      setAnswers(updatedAnswers)
      onComplete(updatedAnswers)
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8 h-[calc(100svh-12rem)]">
      {/* Left: Monitoring & Vocal */}
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <div className="flex-1">
          <ProctorStream sessionId={sessionId} />
        </div>
        <Card className="p-6 border-slate-200 rounded-3xl bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Mic className="w-4 h-4 text-red-600" />
              Voice Interaction
            </h3>
            <Badge variant="outline" className={isListening ? "bg-rose-50 text-rose-600 border-rose-100" : ""}>
              {isListening ? "Listening..." : "Ready"}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={startSTT}
              disabled={isListening}
              className={`flex-1 h-14 rounded-2xl font-bold transition-all ${isListening ? "bg-rose-500" : "bg-red-600 hover:bg-red-700"}`}
            >
              {isListening ? (
                <>
                  <div className="flex gap-1 mr-2">
                    <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                    <motion.div animate={{ height: [8, 20, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-white rounded-full" />
                    <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-white rounded-full" />
                  </div>
                  Recording...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Speak Response
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-14 w-14 rounded-2xl border-2"
              onClick={() => speakText(allQs[currentQIdx])}
            >
              <Volume2 className="w-6 h-6 text-red-600" />
            </Button>
          </div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest text-center">Use your voice or type below to answer</p>
        </Card>
      </div>

      {/* Right: Question Area */}
      <Card className="lg:col-span-3 flex flex-col border-slate-200 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-slate-200/40 border-2 border-red-100">
        <div className="p-8 border-b border-slate-100 bg-red-50/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-200">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">AI Interviewer</h3>
              <p className="text-xs text-red-500 font-bold uppercase tracking-widest">Question {currentQIdx + 1} of {allQs.length}</p>
            </div>
          </div>
          <Progress value={((currentQIdx + 1) / allQs.length) * 100} className="w-32 h-2" />
        </div>

        <div className="flex-1 p-10 flex flex-col justify-center items-center text-center space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6 max-w-2xl"
            >
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                {allQs[currentQIdx]}
              </h2>
              <div className="w-20 h-1 bg-red-500 mx-auto rounded-full opacity-20" />
            </motion.div>
          </AnimatePresence>

          {isAnswering && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl p-6 rounded-3xl bg-slate-50 border-2 border-red-100 italic text-slate-600"
            >
              "{input}"
            </motion.div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input 
                placeholder="Type your answer here..." 
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if(e.target.value) setIsAnswering(true)
                }}
                className="h-16 rounded-2xl border-2 border-slate-200 focus-visible:ring-red-500 text-lg px-6"
              />
              <Button 
                className="absolute right-2 top-2 h-12 px-6 bg-slate-900 hover:bg-black rounded-xl"
                onClick={handleNext}
                disabled={!input.trim()}
              >
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          <p className="mt-4 text-xs text-center text-slate-400 font-medium italic">
            Tip: You can use Voice Input for a more natural interview experience.
          </p>
        </div>
      </Card>
    </div>
  )
}

// --- STEP 4: SKILLS ASSESSMENT ---
function TestStep({ sessionId, data, resumeId, interviewAnswers, onComplete }: { sessionId: string, data: any, resumeId: number | null, interviewAnswers: any[], onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({} as Record<number, string>)
  const [language, setLanguage] = useState(data.assessment?.dsa?.language || "python")
  const [codeSolution, setCodeSolution] = useState("")
  const [solutions, setSolutions] = useState<Record<string, string>>({})
  const [codeOutput, setCodeOutput] = useState<any>(null)
  const [codeLoading, setCodeLoading] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)

  const assessment = data.assessment
  if (!assessment) return <div className="text-center p-12">No assessment data found.</div>

  useEffect(() => {
    if (assessment.dsa) {
      const base = language === "cpp" 
        ? (assessment.dsa.cpp_base_code || assessment.dsa.base_code || "")
        : (assessment.dsa.python_base_code || assessment.dsa.base_code || "");
      setCodeSolution(solutions[language] !== undefined ? solutions[language] : base);
    }
  }, [language, assessment.dsa])

  const handleCodeChange = (val: string) => {
    setCodeSolution(val)
    setSolutions(prev => ({ ...prev, [language]: val }))
  }

  const runCode = async () => {
    setCodeLoading(true)
    try {
      const res = await api.post(`/code/execute`, {
        code: codeSolution,
        language: language,
        test_cases: assessment.dsa?.test_cases || [{ input: "", expected: "" }]
      })
      setCodeOutput(res.data)
    } catch (err: any) {
      setCodeOutput({ success: false, error: err.message })
    } finally {
      setCodeLoading(false)
    }
  }

  const handleFinalize = async () => {
    setIsFinalizing(true)
    try {
      // Calculate MCQ score
      let correct = 0
      assessment.mcqs.forEach((q: any) => {
        if (answers[q.id] === q.options[q.correct_idx]) {
          correct++
        }
      })
      const mcqScore = assessment.mcqs.length > 0 ? (correct / assessment.mcqs.length) * 100 : 0

      // Get logged in user details
      const userStr = localStorage.getItem("user")
      const userId = userStr ? JSON.parse(userStr).id : 2

      // Submit results to backend with interview answers and sessionId
      await api.post(`/individual/submit-assessment`, {
        session_id: sessionId,
        interview_answers: interviewAnswers || [],
        resume_id: resumeId || 1,
        user_id: userId,
        mcq_score: mcqScore,
        dsa_code: codeSolution,
        dsa_feedback: codeOutput || { success: true },
        integrity_score: 95
      })

      onComplete()
    } catch (err) {
      console.error(err)
      onComplete() // Proceed anyway for demo
    } finally {
      setIsFinalizing(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 pb-10">
      {/* Monitoring Sidebar */}
      <div className="lg:col-span-1 space-y-6">
         <ProctorStream sessionId={sessionId} />
         <Card className="p-8 border-slate-200 rounded-[2.5rem] bg-slate-900 text-white space-y-6 shadow-2xl">
           <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
             <ShieldCheck className="w-7 h-7" />
           </div>
           <div className="space-y-2">
             <h3 className="text-lg font-bold">Integrity Guard</h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               AI is monitoring for suspicious activity. Avoid switching tabs or looking away.
             </p>
           </div>
           <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                <span>Security Level</span>
                <span className="text-emerald-400">Maximum</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500" />
              </div>
           </div>
       </Card>
      </div>

      {/* Test Area */}
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              Part 1: Technical MCQs
            </h2>
            <Badge className="bg-red-100 text-red-700">{assessment.mcqs.length} Questions</Badge>
          </div>
          
          <div className="space-y-4">
            {assessment.mcqs.map((q: any) => (
              <Card key={q.id} className="p-8 border-slate-200 rounded-[2rem] bg-white shadow-sm hover:shadow-md transition-all border-2 hover:border-red-100">
                <p className="font-bold text-slate-800 text-lg mb-6 leading-relaxed">{q.id}. {q.question}</p>
                <RadioGroup 
                  onValueChange={(val) => setAnswers(prev => ({...prev, [q.id]: val}))}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {q.options.map((opt: string, idx: number) => (
                    <div key={idx} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${
                      answers[q.id] === opt ? "bg-red-50 border-red-200" : "bg-white border-slate-100 hover:border-slate-200"
                    }`}>
                      <RadioGroupItem value={opt} id={`q-${q.id}-${idx}`} />
                      <Label htmlFor={`q-${q.id}-${idx}`} className="flex-1 cursor-pointer font-bold text-slate-700">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              Part 2: Coding Solution
            </h2>
            <div className="flex gap-2">
              <Button 
                variant={language === "python" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("python")}
                className={language === "python" ? "bg-red-600" : ""}
              >
                Python
              </Button>
              <Button 
                variant={language === "cpp" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("cpp")}
                className={language === "cpp" ? "bg-red-600" : ""}
              >
                C++
              </Button>
            </div>
          </div>
          
          <Card className="p-8 border-slate-200 rounded-[2.5rem] bg-slate-900 text-slate-300 relative overflow-hidden group border-4 border-slate-800">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-red-500 text-white font-bold px-4 py-1">{assessment.dsa.title}</Badge>
                <Code2 className="w-6 h-6 text-slate-700" />
              </div>
              <div className="bg-black/50 p-6 rounded-2xl font-mono text-sm text-red-300 border border-white/5 whitespace-pre-wrap">
                {language === "cpp"
                  ? (assessment.dsa.cpp_base_code || assessment.dsa.base_code)
                  : (assessment.dsa.python_base_code || assessment.dsa.base_code)}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="rounded-[2rem] overflow-hidden border-2 border-slate-200 shadow-xl">
              <Editor
                height="400px"
                language={language === "cpp" ? "cpp" : "python"}
                theme="vs-dark"
                value={codeSolution}
                onChange={(value) => handleCodeChange(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  padding: { top: 20 },
                  fontWeight: "bold"
                }}
              />
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={runCode}
                disabled={codeLoading || !codeSolution}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-16 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-100"
              >
                {codeLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                Run Tests
              </Button>
              <Button 
                variant="outline"
                className="h-16 px-8 rounded-2xl border-2 font-bold"
                onClick={() => {
                  const base = language === "cpp"
                    ? (assessment.dsa.cpp_base_code || assessment.dsa.base_code || "")
                    : (assessment.dsa.python_base_code || assessment.dsa.base_code || "");
                  handleCodeChange(base);
                }}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
            {codeOutput && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className={`p-6 rounded-3xl ${codeOutput.success && codeOutput.all_passed ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"} border-2`}>
                  <p className={`font-bold ${codeOutput.success && codeOutput.all_passed ? "text-emerald-700" : "text-rose-700"}`}>
                    {codeOutput.success && codeOutput.all_passed 
                      ? "✓ All test cases passed!" 
                      : codeOutput.success 
                        ? "✕ Some test cases failed." 
                        : `✕ Error: ${codeOutput.error}`}
                  </p>
                  
                  {codeOutput.test_results && codeOutput.test_results.length > 0 && (
                    <div className="mt-4 space-y-2 font-mono text-xs">
                      {codeOutput.test_results.map((tr: any, idx: number) => (
                        <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between ${tr.passed ? "bg-emerald-100/30 border-emerald-200 text-emerald-800" : "bg-rose-100/30 border-rose-200 text-rose-800"}`}>
                          <div>
                            <span className="font-bold">Test #{idx + 1}:</span> Input: <code>{tr.input}</code> | Expected: <code>{tr.expected}</code> | Actual: <code>{tr.actual}</code>
                          </div>
                          <span className="font-bold">{tr.passed ? "PASSED" : "FAILED"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleFinalize} 
          disabled={isFinalizing}
          className="w-full bg-slate-900 hover:bg-black text-white font-bold py-12 rounded-[2.5rem] text-2xl shadow-2xl shadow-red-100 gap-4 transition-all hover:scale-[1.02] active:scale-95"
        >
          {isFinalizing ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle2 className="w-8 h-8 text-red-400" />}
          Finalize & View Report
        </Button>
      </div>
    </div>
  )
}

// --- STEP 5: FINAL REPORT ---
function ReportStep({ sessionId, onReset }: { sessionId: string, onReset: () => void }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await api.get(`/results/${sessionId}`)
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [sessionId])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-8">
      <div className="relative">
        <Loader2 className="w-20 h-20 text-red-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="w-8 h-8 text-red-400" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="font-black text-2xl text-slate-900">Compiling Evaluation...</p>
        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">AI Agents are verifying integrity logs</p>
      </div>
    </div>
  )

  const screener = data?.screener
  const assessment = screener?.assessment
  const integrityLogs = data?.integrity || []
  const integrityScore = Math.max(0, 100 - integrityLogs.reduce((acc: number, log: any) => acc + (log.score_increment || 0), 0))
  const mockInterviewFeedback = data?.mock_interview_feedback || {}
  const dsaFeedback = data?.dsa_feedback || {}

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-lg shadow-emerald-100"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Full Candidate Assessment Report</h1>
        <p className="text-slate-500 font-medium text-lg">Comprehensive analysis of your technical performance, interview skills, and resume alignment.</p>
      </div>

      {/* Section 1: ATS Resume Suggestions & Strengths/Weaknesses */}
      <Card className="p-10 border-slate-200 rounded-[3rem] bg-white shadow-2xl shadow-slate-200/40 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Resume Analysis (ATS Based)</h2>
            <p className="text-slate-500 font-medium">Strengths, gaps, and suggestions from the ATS evaluation</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Strengths</h3>
            <div className="space-y-2">
              {(screener?.evaluation?.strengths || []).map((s: string, i: number) => (
                <div key={i} className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-bold text-emerald-800">{s}</span>
                </div>
              ))}
              {(screener?.evaluation?.strengths || []).length === 0 && (
                <p className="text-sm text-slate-400 italic">No strengths identified.</p>
              )}
            </div>
          </div>

          {/* Gaps / Weaknesses */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-600 uppercase tracking-widest">Areas for Improvement</h3>
            <div className="space-y-2">
              {(screener?.evaluation?.gaps || []).map((g: string, i: number) => (
                <div key={i} className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-bold text-rose-800">{g}</span>
                </div>
              ))}
              {(screener?.evaluation?.gaps || []).length === 0 && (
                <p className="text-sm text-slate-400 italic">No gaps identified.</p>
              )}
            </div>
          </div>
        </div>

        {/* Qualitative Feedback */}
        <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3">Qualitative Feedback</h3>
          <p className="text-slate-700 font-medium leading-relaxed">{screener?.evaluation?.qualitative_feedback || "No feedback available."}</p>
        </div>
      </Card>

      {/* Section 2: Missing Skills vs JD */}
      <Card className="p-10 border-slate-200 rounded-[3rem] bg-white shadow-2xl shadow-slate-200/40 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Missing Skills vs Job Description</h2>
            <p className="text-slate-500 font-medium">Skills required by the JD but missing from your resume</p>
          </div>
        </div>

        <div className="grid gap-3">
          {(screener?.ats_result?.missing_skills || []).map((skill: any, i: number) => (
            <div key={i} className="p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-amber-200 text-amber-800 border-0">{skill.requirement || skill}</Badge>
                <span className="text-sm text-amber-700 font-medium">
                  {skill.reason || "Not found in resume"}
                </span>
              </div>
              <Badge variant="outline" className="border-amber-300 text-amber-700">Add to Resume</Badge>
            </div>
          ))}
          {(screener?.ats_result?.missing_skills || []).length === 0 && (
            <p className="text-center text-emerald-600 font-bold py-8">Excellent! No missing skills - your resume covers all JD requirements.</p>
          )}
        </div>
      </Card>

      {/* Section 3: Mock Interview Feedback */}
      <Card className="p-10 border-slate-200 rounded-[3rem] bg-white shadow-2xl shadow-slate-200/40 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Mock Interview Feedback</h2>
            <p className="text-slate-500 font-medium">AI-generated evaluation of your interview responses</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-purple-50 border-2 border-purple-100 rounded-2xl">
            <h3 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2">Overall Impression</h3>
            <p className="text-purple-800 font-medium leading-relaxed">{mockInterviewFeedback?.overall_impression || "No interview feedback available."}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Interview Strengths</h3>
              {(mockInterviewFeedback?.strengths || []).map((s: string, i: number) => (
                <div key={i} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-800">{s}</div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-rose-600 uppercase tracking-widest">Areas for Improvement</h3>
              {(mockInterviewFeedback?.areas_for_improvement || []).map((a: string, i: number) => (
                <div key={i} className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm font-bold text-rose-800">{a}</div>
              ))}
            </div>
          </div>

          {mockInterviewFeedback?.technical_accuracy && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Technical Accuracy: </span>
              <span className="text-sm text-slate-700 font-medium">{mockInterviewFeedback.technical_accuracy}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Section 4: Test Code Feedback */}
      <Card className="p-10 border-slate-200 rounded-[3rem] bg-white shadow-2xl shadow-slate-200/40 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Test Code Feedback</h2>
            <p className="text-slate-500 font-medium">Results from your DSA coding assessment</p>
          </div>
        </div>

        {dsaFeedback?.success !== undefined ? (
          <div className={`p-6 rounded-2xl border-2 ${dsaFeedback.success ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
            <div className="flex items-center gap-3 mb-4">
              {dsaFeedback.success ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-rose-600" />
              )}
              <div>
                <h3 className={`text-lg font-black ${dsaFeedback.success ? "text-emerald-800" : "text-rose-800"}`}>
                  {dsaFeedback.success ? "All Test Cases Passed!" : "Tests Failed"}
                </h3>
                {!dsaFeedback.success && (
                  <p className="text-sm text-rose-600 font-medium">{dsaFeedback.error || "Unknown error"}</p>
                )}
              </div>
            </div>
            {dsaFeedback.output && (
              <pre className="p-4 bg-white rounded-xl text-sm font-mono text-slate-700 overflow-x-auto">
                {JSON.stringify(dsaFeedback.output, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-8">No code execution data available.</p>
        )}
      </Card>

      {/* Section 5: Core Stats (ATS + Integrity) */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ATSCard
            score={screener?.ats_result?.ats_score ?? 0}
            status={screener?.evaluation?.overall_fit ?? "Good Match"}
            confidence={screener?.ats_result?.confidence ?? "High confidence"}
            recommendation="Keep your resume ATS-friendly by matching key skills, avoiding complex formatting, and using standard job titles."
          />
        </div>

        <Card className="p-8 border-slate-200 rounded-[3rem] bg-white shadow-2xl shadow-slate-200/40 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Integrity Rank</h3>
            <div className="flex items-center gap-6">
              <div className={`text-6xl font-black ${integrityScore > 80 ? "text-emerald-600" : "text-rose-600"}`}>{integrityScore}%</div>
              <Badge className={`${integrityScore > 80 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"} border-2 px-4 py-1 text-sm`}>
                {integrityScore > 90 ? "Excellent" : integrityScore > 70 ? "Normal" : "Flagged"}
              </Badge>
            </div>
            <Progress value={integrityScore} className="h-4 bg-slate-100" />
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-700">Behavioral integrity shows candidate honesty and compliance during the assessment.</p>
            <p className="mt-3 text-sm text-slate-500">Integrate this score with ATS performance to make hiring decisions that value both technical fit and candidate reliability.</p>
          </div>
        </Card>
      </div>

      <Card className="mt-8 p-10 border-slate-200 rounded-[3rem] bg-white shadow-2xl shadow-slate-200/40 space-y-10">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <Target className="w-6 h-6 text-red-600" />
            Technical MCQ Analysis
          </h3>
          <div className="space-y-4">
            {assessment?.mcqs.map((q: any) => (
              <div key={q.id} className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-100 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-bold text-slate-800">{q.question}</p>
                  <Badge className="bg-white border-2">Q{q.id}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt: string, idx: number) => (
                    <div key={idx} className={`text-xs p-3 rounded-xl border ${
                      idx === q.correct_idx ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold" : "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {opt} {idx === q.correct_idx && "✓"}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 italic bg-white p-3 rounded-xl border border-dashed">
                  <span className="font-bold text-red-600 mr-2">Explanation:</span>
                  {q.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-8">
        <Card className="p-8 border-slate-200 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-red-400" />
            Next Steps
          </h3>
          <div className="space-y-3">
            <Button onClick={() => window.location.href='/dashboard'} className="w-full bg-red-600 hover:bg-red-700 h-12 rounded-xl">
              Return to Dashboard
            </Button>
            <Button onClick={onReset} variant="outline" className="w-full h-12 rounded-xl border-2">
              Re-take Assessment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
