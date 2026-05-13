import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, allowedRole }) {

  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/" replace />
  }

  // ❌ Corrupted state
  if (!role) {
    localStorage.clear()
    return <Navigate to="/" replace />
  }

  // ❌ Wrong role
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={`/${role}`} replace />
  }

  // ✅ Allowed
  return children
}

export default ProtectedRoute