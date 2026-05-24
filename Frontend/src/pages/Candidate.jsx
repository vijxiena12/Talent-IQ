import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Candidate() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file || !jd) {
      alert("Please upload a resume and enter job description");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis result
      const mockData = {
        finalScore: 87,
        breakdown: {
          overallMatch: 87,
          skillMatch: 92,
          experience: 82,
          keywords: 78,
          formatting: 88
        },
        matchingSkills: ["React", "JavaScript", "TypeScript", "Node.js", "MongoDB"],
        missingSkills: ["GraphQL", "AWS", "Docker"],
        suggestions: [
          "Add GraphQL experience to your resume",
          "Consider getting AWS certification",
          "Include more project descriptions with quantifiable results",
          "Highlight your experience with microservices architecture"
        ],
        highlightedResume: "Sample parsed resume content for display"
      };

      setResult(mockData);

      // SAVE HISTORY
      const history = JSON.parse(
        localStorage.getItem("history") || "[]"
      );

      history.push({
        ...mockData,
        date: new Date().toISOString()
      });

      localStorage.setItem(
        "history",
        JSON.stringify(history)
      );

    } catch (error) {
      console.error("Error:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#0f172a]">

      {/* HEADER */}
      <div className="border-b border-gray-300 bg-[#f5efe6]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <div className="flex items-center gap-4">
            <div className="text-2xl">📁</div>

            <h1 className="text-2xl font-black tracking-tight">
              CANDIDATE DASHBOARD
            </h1>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("isAuth");
              navigate("/");
            }}
            className="border-2 border-[#0f172a] px-5 py-2 rounded-full font-semibold hover:bg-[#0f172a] hover:text-white transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HERO */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-12">

          <div>
            <h2 className="text-6xl font-black leading-none">
              Performance{" "}
              <span className="text-red-500">
                Hub
              </span>
            </h2>

            <p className="mt-5 text-2xl text-slate-600 max-w-2xl leading-relaxed">
              Personalized insights and AI-driven career optimization based on
              your latest assessments.
            </p>
          </div>

          <button className="bg-[#020c2b] text-white px-10 py-5 rounded-3xl text-xl font-bold hover:scale-105 transition">
            Take New Assessment ↗
          </button>

        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* SCORE */}
            <div className="bg-white border-[3px] border-[#0f172a] rounded-[40px] p-8 shadow-lg">

              <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
                Average
              </p>

              <h3 className="text-6xl font-black mt-4">
                {result?.final_score || 0}%
              </h3>

              <p className="mt-4 text-slate-500 font-semibold">
                Overall Fitness
              </p>

            </div>

            {/* HISTORY */}
            <div className="bg-[#020c2b] text-white rounded-[40px] p-8 shadow-lg">

              <p className="text-sm font-bold tracking-widest uppercase opacity-70">
                Count
              </p>

              <h3 className="text-6xl font-black mt-4">
                {JSON.parse(localStorage.getItem("history") || "[]").length}
              </h3>

              <p className="mt-4 opacity-70 font-semibold">
                Assessments
              </p>

            </div>

            {/* SKILL SCORE */}
            <div className="bg-white border-[3px] border-[#0f172a] rounded-[40px] p-8 shadow-lg">

              <div className="flex justify-between items-center">

                <p className="font-bold uppercase tracking-wide">
                  Skills Trend
                </p>

                <span className="bg-[#020c2b] text-white px-3 py-1 rounded-full text-xs">
                  Latest
                </span>

              </div>

              <h3 className="text-5xl font-black mt-6">
                {result?.skill_score || 0}%
              </h3>

              <div className="w-full h-3 bg-gray-200 rounded-full mt-6 overflow-hidden">

                <div
                  className="h-full bg-[#020c2b]"
                  style={{
                    width: `${result?.skill_score || 0}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 bg-white border-[4px] border-[#0f172a] rounded-[50px] p-10 shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-start">

              <div>

                <h3 className="text-5xl font-black">
                  AI Resume Insights
                </h3>

                <p className="mt-3 text-slate-600 text-lg">
                  Based on your latest upload:
                  <span className="font-bold ml-2">
                    {file ? file.name : "N/A"}
                  </span>
                </p>

              </div>

              <div className="w-24 h-24 rounded-3xl bg-[#f5efe6] flex items-center justify-center text-4xl">
                💡
              </div>

            </div>

            {/* FORM */}
            <div className="mt-10 border-4 border-dashed border-gray-300 rounded-[40px] p-10">

              {/* FILE */}
              <div className="text-center">

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  id="resume"
                  className="hidden"
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                />

                <label
                  htmlFor="resume"
                  className="cursor-pointer"
                >

                  <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-5xl">
                    📄
                  </div>

                  <p className="mt-6 text-3xl font-bold">
                    {file
                      ? file.name
                      : "Upload Resume"}
                  </p>

                  <p className="mt-3 text-slate-500 font-semibold">
                    PDF FILES ONLY (MAX 10MB)
                  </p>

                </label>

              </div>

              {/* JOB TITLE */}
              <div className="mt-10">

                <label className="font-black text-2xl uppercase">
                  Target Job Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full mt-4 p-5 rounded-2xl border border-gray-300 text-xl"
                />

              </div>

              {/* JOB DESCRIPTION */}
              <div className="mt-8">

                <label className="font-black text-2xl uppercase">
                  Job Description
                </label>

                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full mt-4 h-64 p-6 rounded-3xl border border-gray-300 text-xl resize-none"
                />

              </div>

              {/* BUTTON */}
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full mt-10 bg-[#e8848d] hover:bg-[#d96d77] text-white text-3xl font-black py-7 rounded-3xl transition"
              >

                {isLoading
                  ? "Analyzing Requirements..."
                  : "Run Analysis Now"}

              </button>

            </div>

            {/* RESULTS */}
            {result && (
              <>

                {/* SCORE CARDS */}
                <div className="mt-12 border-t pt-10">

                  <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-green-50 rounded-3xl p-8">

                      <h4 className="text-xl font-bold text-green-800">
                        Overall Match
                      </h4>

                      <p className="text-6xl font-black mt-4 text-green-700">
                        {result.final_score || result.overall}%
                      </p>

                    </div>

                    <div className="bg-blue-50 rounded-3xl p-8">

                      <h4 className="text-xl font-bold text-blue-800">
                        Skills Match
                      </h4>

                      <p className="text-6xl font-black mt-4 text-blue-700">
                        {result.skill_score}%
                      </p>

                    </div>

                    <div className="bg-purple-50 rounded-3xl p-8">

                      <h4 className="text-xl font-bold text-purple-800">
                        Experience Match
                      </h4>

                      <p className="text-6xl font-black mt-4 text-purple-700">
                        {result.experience_score}%
                      </p>

                    </div>

                  </div>

                </div>

                {/* SKILLS */}
                <div className="grid md:grid-cols-2 gap-8 mt-10">

                  <div className="bg-green-50 rounded-3xl p-8">

                    <h4 className="text-2xl font-black text-green-900 mb-6">
                      ✅ Matched Skills
                    </h4>

                    <div className="flex flex-wrap gap-3">

                      {result.matched_skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-green-200 text-green-900 px-4 py-2 rounded-full font-semibold"
                        >
                          {skill}
                        </span>
                      ))}

                    </div>

                  </div>

                  <div className="bg-red-50 rounded-3xl p-8">

                    <h4 className="text-2xl font-black text-red-900 mb-6">
                      ❌ Missing Skills
                    </h4>

                    <div className="flex flex-wrap gap-3">

                      {result.missing_skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-red-200 text-red-900 px-4 py-2 rounded-full font-semibold"
                        >
                          {skill}
                        </span>
                      ))}

                    </div>

                  </div>

                </div>

                {/* AI RECOMMENDATIONS */}
                <div className="mt-10 bg-blue-50 rounded-3xl p-8">

                  <h4 className="text-3xl font-black text-blue-900 mb-6">
                    💡 AI Recommendations
                  </h4>

                  <div className="space-y-4">

                    {result.suggestions?.map((suggestion, index) => (
                      <div
                        key={index}
                        className="bg-white p-5 rounded-2xl shadow-sm"
                      >
                        {suggestion}
                      </div>
                    ))}

                  </div>

                </div>

              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Candidate;