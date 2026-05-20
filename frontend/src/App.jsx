import { BrowserRouter , Routes, Route } from "react-router-dom"

import AddUser from "./pages/AddUser"
import ManageUsers from "./pages/ManageUsers"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import AdminLogs from "./pages/AdminLogs"
import UserDashboard from "./pages/UserDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import VendorDashboard from "./pages/VendorDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Signup from "./pages/Signup"
import { Toaster, toast } from "sonner"
import VendorReceive from "./pages/VendorReceive"
import VendorOrders from "./pages/VendorOrders"
import VendorReports from "./pages/VendorReports"
import VendorOffers from "./pages/VendorOffers"
import Scan from "./pages/Scan"
import Pay from "./pages/Pay"
import PaymentSuccess from "./pages/PaymentSuccess"


function App() {
  return (
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/user" element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/teacher" element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        <Route path="/vendor" element={
          <ProtectedRoute allowedRole="vendor">
            <VendorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/add-teacher" element={
          <ProtectedRoute allowedRole="admin">
            <AddUser role="teacher" />
          </ProtectedRoute>
        } />

        <Route path="/add-vendor" element={
          <ProtectedRoute allowedRole="admin">
            <AddUser role="vendor" />
          </ProtectedRoute>
        } />

        <Route path="/manage-users" element={
          <ProtectedRoute allowedRole="admin">
            <ManageUsers />
          </ProtectedRoute>
        } />

        <Route path="/logs"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLogs />
            </ProtectedRoute>
        }/>

        <Route path="/vendor/receive"
          element={
            <ProtectedRoute allowedRole="vendor">
              <VendorReceive />
            </ProtectedRoute>
          }
        />

        <Route path="/vendor/orders"
          element={
            <ProtectedRoute allowedRole="vendor">
              <VendorOrders />
            </ProtectedRoute>
          }
        />

        <Route path="/vendor/reports"
          element={
            <ProtectedRoute allowedRole="vendor">
              <VendorReports />
            </ProtectedRoute>
          }
        />

        <Route path="/vendor/offers"
          element={
            <ProtectedRoute allowedRole="vendor">
              <VendorOffers />
            </ProtectedRoute>
          }
        />

        <Route path="/scan"
            element={
              <ProtectedRoute allowedRole="user">
                <Scan />
              </ProtectedRoute>
            }
          />

        <Route path="/pay"
          element={
            <ProtectedRoute allowedRole="user">
              <Pay />
            </ProtectedRoute>
          }
        />

        <Route path="/success"
          element={
            <ProtectedRoute allowedRole="user">
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

      </Routes>
  )
}

export default App