"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useUser } from "@/hooks/useUser";
import { Mail, RefreshCw } from "lucide-react";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import { useCountdown } from "@/hooks/useCountDown";
import { maskEmail } from "@/lib/services";

function VerifyEmailBox() {
  const { data: user } = useUser();
  const [value, setValue] = useState("");
  const { verifyEmail, isVerifying, resendCode, isResending, resendSuccess } =
    useVerifyEmail();
  const { isActive, startCountdown, formatTime } = useCountdown();

  // Clear OTP input when code is resent successfully
  useEffect(() => {
    if (resendSuccess) {
      setValue("");
      startCountdown(180); // Start 3-minute countdown
    }
  }, [resendSuccess, startCountdown]);

  const handleVerify = () => {
    if (value.length !== 6) return;
    verifyEmail(value);
  };

  const handleResend = () => {
    if (!user?.id || isActive) return;
    resendCode(user.id);
  };

  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-xl border border-[#BF4008]/10 bg-[url('/assets/laptop-lady.jpg')] bg-cover bg-center p-2 shadow-sm sm:p-6">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-[#BF4008]/10"></div>
      <div className="absolute inset-0 bg-white/80"></div>

      {/* Content box */}
      <div className="relative z-10 w-full max-w-[340px] rounded-xl border border-[#F8E5DB] bg-white p-4 shadow-sm sm:max-w-md sm:p-8">
        <div className="mb-4 flex justify-center sm:mb-6">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FDF9F6] sm:h-16 sm:w-16">
            <Mail className="h-6 w-6 text-[#BF4008] sm:h-8 sm:w-8" />
          </div>
        </div>

        <h2 className="mb-2 text-center font-[Poppins] text-xl font-semibold tracking-tight text-[#2C2C2C] sm:mb-3 sm:text-2xl">
          Verify Your Email
        </h2>

        <p className="mb-4 text-center font-[Lato] text-sm text-[#404040] sm:mb-6 sm:text-base">
          We&apos;ve sent a verification code to your email address:
          <span className="mt-1 block font-medium">
            {user?.email ? maskEmail(user.email) : "your email"}
          </span>
        </p>

        <div className="mb-4 sm:mb-6">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}
            containerClassName="justify-center"
            disabled={isVerifying}
          >
            <InputOTPGroup className="gap-2 sm:gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="xs:text-lg h-11 w-11 rounded-lg border-[#F8E5DB] bg-[#FDF9F6] font-[IBM_Plex_Mono] text-base text-[#2C2C2C] focus:border-[#BF4008] focus:ring-[#BF4008]/20 sm:h-12 sm:w-12 sm:text-xl md:h-14 md:w-14 md:text-2xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Button
            onClick={handleVerify}
            disabled={value.length !== 6 || isVerifying}
            className="w-full bg-[#BF4008] font-[Lato] text-sm text-white transition-colors hover:bg-[#BF4008]/90 disabled:bg-[#BF4008]/50 sm:text-base"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isResending || !user?.id || isActive}
            className="w-full border-[#F8E5DB] font-[Lato] text-sm text-[#BF4008] transition-colors hover:bg-[#FDF9F6] hover:text-[#BF4008] sm:text-base"
          >
            {isResending ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : isActive ? (
              `Resend in ${formatTime()}`
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>

        <p className="mt-3 text-center font-[Lato] text-xs text-[#666666] sm:mt-4">
          Didn&apos;t receive a code? Check your spam folder or contact our
          support.
        </p>
      </div>
    </div>
  );
}

export default VerifyEmailBox;
