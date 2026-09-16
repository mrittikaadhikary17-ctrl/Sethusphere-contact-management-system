import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthButton, AuthHeading, AuthLayout } from "../components/auth/AuthLayout";
import { apiRequest } from "../lib/api";
import { isStrongPassword, passwordPolicyMessage } from "../lib/passwordPolicy";
import { useLocation } from "react-router-dom";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    if (!isStrongPassword(password)) return setError(passwordPolicyMessage);
    if (password !== confirm) return setError("Passwords do not match.");
    try {
      await apiRequest("/auth/reset-password", { method: "POST", body: JSON.stringify({ token: location.state?.resetToken || "", password }) });
      navigate("/signin");
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  return <AuthLayout eyebrow="Return to focused relationship work."><AuthHeading title="Set a new password" description="Choose a new password for your Sethusphere workspace." /><form onSubmit={submit} className="space-y-4"><label className="block text-sm font-semibold text-[#494C55]">New password<span className="relative mt-2 block"><input type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#DCD7CE] bg-white px-3.5 py-3 pr-11 text-sm font-normal outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10" required /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757985]" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label><label className="block text-sm font-semibold text-[#494C55]">Confirm password<input type={show ? "text" : "password"} value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-2 w-full rounded-xl border border-[#DCD7CE] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10" required /></label>{error && <p className="text-xs font-semibold text-[#B91C1C]">{error}</p>}<AuthButton type="submit">Reset Password</AuthButton></form><p className="mt-7 text-center text-sm"><Link to="/signin" className="font-semibold text-[#722F37]">Back to Sign In</Link></p></AuthLayout>;
}
