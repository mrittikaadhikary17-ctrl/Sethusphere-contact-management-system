import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthButton, AuthField, AuthHeading, AuthLayout } from "../components/auth/AuthLayout";
import { apiRequest } from "../lib/api";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    try {
      const result = await apiRequest("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: email.trim() }) });
      navigate("/verify-otp", { state: { next: "reset", email: email.trim(), resetToken: result.devResetToken } });
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  return <AuthLayout eyebrow="A calm reset for a busy workspace."><AuthHeading title="Forgot your password?" description="Enter your work email and we’ll take you through the secure reset flow." /><form onSubmit={submit} className="space-y-5"><AuthField label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter work email" required />{error && <p className="text-xs font-semibold text-[#B91C1C]">{error}</p>}<AuthButton type="submit">Continue to verification</AuthButton></form><p className="mt-7 text-center text-sm"><Link to="/signin" className="font-semibold text-[#722F37]">Back to Sign In</Link></p></AuthLayout>;
}
