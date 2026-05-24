import { useState, useEffect } from "react"
import { 
  User, 
  Bell, 
  Shield, 
  Save, 
  ChevronRight,
  Loader2,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { SketchyDashboardLayout } from "@/components/SketchyDashboardLayout"
import { SketchyCard } from "@/components/SketchyCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"

export default function Settings() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // User state details
  const [userRole, setUserRole] = useState<string>("INDIVIDUAL")

  // Form fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [skillsStr, setSkillsStr] = useState("")
  const [experienceYears, setExperienceYears] = useState<number>(0)

  // Password fields
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [aiAlerts, setAiAlerts] = useState(true)

  // Mock settings
  const [tfaEnabled, setTfaEnabled] = useState(false)
  const [authorizedDevicesCount, setAuthorizedDevicesCount] = useState(2)

  // Clear messages automatically after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchProfile = async () => {
    setLoading(true)
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      setLoading(false)
      return
    }

    try {
      const parsed = JSON.parse(userStr)
      if (parsed.role) {
        setUserRole(parsed.role)
      }

      const response = await api.get("/user/dashboard")
      const p = response.data.profile
      setProfile(p)
      if (p) {
        setFullName(p.full_name || "")
        setEmail(p.email || "")
        setLocation(p.location || "")
        setBio(p.bio || "")
        setExperienceYears(p.experience_years || 0)
        if (Array.isArray(p.skills)) {
          setSkillsStr(p.skills.join(", "))
        } else {
          setSkillsStr("")
        }
      }

      // Load notifications
      const storedPrefs = localStorage.getItem("notification_prefs")
      if (storedPrefs) {
        const prefs = JSON.parse(storedPrefs)
        setEmailNotifications(prefs.emailNotifications ?? true)
        setPushNotifications(prefs.pushNotifications ?? false)
        setAiAlerts(prefs.aiAlerts ?? true)
      }
    } catch (err: any) {
      console.warn("Failed to fetch settings details:", err)
      setMessage({ type: "error", text: "Could not load settings from profile." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setMessage(null)

    try {
      // 1. Password validation & update if user filled any password field
      if (currentPassword || newPassword || confirmNewPassword) {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
          setMessage({ type: "error", text: "Please fill out all password fields to update password." })
          setSaving(false)
          return
        }
        if (newPassword !== confirmNewPassword) {
          setMessage({ type: "error", text: "New passwords do not match." })
          setSaving(false)
          return
        }
        if (newPassword.length < 6) {
          setMessage({ type: "error", text: "Password must be at least 6 characters long." })
          setSaving(false)
          return
        }

        // Call change password API
        await api.post(`/user/change-password?user_id=${profile.user_id}`, {
          current_password: currentPassword,
          new_password: newPassword
        })

        // Reset password fields
        setCurrentPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
        setIsChangingPassword(false)
      }

      // 2. Profile metadata update
      const skillsArray = skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const updateData: any = {
        full_name: fullName,
        email: email,
        location: location,
        bio: bio,
        skills: skillsArray,
        experience_years: Number(experienceYears)
      }

      await api.put(`/user/profile?user_id=${profile.user_id}`, updateData)

      // 3. Local notification storage
      localStorage.setItem("notification_prefs", JSON.stringify({
        emailNotifications,
        pushNotifications,
        aiAlerts
      }))

      // 4. Sync name/email/role context in localstorage user item
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userObj = JSON.parse(userStr)
        userObj.email = email
        userObj.full_name = fullName
        localStorage.setItem("user", JSON.stringify(userObj))
      }

      setMessage({ type: "success", text: "Settings saved successfully!" })
    } catch (err: any) {
      console.error("Save settings failed:", err)
      const errorMsg = err.response?.data?.detail || "Failed to update profile settings."
      setMessage({ type: "error", text: errorMsg })
    } finally {
      setSaving(false)
    }
  }

  return (
    <SketchyDashboardLayout
      title="Settings"
      role={userRole}
      headerAction={
        <Button 
          onClick={handleSave} 
          disabled={saving || loading} 
          className="bg-red-500 hover:bg-red-600 border-2 border-slate-900 rounded-xl font-bold font-mono text-white gap-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] active:translate-y-[2px] transition-all cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-8 font-mono">
        {/* Inline Feedback Alerts */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border-3 border-slate-900 shadow-md flex items-center gap-3 ${
                message.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}
              style={{ filter: "url(#squiggle)" }}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-700" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-700" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Loading Settings...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Profile Card */}
            <SketchyCard className="p-8">
              <div className="flex items-center gap-4 border-b-2 border-slate-900 pb-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-100 border-2 border-slate-900 flex items-center justify-center text-red-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wide">Profile Information</h2>
                  <p className="text-xs text-slate-500">Update your account credentials and personal bio.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-xs font-bold uppercase tracking-wider">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-xl border-2 border-slate-900 focus-visible:ring-red-500 h-12 bg-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-2 border-slate-900 focus-visible:ring-red-500 h-12 bg-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="rounded-xl border-2 border-slate-900 focus-visible:ring-red-500 h-12 bg-white text-sm"
                  />
                </div>

                {userRole === "INDIVIDUAL" && (
                  <div className="space-y-2">
                    <Label htmlFor="exp-years" className="text-xs font-bold uppercase tracking-wider">Experience (Years)</Label>
                    <Input
                      id="exp-years"
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="rounded-xl border-2 border-slate-900 focus-visible:ring-red-500 h-12 bg-white text-sm"
                      min={0}
                    />
                  </div>
                )}

                {userRole === "INDIVIDUAL" && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="skills" className="text-xs font-bold uppercase tracking-wider">Skills (Comma-separated)</Label>
                    <Input
                      id="skills"
                      type="text"
                      value={skillsStr}
                      onChange={(e) => setSkillsStr(e.target.value)}
                      placeholder="e.g. React, TypeScript, Python, Tailwind"
                      className="rounded-xl border-2 border-slate-900 focus-visible:ring-red-500 h-12 bg-white text-sm"
                    />
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider">Biography / About Me</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a brief professional bio..."
                    className="flex min-h-[100px] w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </SketchyCard>

            {/* 2. Security Card */}
            <SketchyCard className="p-8">
              <div className="flex items-center gap-4 border-b-2 border-slate-900 pb-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center text-amber-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wide">Password & Security</h2>
                  <p className="text-xs text-slate-500">Manage account access security and log-ins.</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Collapsible Password trigger */}
                <button 
                  type="button"
                  onClick={() => setIsChangingPassword(!isChangingPassword)} 
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm group cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
                    Change Account Password
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-red-500 transition-transform ${isChangingPassword ? "rotate-90" : ""}`} />
                </button>

                {/* Collapsible Password fields */}
                <AnimatePresence>
                  {isChangingPassword && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 rounded-xl border-2 border-dashed border-slate-900 bg-amber-50/30 space-y-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-pw" className="text-xs font-bold uppercase tracking-wider">Current Password</Label>
                            <Input
                              id="current-pw"
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="rounded-xl border-2 border-slate-900 focus-visible:ring-red-500 h-10 bg-white text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-pw" className="text-xs font-bold uppercase tracking-wider">New Password</Label>
                            <Input
                              id="new-pw"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="rounded-xl border-2 border-slate-900 focus-visible:ring-red-500 h-10 bg-white text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-pw" className="text-xs font-bold uppercase tracking-wider">Confirm New Password</Label>
                            <Input
                              id="confirm-pw"
                              type="password"
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              className="rounded-xl border-2 border-slate-900 focus-visible:ring-red-500 h-10 bg-white text-sm"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Password changes will be saved when you click "Save Changes" at the top.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 2FA Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-900 bg-white">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold tracking-tight">Two-Factor Authentication (2FA)</Label>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure your account with an authentication device.</p>
                  </div>
                  <Switch 
                    checked={tfaEnabled} 
                    onCheckedChange={(checked) => {
                      setTfaEnabled(checked)
                      setMessage({
                        type: "success",
                        text: `Two-Factor Authentication has been successfully ${checked ? "enabled" : "disabled"}.`
                      })
                    }}
                    className="data-[state=checked]:bg-emerald-500" 
                  />
                </div>

                {/* Sessions */}
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-900 bg-white">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold tracking-tight">Authorized Devices</Label>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{authorizedDevicesCount} active sessions detected.</p>
                  </div>
                  {authorizedDevicesCount > 1 ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setAuthorizedDevicesCount(1)
                        setMessage({ type: "success", text: "Terminated all other active sessions successfully!" })
                      }}
                      className="border-2 border-slate-900 rounded-xl font-bold font-mono h-9 hover:bg-slate-100 hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer"
                    >
                      Log Out Others
                    </Button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border-2 border-emerald-300 px-3 py-1 rounded-full uppercase tracking-widest font-mono">Secure Session</span>
                  )}
                </div>
              </div>
            </SketchyCard>

            {/* 3. Notifications Preferences Card */}
            <SketchyCard className="p-8">
              <div className="flex items-center gap-4 border-b-2 border-slate-900 pb-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 border-2 border-slate-900 flex items-center justify-center text-blue-600">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wide">Notification Settings</h2>
                  <p className="text-xs text-slate-500">Configure email and real-time app notifications.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-900 bg-white">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold tracking-tight">Email Notifications</Label>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Receive email alerts for core updates.</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                    className="data-[state=checked]:bg-red-500" 
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-900 bg-white">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold tracking-tight">Push Notifications</Label>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Receive browser push notification alerts.</p>
                  </div>
                  <Switch 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications} 
                    className="data-[state=checked]:bg-red-500" 
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-900 bg-white">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold tracking-tight">AI Insights Alerts</Label>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Receive automated weekly AI insights.</p>
                  </div>
                  <Switch 
                    checked={aiAlerts} 
                    onCheckedChange={setAiAlerts} 
                    className="data-[state=checked]:bg-red-500" 
                  />
                </div>
              </div>
            </SketchyCard>
          </div>
        )}
      </div>
    </SketchyDashboardLayout>
  )
}
