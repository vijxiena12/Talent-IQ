import { Routes, Route } from "react-router-dom"
import Login from "@/pages/Auth/Login"
import Signup from "@/pages/Auth/Signup"
import Dashboard from "@/pages/Dashboard/Dashboard"
import Resumes from "@/pages/Resumes/Resumes"
import JobOpenings from "@/pages/Jobs/JobOpenings"
import AIInsights from "@/pages/Insights/AIInsights"
import Analytics from "@/pages/Analytics/Analytics"
import SettingsPage from "@/pages/Settings/Settings"
import AssessmentSuite from "@/pages/Interview/AssessmentSuite"
import Screening from "@/pages/Screening/Screening"
import PreviewPage from "@/pages/Preview"
import Profile from "@/pages/Individual/Profile"
import { SketchyLanding } from "@/components/ui/Sketchy"
import ProtectedRoute from "@/components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<SketchyLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/resumes" element={<ProtectedRoute><Resumes /></ProtectedRoute>} />
      <Route path="/screening" element={<ProtectedRoute><Screening /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><JobOpenings /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/individual/assessment" element={<ProtectedRoute><AssessmentSuite /></ProtectedRoute>} />

      <Route path="/individual/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/preview" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default App

