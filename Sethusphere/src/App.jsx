import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ContactProvider } from "./context/ContactContext";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { ContactsPage } from "./pages/ContactsPage";
import { ContactProfilePage } from "./pages/ContactProfilePage";
import { RelationshipsPage } from "./pages/RelationshipsPage";
import { InteractionsPage } from "./pages/InteractionsPage";
import { TasksPage } from "./pages/TasksPage";
import { GroupsPage } from "./pages/GroupsPage";
import { DuplicateDetectionPage } from "./pages/DuplicateDetectionPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ImportExportPage } from "./pages/ImportExportPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { VerifyOtpPage } from "./pages/VerifyOtpPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { apiRequest, getAuthToken, setAuthToken } from "./lib/api";

function AuthenticatedRoute({ children, allowIncomplete = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = React.useState({ status: "loading", user: null });

  React.useEffect(() => {
    let active = true;

    if (!getAuthToken()) {
      setState({ status: "unauthenticated", user: null });
      return undefined;
    }

    apiRequest("/auth/profile")
      .then(({ user }) => {
        if (active) setState({ status: "authenticated", user });
      })
      .catch(() => {
        if (!active) return;
        setAuthToken(null);
        setState({ status: "unauthenticated", user: null });
      });

    return () => {
      active = false;
    };
  }, [location.pathname]);

  React.useEffect(() => {
    if (state.status !== "authenticated" || allowIncomplete) return;
    if (!state.user.onboardingCompleted) {
      navigate("/onboarding", { replace: true });
    }
  }, [allowIncomplete, navigate, state]);

  if (state.status === "loading") {
    return <div className="min-h-screen bg-[#FBF9F5]" aria-busy="true" />;
  }

  if (state.status === "unauthenticated") {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (!allowIncomplete && !state.user.onboardingCompleted) {
    return <div className="min-h-screen bg-[#FBF9F5]" aria-busy="true" />;
  }

  return children;
}

export default function App() {
  return (
    <ContactProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route
            path="/onboarding"
            element={
              <AuthenticatedRoute allowIncomplete>
                <OnboardingPage />
              </AuthenticatedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/"
            element={
              <AuthenticatedRoute>
                <AppShell />
              </AuthenticatedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="contact-profile" element={<ContactProfilePage />} />
            <Route path="relationships" element={<RelationshipsPage />} />
            <Route path="interactions" element={<InteractionsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="duplicates" element={<DuplicateDetectionPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="import-export" element={<ImportExportPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContactProvider>
  );
}
