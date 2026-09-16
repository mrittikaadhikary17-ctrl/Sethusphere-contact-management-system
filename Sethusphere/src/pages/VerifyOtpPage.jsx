import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthButton, AuthField, AuthHeading, AuthLayout } from "../components/auth/AuthLayout";
import { apiRequest, setAuthToken } from "../lib/api";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const next = location.state?.next || "onboarding";
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const code = digits.join("");

  const updateDigit = (index, value) => {
    const numericValue = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((digit, currentIndex) => (
      currentIndex === index ? numericValue : digit
    )));
    if (numericValue && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedDigits) return;
    setDigits((current) => current.map((digit, index) => pastedDigits[index] || digit));
    inputRefs.current[Math.min(pastedDigits.length, 6) - 1]?.focus();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (code.length !== 6) return setMessage("Enter the 6-digit verification code to continue.");
    setMessage("");
    setIsSubmitting(true);
    try {
      const result = await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: location.state?.email, otp: code }),
      });
      setAuthToken(result.token);
      navigate(next === "reset" ? "/reset-password" : "/signin", {
        state: { email: location.state?.email, resetToken: location.state?.resetToken },
      });
    } catch (requestError) {
      setMessage(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout eyebrow="One small step to keep your workspace secure.">
      <AuthHeading eyebrow="Verification" title="Confirm your email" description={`Enter the 6-digit code sent to ${location.state?.email || "your work email"}.`} />
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#494C55]">Verification code</label>
          <div className="mt-2 flex gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => { inputRefs.current[index] = element; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                aria-label={`Verification digit ${index + 1}`}
                className="h-14 w-14 rounded-xl border border-[#DCD7CE] bg-white text-center text-xl font-semibold text-[#121316] outline-none transition focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10"
                required
              />
            ))}
          </div>
        </div>
        {message && <p className="text-xs font-semibold text-[#B91C1C]">{message}</p>}
        <AuthButton type="submit" disabled={isSubmitting}>{isSubmitting ? "Verifying..." : "Verify Code"}</AuthButton>
      </form>
      <div className="mt-6 flex items-center justify-between text-xs"><button type="button" onClick={() => setMessage("Please restart sign up to request a new verification code.")} className="font-semibold text-[#722F37]">Resend code</button><Link to="/signup" className="text-[#757985] hover:text-[#121316]">Change email</Link></div>
      <p className="mt-7 text-center text-sm text-[#757985]">Already verified? <Link to="/signin" className="font-semibold text-[#722F37]">Sign in</Link></p>
    </AuthLayout>
  );
}
