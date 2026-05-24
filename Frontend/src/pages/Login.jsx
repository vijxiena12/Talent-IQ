import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user && user.email === formData.email && user.password === formData.password) {
        localStorage.setItem("isAuth", "true");
        navigate("/dashboard");
      } else {
        setErrors({ email: "Invalid email or password" });
      }
    } catch (error) {
      setErrors({ email: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const socialUrls = {
      github: "https://github.com/login",
      google: "https://accounts.google.com/signin"
    };

    const targetUrl = socialUrls[provider];
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  };

  const handleGoSignup = () => {
    navigate("/signup");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#cb7f92] via-[#8c72a2] to-[#2f5896] flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] pointer-events-none" />
      <div className="relative w-full max-w-[560px] pt-16">
        <div className="absolute inset-x-10 bottom-[-56px] h-40 bg-[#24365f]/30 blur-2xl pointer-events-none" />
        <div className="relative rounded-[30px] border border-white/60 bg-[#f5f2fb]/95 px-7 pb-12 pt-20 sm:px-14 sm:pb-14 shadow-[0_20px_55px_rgba(15,23,42,0.26)] backdrop-blur-xl">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-[#01295d] shadow-[0_14px_24px_rgba(2,18,47,0.35)] flex items-center justify-center">
            <svg className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0" />
            </svg>
          </div>

          <form id="login-form" onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className={`flex overflow-hidden rounded-[3px] border transition-all duration-200 ${errors.email ? "border-red-400" : "border-[#2d4b79]/20"}`}>
                <div className="w-[74px] flex items-center justify-center bg-[#01295d]">
                  <svg className="h-5 w-5 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#3f5d88] px-5 py-3.5 text-xl text-[#e4e7ee] placeholder:text-[#c9d0de] focus:outline-none"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-700">{errors.email}</p>}
            </div>

            <div>
              <div className={`flex overflow-hidden rounded-[3px] border transition-all duration-200 ${errors.password ? "border-red-400" : "border-[#2d4b79]/20"}`}>
                <div className="w-[74px] flex items-center justify-center bg-[#01295d]">
                  <svg className="h-5 w-5 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.5 4.5 0 10-9 0V10.5m-.75 0h10.5A1.5 1.5 0 0118.75 12v7.5A1.5 1.5 0 0117.25 21h-10.5a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-[#3f5d88] px-5 py-3.5 text-xl text-[#e4e7ee] placeholder:text-[#c9d0de] focus:outline-none"
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-700">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-3 text-[18px] text-[#394766]">
              <label htmlFor="remember" className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-[18px] w-[18px] rounded-[2px] border-[#01295d] bg-[#01295d] text-white focus:ring-[#01295d] focus:ring-1"
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="italic text-[#4c5e82] hover:text-[#2f4166] transition-colors">
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
        <div className="relative mx-auto mt-[-20px] w-[80%]">
          <div className="absolute inset-x-8 -top-2 h-10 rounded-full bg-[#24365f]/25 blur-xl pointer-events-none" />
          <button
            type="submit"
            form="login-form"
            disabled={isLoading}
            className="relative w-full rounded-[0_0_34px_34px] bg-white/95 py-4 text-xl font-semibold tracking-[0.22em] text-[#6a7392] shadow-[0_20px_30px_rgba(27,44,84,0.3)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "LOADING..." : "LOGIN"}
          </button>
        </div>

        <div className="mx-auto mt-8 w-full px-7 sm:px-14 space-y-5">
          <div className="text-center">
            <div className="h-px w-full bg-white/45" />
            <span className="mt-2 inline-block text-sm text-[#e9edf8]">Or continue with</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialLogin("github")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/20 px-4 py-3 text-sm font-semibold text-[#f2f4fb] transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5.5c-3.59 0-6.5 2.91-6.5 6.5 0 2.87 1.86 5.3 4.44 6.16.33.06.45-.14.45-.31 0-.16-.01-.67-.01-1.22-1.62.3-2.04-.4-2.17-.77-.08-.19-.44-.77-.75-.92-.25-.14-.61-.48-.01-.49.57-.01.98.52 1.12.73.65 1.1 1.7.79 2.11.6.06-.47.25-.79.46-.97-1.44-.16-2.95-.72-2.95-3.2 0-.71.26-1.29.68-1.74-.07-.17-.3-.83.06-1.73 0 0 .56-.18 1.83.66.53-.15 1.1-.22 1.67-.22.57 0 1.14.07 1.67.22 1.27-.85 1.83-.66 1.83-.66.36.9.13 1.56.06 1.73.42.45.68 1.02.68 1.74 0 2.49-1.51 3.03-2.96 3.2.23.2.44.58.44 1.18 0 .85-.01 1.53-.01 1.74 0 .17.12.37.45.31A6.51 6.51 0 0018.5 12c0-3.59-2.91-6.5-6.5-6.5z" />
              </svg>
              GitHub
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/20 px-4 py-3 text-sm font-semibold text-[#f2f4fb] transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>

          <p className="pt-1 text-center text-sm text-[#e9edf8]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={handleGoSignup}
              className="font-semibold text-white hover:text-[#f7f9ff] underline underline-offset-2"
            >
              Sign up
            </button>
          </p>

          <div className="text-center">
            <button
              type="button"
              onClick={handleGoHome}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#edf1fb] transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;