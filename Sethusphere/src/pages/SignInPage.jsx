import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthButton, AuthField, AuthHeading, AuthLayout } from "../components/auth/AuthLayout";
import { apiRequest, setAuthToken } from "../lib/api";

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: location.state?.email || "", password: "", remember: false });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providerError, setProviderError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!window.google || !import.meta.env.VITE_GOOGLE_CLIENT_ID) return;
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          try {
            const result = await apiRequest("/auth/provider-signin", {
              method: "POST",
              body: JSON.stringify({ provider: "google", credential }),
            });
            setAuthToken(result.token);
            navigate(result.user.onboardingCompleted ? "/" : "/onboarding");
          } catch (requestError) {
            setProviderError(requestError.message);
          }
        },
      });
    };
    document.head.appendChild(script);
    return () => script.remove();
  }, [navigate]);

  const signInWithGoogle = () => {
    if (!window.google) return setProviderError("Google sign-in is not configured.");
    window.google.accounts.id.prompt();
  };

  const signInWithApple = () => {
    setProviderError("Apple sign-in is unavailable until Apple provider configuration is supplied.");
  };

  return (
    <AuthLayout eyebrow="Welcome back to your workspace.">
      <AuthHeading title="Welcome back" description="Sign in to continue building meaningful professional relationships." />
      <form onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
          const result = await apiRequest("/auth/signin", {
            method: "POST",
            body: JSON.stringify({ email: form.email.trim(), password: form.password }),
          });
          setAuthToken(result.token);
          navigate(result.user.onboardingCompleted ? "/" : "/onboarding");
        } catch (requestError) {
          setError(requestError.message);
        } finally {
          setIsSubmitting(false);
        }
      }} className="space-y-4">
        <AuthField label="Work email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Enter work email" required />
        <label className="block text-sm font-semibold text-[#494C55]">
          Password
          <span className="relative mt-2 block">
            <input type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" required className="w-full rounded-xl border border-[#DCD7CE] bg-white px-3.5 py-3 pr-11 text-sm font-normal text-[#121316] outline-none transition placeholder:text-[#9C9FA8] focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757985]" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>
        <div className="flex items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 text-[#757985]"><input type="checkbox" checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} className="h-4 w-4 accent-[#722F37]" /> Remember me</label>
          <Link to="/forgot-password" className="font-semibold text-[#722F37] hover:text-[#5C1521]">Forgot password?</Link>
        </div>
        {error && <p className="text-xs font-semibold text-[#B91C1C]">{error}</p>}
        <AuthButton type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing In..." : "Sign In"}</AuthButton>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#9C9FA8]"><span className="h-px flex-1 bg-[#E5E0D8]" />OR CONTINUE WITH<span className="h-px flex-1 bg-[#E5E0D8]" /></div>
      <div className="flex justify-center gap-3">
        <button type="button" onClick={signInWithGoogle} title="Sign in with Google" aria-label="Sign in with Google" className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#DCD7CE] bg-white hover:bg-[#F5F2EB]">
          <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5Z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7Z" />
            <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.2l-6.3-5.3C29.7 35.1 27 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.4 39.7 16.1 44 24 44Z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.1 4.1-3.9 5.5l6.3 5.3C37.3 39.4 44 34 44 24c0-1.2-.1-2.4-.4-3.5Z" />
          </svg>
        </button>
        <button type="button" onClick={signInWithApple} title="Sign in with Apple" aria-label="Sign in with Apple" className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#DCD7CE] bg-white text-[#121316] hover:bg-[#F5F2EB]">
          <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true"><path d="M16.7 12.7c0-2.1 1.7-3.1 1.8-3.2-1-.1-2.2-1.1-3.7-1.1-1.2 0-2.4.7-3 0.7-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.1 2.6 2.1 1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1 2.6-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2-.8-2-2.2ZM14.7 7.1c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 0 1.9-.5 2.5-1.2Z" /></svg>
        </button>
      </div>
      {providerError && <p className="mt-2 text-xs font-semibold text-[#B91C1C]">{providerError}</p>}
      <p className="mt-7 text-center text-sm text-[#757985]">New to Sethusphere? <Link to="/signup" className="font-semibold text-[#722F37]">Create an account</Link></p>
    </AuthLayout>
  );
}
