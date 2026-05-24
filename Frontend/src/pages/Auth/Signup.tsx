import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Sparkles, Eye, EyeOff, Briefcase, User as UserIcon } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { api } from "@/lib/api";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"RECRUITER" | "INDIVIDUAL">("INDIVIDUAL");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role
      });
      
      localStorage.setItem("user", JSON.stringify(res.data));
      if (res.data?.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      }
      // alert("Signup successful!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    // Google sign-up removed. Use email/password signup.
    setError("Google sign-up is not configured. Use email/password.");
  };


  return (
    <AuthLayout isTyping={isTyping} passwordValue={password} showPassword={showPassword}>
      <div className="w-full max-w-[420px]">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12 text-slate-900">
          <div className="size-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <Sparkles className="size-4 text-amber-700" />
          </div>
          <span>TalentIQ AI</span>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Create an account</h1>
          <p className="text-slate-500 text-sm">Join us and start screening smarter</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Erik Johansson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              required
              className="h-12 bg-[#f8efe2] border-slate-300/80 focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="erik@example.com"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              required
              className="h-12 bg-[#f8efe2] border-slate-300/80 focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pr-10 bg-[#f8efe2] border-slate-300/80 focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">I am a...</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("INDIVIDUAL")}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "INDIVIDUAL" 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border/60 hover:border-border text-muted-foreground"
                }`}
              >
                <UserIcon className="size-4" />
                <span className="font-bold text-sm">Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("RECRUITER")}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === "RECRUITER" 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border/60 hover:border-border text-muted-foreground"
                }`}
              >
                <Briefcase className="size-4" />
                <span className="font-bold text-sm">Recruiter</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-100 bg-red-900/40 border border-red-800/50 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 rounded-full bg-amber-700 text-white hover:bg-amber-800 text-base font-medium" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        {/* Google signup removed - use email/password */}

        <div className="text-center text-sm text-slate-600 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-700 font-medium hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
