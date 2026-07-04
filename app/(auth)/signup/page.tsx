"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  Hash,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpCompanyAdmin } from "@/lib/actions/auth";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Password Security Rules
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isPasswordValid =
    hasMinLength && hasUpperLower && hasNumber && hasSpecial && passwordsMatch;

  // Company code validation
  const isCompanyCodeValid =
    companyCode.length >= 2 &&
    companyCode.length <= 6 &&
    /^[A-Za-z]+$/.test(companyCode);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!hasMinLength || !hasUpperLower || !hasNumber || !hasSpecial) {
      setError("Password does not meet all security rules listed below.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (!isCompanyCodeValid) {
      setError("Company code must be 2-6 letters (A-Z).");
      return;
    }

    setLoading(true);

    try {
      const result = await signUpCompanyAdmin({
        companyName: companyName.trim(),
        companyCode: companyCode.toUpperCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      if (!result.success) {
        setError(result.error || "Something went wrong during registration.");
        return;
      }

      // Sign in the user immediately after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setSuccessMsg(
          "Company created successfully! Please sign in with your credentials."
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Create your company
        </h2>
        <p className="text-muted-foreground text-sm">
          Set up your organization&apos;s HRMS portal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
            {successMsg}
          </div>
        )}

        {/* Company Info */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="companyName"
              type="text"
              placeholder="Acme Corporation"
              className="h-9 pl-10"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyCode">
            Company Code{" "}
            <span className="text-muted-foreground font-normal">
              (2-6 letters, used in Login IDs)
            </span>
          </Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="companyCode"
              type="text"
              placeholder="ACME"
              className="h-9 pl-10 uppercase"
              value={companyCode}
              onChange={(e) =>
                setCompanyCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6))
              }
              required
              minLength={2}
              maxLength={6}
            />
          </div>
        </div>

        {/* Admin Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                className="h-9 pl-10"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="h-9"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="admin@company.com"
              className="h-9 pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              className="h-9 pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              className="h-9 pl-10 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Password Security Checklist */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-2 text-xs border border-border/50">
          <p className="font-semibold text-muted-foreground">
            Password Security Rules:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <RequirementItem met={hasMinLength} text="At least 8 characters" />
            <RequirementItem met={hasUpperLower} text="Uppercase & lowercase" />
            <RequirementItem met={hasNumber} text="At least 1 number (0-9)" />
            <RequirementItem
              met={hasSpecial}
              text="At least 1 special symbol"
            />
            <RequirementItem met={passwordsMatch} text="Passwords match" />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-9 text-sm font-medium"
          disabled={loading || !isPasswordValid || !isCompanyCodeValid || !!successMsg}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating company…
            </>
          ) : (
            "Create company & admin account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 transition-colors ${
        met
          ? "text-emerald-600 dark:text-emerald-400 font-medium"
          : "text-muted-foreground"
      }`}
    >
      {met ? (
        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
      ) : (
        <XCircle className="size-3.5 shrink-0 text-muted-foreground/60" />
      )}
      <span>{text}</span>
    </div>
  );
}
