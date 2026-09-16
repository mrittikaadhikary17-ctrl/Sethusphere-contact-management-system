import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export function PhoneInputField({
  label,
  value,
  onChange,
  placeholder = "Enter phone number",
  required = false,
}) {
  return (
    <label className="block text-sm font-semibold text-[#494C55]">
      {label}
      <PhoneInput
        international
        value={value || ""}
        onChange={(phone) => onChange(phone || "")}
        placeholder={placeholder}
        required={required}
        countrySelectProps={{ "aria-label": "Select country", className: "h-full" }}
        style={{
          "--PhoneInputCountryFlag-height": "1.25em",
          "--PhoneInputCountrySelect-marginRight": "0.75rem",
        }}
        className="phone-input mt-2 flex h-[46px] w-full min-w-0 items-stretch overflow-hidden rounded-xl border border-[#DCD7CE] bg-white px-3.5 text-sm font-normal text-[#121316] focus-within:border-[#722F37] focus-within:ring-2 focus-within:ring-[#722F37]/10"
        inputClassName="h-full min-w-0 flex-1 bg-transparent py-0 text-sm text-[#121316] outline-none placeholder:text-[#9C9FA8]"
      />
    </label>
  );
}
