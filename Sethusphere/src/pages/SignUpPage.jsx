import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthButton, AuthField, AuthHeading, AuthLayout } from "../components/auth/AuthLayout";
import { apiRequest } from "../lib/api";
import { isStrongPassword, passwordPolicyMessage } from "../lib/passwordPolicy";
import { AvatarPlaceholder } from "../components/common/AvatarPlaceholder";

export function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "", terms: false, avatar: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.terms) return setError("Please accept the workspace terms to continue.");
    if (!isStrongPassword(form.password)) return setError(passwordPolicyMessage);
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setError("");
    setIsSubmitting(true);
    try {
      const result = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
          email: form.email.trim(),
          password: form.password,
          avatar: form.avatar,
        }),
      });
      navigate("/verify-otp", {
        state: { next: "onboarding", email: form.email.trim(), devOtp: result.devOtp },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout eyebrow="Start with better context.">
      <AuthHeading title="Create your workspace" description="Set up your Sethusphere profile in a few thoughtful steps." />
      <form onSubmit={submit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-full border border-[#DCD7CE]">
            {form.avatar ? <img src={form.avatar} alt="Profile preview" className="h-full w-full object-cover" /> : <AvatarPlaceholder className="h-full w-full" />}
          </div>
          <label className="cursor-pointer rounded-xl border border-[#DCD7CE] bg-white px-3 py-2 text-xs font-semibold text-[#494C55]">
            Add profile image (optional)
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setError("Please choose a JPG, JPEG, PNG, or WEBP image.");
              const reader = new FileReader();
              reader.onload = () => setForm((current) => ({ ...current, avatar: reader.result }));
              reader.readAsDataURL(file);
            }} />
          </label>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthField label="First name" value={form.firstName} onChange={update("firstName")} placeholder="First name" required />
          <AuthField label="Last name" value={form.lastName} onChange={update("lastName")} placeholder="Last name" required />
        </div>
        <AuthField label="Work email" type="email" value={form.email} onChange={update("email")} placeholder="Enter work email" required />
        <label className="block text-sm font-semibold text-[#494C55]">Password<span className="relative mt-2 block"><input type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="Create a secure password" required className="w-full rounded-xl border border-[#DCD7CE] bg-white px-3.5 py-3 pr-11 text-sm font-normal text-[#121316] outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757985]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span><span className="mt-1 block text-xs font-normal text-[#757985]">{passwordPolicyMessage}</span></label>
        <AuthField label="Confirm password" type="password" value={form.confirm} onChange={update("confirm")} placeholder="Repeat your password" required />
        <label className="flex items-start gap-2 text-xs leading-relaxed text-[#757985]"><input type="checkbox" checked={form.terms} onChange={update("terms")} className="mt-0.5 h-4 w-4 shrink-0 accent-[#722F37]" /> I agree to the Sethusphere workspace terms and privacy guidelines.</label>
        {error && <p className="text-xs font-semibold text-[#B91C1C]">{error}</p>}
        <AuthButton type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating Account..." : "Create Account"}</AuthButton>
      </form>
      <p className="mt-7 text-center text-sm text-[#757985]">Already have an account? <Link to="/signin" className="font-semibold text-[#722F37]">Sign in</Link></p>
    </AuthLayout>
  );
}
