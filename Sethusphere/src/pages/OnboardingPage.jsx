import React, { useState } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthButton, AuthField, AuthHeading, AuthLayout } from "../components/auth/AuthLayout";
import { PhoneInputField } from "../components/common/PhoneInputField";
import { useContacts } from "../context/ContactContext";
import { apiRequest } from "../lib/api";

export function OnboardingPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useContacts();
  const [form, setForm] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    avatar: profile.avatar || "",
    email: profile.email || "",
    phone: "",
    title: "",
    company: profile.company || "",
    industry: profile.industry || "",
    location: profile.location || "",
    bio: profile.bio || ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file for your profile photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("First name, last name, and work email are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await apiRequest("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          ...form,
          designation: form.title,
          name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        }),
      });
      updateProfile({
        ...form,
        ...result.user,
        title: result.user.designation || form.title,
        avatar: result.user.avatar || form.avatar,
      });
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout eyebrow="Make your next conversation count.">
      <AuthHeading
        eyebrow="Profile setup"
        title="Complete your profile"
        description="Add the context that helps Sethusphere make your relationship workspace feel like yours."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4 rounded-2xl border border-[#E5E0D8] bg-white p-4">
          <img
            src={form.avatar || profile.avatar}
            alt="Profile preview"
            className="h-16 w-16 rounded-2xl border border-[#DCD7CE] object-cover"
          />
          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#DCD7CE] bg-[#F5F2EB] px-3 py-2 text-xs font-semibold text-[#121316] hover:bg-[#EDE8DF]">
              <Camera className="h-4 w-4" />
              Add profile photo
              <input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" />
            </label>
            <p className="mt-1 text-[11px] text-[#9C9FA8]">Optional · JPG, PNG or GIF</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthField label="First name" value={form.firstName} onChange={update("firstName")} required />
          <AuthField label="Last name" value={form.lastName} onChange={update("lastName")} required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthField label="Work email" type="email" value={form.email} onChange={update("email")} required />
          <PhoneInputField
            label="Phone number"
            value={form.phone}
            onChange={(phone) => setForm((current) => ({ ...current, phone }))}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthField label="Professional designation" value={form.title} onChange={update("title")} placeholder="Enter professional designation" />
          <AuthField label="Company" value={form.company} onChange={update("company")} placeholder="Enter company name" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthField label="Industry" value={form.industry} onChange={update("industry")} placeholder="Enter industry" />
          <AuthField label="Location" value={form.location} onChange={update("location")} placeholder="Enter location" />
        </div>
        <label className="block text-sm font-semibold text-[#494C55]">
          Short bio
          <textarea
            value={form.bio}
            onChange={update("bio")}
            rows={3}
            placeholder="A short introduction for your workspace profile"
            className="mt-2 w-full resize-y rounded-xl border border-[#DCD7CE] bg-white px-3.5 py-3 text-sm font-normal text-[#121316] outline-none placeholder:text-[#9C9FA8] focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10"
          />
        </label>
        {error && <p className="text-xs font-semibold text-[#B91C1C]">{error}</p>}
        <AuthButton type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving Profile..." : "Complete Profile"}</AuthButton>
      </form>
    </AuthLayout>
  );
}
