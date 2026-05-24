import { Navigate } from "react-router-dom"
import IndividualDashboard from "@/pages/Individual/IndividualDashboard"

export default function Dashboard() {
  const userStr = localStorage.getItem("user")
  
  if (!userStr) {
    return <Navigate to="/login" replace />
  }

  const user = JSON.parse(userStr)
  
  if (user.role === "RECRUITER") {
    return <Navigate to="/insights" replace />
  }

  return <IndividualDashboard />
}
