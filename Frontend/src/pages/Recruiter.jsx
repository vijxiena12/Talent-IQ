import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Charts";
import Card from "../components/JobDescription";
import LoadingSpinner from "../components/ResumePreview";

function Recruiter() {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (files.length === 0 || !jd) {
      alert("Please upload resumes and enter job description");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results for demo
      const mockResults = [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          score: 92,
          skills: ["React", "TypeScript", "Node.js", "MongoDB"],
          experience: "5 years",
          status: "shortlisted"
        },
        {
          id: "2",
          name: "Michael Chen",
          email: "m.chen@email.com",
          score: 88,
          skills: ["React", "JavaScript", "Python", "AWS"],
          experience: "4 years",
          status: "review"
        },
        {
          id: "3",
          name: "Emily Davis",
          email: "emily.d@email.com",
          score: 75,
          skills: ["React", "CSS", "JavaScript", "Git"],
          experience: "3 years",
          status: "review"
        },
        {
          id: "4",
          name: "James Wilson",
          email: "j.wilson@email.com",
          score: 65,
          skills: ["HTML", "CSS", "JavaScript"],
          experience: "2 years",
          status: "rejected"
        }
      ];
      
      setResults(mockResults);
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">💼</span>
                </div>
                <span className="text-xl font-bold text-gray-900">TalentIQ</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem("isAuth");
                  navigate("/");
                }}
                size="sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recruiter Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Upload multiple resumes and analyze them against your job description
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Upload */}
            <Card>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Resumes
                </h2>
                <p className="text-gray-600">
                  Upload multiple resumes to analyze them against the job description
                </p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📁</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {files.length > 0 ? `${files.length} files selected` : "Click to upload resumes"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    PDF, DOC, DOCX (max 10MB each)
                  </p>
                </label>
              </div>
              
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                  <div className="space-y-1">
                    {files.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Job Description */}
            <Card>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Job Description
                </h2>
                <p className="text-gray-600">
                  Enter the job description for analysis
                </p>
              </div>
              
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Enter the job description here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
              />
              
              <Button
                onClick={handleAnalyze}
                disabled={files.length === 0 || !jd || isLoading}
                className="w-full mt-4"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Analyzing Resumes...
                  </>
                ) : (
                  `Analyze ${files.length} Resume${files.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </Card>

            {/* Results Table */}
            {results.length > 0 && (
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Analysis Results
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Match Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {candidate.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {candidate.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-lg font-bold ${getScoreColor(candidate.score)}`}>
                              {candidate.score}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {candidate.experience}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                              {candidate.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              View
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hiring Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Candidates</span>
                  <span className="font-medium">{results.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shortlisted</span>
                  <span className="text-green-600 font-medium">
                    {results.filter(r => r.status === 'shortlisted').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Under Review</span>
                  <span className="text-yellow-600 font-medium">
                    {results.filter(r => r.status === 'review').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rejected</span>
                  <span className="text-red-600 font-medium">
                    {results.filter(r => r.status === 'rejected').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Match Score</span>
                  <span className="font-medium">
                    {results.length > 0 
                      ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
                      : 0}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Top Skills */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Skills Found
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.length > 0 && (
                  [...new Set(results.flatMap(r => r.skills))].slice(0, 8).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Recruiter Tip
              </h3>
              <p className="text-blue-800 text-sm">
                Focus on candidates with 80%+ match scores for better hiring success rates!
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Recruiter;