import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { api } from "@/lib/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleType = searchParams.get("role");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });
      
      const userData = res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      if (userData?.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
      }
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Google sign-in removed. Use backend email/password or external OAuth flow.
    setError("Google sign-in is not configured. Use email/password.");
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
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">
            {roleType === "RECRUITER" ? "Recruiter Portal" : roleType === "INDIVIDUAL" ? "Candidate Portal" : "Welcome back!"}
          </h1>
          <p className="text-slate-500 text-sm">
            {roleType ? `Sign in to access your dashboard` : "Please enter your details"}
          </p>
        </div>


        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="anna@gmail.com"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Remember for 30 days
              </Label>
            </div>
            <a href="#" className="text-sm text-primary hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-100 bg-red-900/40 border border-red-800/50 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 rounded-full bg-amber-700 text-white hover:bg-amber-800 text-base font-medium" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Log in"}
          </Button>
        </form>

        {/* Google login removed - use email/password */}

        <div className="text-center text-sm text-slate-600 mt-8">
          Don't have an account?{" "}
          <Link to="/signup" className="text-amber-700 font-medium hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
