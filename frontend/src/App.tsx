import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { LiveMap } from "@/pages/LiveMap";
import { Trips } from "@/pages/Trips";
import { Shipments } from "@/pages/Shipments";
import { Vehicles } from "@/pages/Vehicles";
import { VehicleDetail } from "@/pages/VehicleDetail";
import { Drivers } from "@/pages/Drivers";
import { Maintenance } from "@/pages/Maintenance";
import { Documents } from "@/pages/Documents";
import { Fuel } from "@/pages/Fuel";
import { Expenses } from "@/pages/Expenses";
import { Reports } from "@/pages/Reports";
import { AIInsights } from "@/pages/AIInsights";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { Unauthorized } from "@/pages/Unauthorized";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="live-map" element={<RoleGuard resource="vehicle"><LiveMap /></RoleGuard>} />
            <Route path="trips" element={<RoleGuard resource="trip"><Trips /></RoleGuard>} />
            <Route path="shipments" element={<RoleGuard resource="shipment"><Shipments /></RoleGuard>} />
            <Route path="vehicles" element={<RoleGuard resource="vehicle"><Vehicles /></RoleGuard>} />
            <Route path="vehicles/:id" element={<RoleGuard resource="vehicle"><VehicleDetail /></RoleGuard>} />
            <Route path="drivers" element={<RoleGuard resource="driver"><Drivers /></RoleGuard>} />
            <Route path="maintenance" element={<RoleGuard resource="maintenance"><Maintenance /></RoleGuard>} />
            <Route path="documents" element={<RoleGuard resource="document"><Documents /></RoleGuard>} />
            <Route path="fuel" element={<RoleGuard resource="fuel"><Fuel /></RoleGuard>} />
            <Route path="expenses" element={<RoleGuard resource="expense"><Expenses /></RoleGuard>} />
            <Route path="reports" element={<RoleGuard resource="report"><Reports /></RoleGuard>} />
            <Route path="ai-insights" element={<RoleGuard resource="report"><AIInsights /></RoleGuard>} />
            <Route path="notifications" element={<RoleGuard resource="notification"><NotificationsPage /></RoleGuard>} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}