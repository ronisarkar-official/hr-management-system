"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Lock,
  Save,
  X,
  Plus,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  Shield,
  User,
  Heart,
  Award,
  CreditCard,
  Pencil,
  Check,
  Clock,
  Globe,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/actions/profile";
import { getSalaryStructure } from "@/lib/actions/salary";
import { SalaryInfo } from "@/components/salary-info";
import { AvatarUpload } from "@/components/avatar-upload";
import type { Profile, SalaryStructure, SalaryComponent } from "@/lib/types";

interface EmployeeProfileViewProps {
  profile: Profile;
  isAdmin: boolean;
  readOnly: boolean;
  onSave?: () => void;
}

export function EmployeeProfileView({
  profile: initialProfile,
  isAdmin,
  readOnly,
  onSave,
}: EmployeeProfileViewProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newCert, setNewCert] = useState("");
  const [salaryData, setSalaryData] = useState<{
    structure: SalaryStructure;
    components: SalaryComponent[];
  } | null>(null);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const loadSalary = useCallback(async () => {
    const result = await getSalaryStructure(profile.id);
    if (result.success && result.data) {
      setSalaryData(result.data);
    }
  }, [profile.id]);

  useEffect(() => {
    loadSalary();
  }, [loadSalary]);

  const updateField = (field: string, value: string | string[] | object | null) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    const result = await updateProfile(profile.id, profile, isAdmin);
    if (result.success) {
      setSaveMsg("Profile updated successfully!");
      onSave?.();
    } else {
      setSaveMsg(result.error || "Failed to save.");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const skills = [...(profile.skills || []), newSkill.trim()];
      updateField("skills", skills);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const skills = [...(profile.skills || [])];
    skills.splice(index, 1);
    updateField("skills", skills);
  };

  const addCert = () => {
    if (newCert.trim()) {
      const certs = [...(profile.certifications || []), newCert.trim()];
      updateField("certifications", certs);
      setNewCert("");
    }
  };

  const removeCert = (index: number) => {
    const certs = [...(profile.certifications || [])];
    certs.splice(index, 1);
    updateField("certifications", certs);
  };

  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase();
  const canEdit = !readOnly;
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <div className="space-y-8">
      {/* ── Profile Hero ───────────────────────────────────────────── */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/10 via-primary/5 to-background" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div className="relative">
              {canEdit ? (
                <AvatarUpload
                  profileId={profile.id}
                  currentUrl={profile.profile_picture_url}
                  initials={initials}
                  onUpdate={(url) => {
                    setProfile((prev) => ({ ...prev, profile_picture_url: url }));
                  }}
                />
              ) : (
                <Avatar className="size-20 ring-4 ring-background shadow-md">
                  <AvatarImage src={profile.profile_picture_url || undefined} alt={fullName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-2 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
                  <p className="text-sm text-muted-foreground">
                    {profile.job_title || "—"} {profile.department ? `· ${profile.department}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <Badge variant={profile.role === "admin" ? "default" : "outline"} className="text-xs capitalize">
                    {profile.role}
                  </Badge>
                  {canEdit && (
                    <Button onClick={handleSave} disabled={saving} size="sm">
                      {saving ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 size-4" />
                      )}
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5" />
              {profile.login_id || "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {profile.email}
            </span>
            {profile.date_of_joining && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Joined {new Date(profile.date_of_joining).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {saveMsg && (
        <div
          className={`rounded-xl border px-5 py-3 text-sm flex items-center gap-2 ${
            saveMsg.includes("success")
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          {saveMsg.includes("success") ? <Check className="size-4" /> : <X className="size-4" />}
          {saveMsg}
        </div>
      )}

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="about" className="rounded-lg data-[state=active]:shadow-sm">About</TabsTrigger>
          <TabsTrigger value="private" className="rounded-lg data-[state=active]:shadow-sm">Personal Info</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:shadow-sm">Security</TabsTrigger>
          {(isAdmin || profile.role === "admin") && (
            <TabsTrigger value="salary" className="rounded-lg data-[state=active]:shadow-sm">Compensation</TabsTrigger>
          )}
        </TabsList>

        {/* ── Tab: About ──────────────────────────────────────────── */}
        <TabsContent value="about" className="mt-6 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <SectionHeading icon={<User className="size-4" />} title="About" />
            {canEdit ? (
              <Textarea
                placeholder="Tell us about yourself..."
                value={profile.about || ""}
                onChange={(e) => updateField("about", e.target.value)}
                rows={4}
                className="resize-none"
              />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.about || "No bio added yet."}
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <SectionHeading icon={<Globe className="size-4" />} title="Interests" />
            {canEdit ? (
              <Input
                placeholder="e.g., Photography, Hiking, Music"
                value={profile.interests || ""}
                onChange={(e) => updateField("interests", e.target.value)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {profile.interests || "—"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
              <SectionHeading icon={<Award className="size-4" />} title="Skills" />
              <div className="flex flex-wrap gap-2">
                {(profile.skills || []).length === 0 && (
                  <p className="text-sm text-muted-foreground">No skills added.</p>
                )}
                {(profile.skills || []).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs gap-1 px-3 py-1">
                    {skill}
                    {canEdit && (
                      <button onClick={() => removeSkill(i)} className="hover:text-destructive">
                        <X className="size-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="h-9"
                  />
                  <Button size="sm" variant="outline" onClick={addSkill} className="h-9 shrink-0">
                    <Plus className="size-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
              <SectionHeading icon={<Award className="size-4" />} title="Certifications" />
              <div className="space-y-2">
                {(profile.certifications || []).length === 0 && (
                  <p className="text-sm text-muted-foreground">No certifications added.</p>
                )}
                {(profile.certifications || []).map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
                  >
                    <span>{cert}</span>
                    {canEdit && (
                      <button onClick={() => removeCert(i)} className="text-muted-foreground hover:text-destructive">
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a certification"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCert())}
                    className="h-9"
                  />
                  <Button size="sm" variant="outline" onClick={addCert} className="h-9 shrink-0">
                    <Plus className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Tab: Personal Info ──────────────────────────────────── */}
        <TabsContent value="private" className="mt-6 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <SectionHeading icon={<User className="size-4" />} title="Personal Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <InfoField icon={<User />} label="First Name" value={profile.first_name} locked={!isAdmin} />
              <InfoField icon={<User />} label="Last Name" value={profile.last_name} locked={!isAdmin} />
              <InfoField icon={<Mail />} label="Work Email" value={profile.email} locked />
              <InlineEditField
                icon={<Mail />}
                label="Personal Email"
                value={profile.personal_email || ""}
                onChange={(v) => updateField("personal_email", v)}
                editable={canEdit}
              />
              <InlineEditField
                icon={<Heart />}
                label="Gender"
                value={profile.gender || ""}
                onChange={(v) => updateField("gender", v)}
                editable={canEdit}
              />
              <InlineEditField
                icon={<Heart />}
                label="Marital Status"
                value={profile.marital_status || ""}
                onChange={(v) => updateField("marital_status", v)}
                editable={canEdit}
              />
              <InlineEditField
                icon={<Calendar />}
                label="Date of Birth"
                value={profile.date_of_birth || ""}
                onChange={(v) => updateField("date_of_birth", v)}
                editable={canEdit}
                type="date"
              />
              <InlineEditField
                icon={<Globe />}
                label="Nationality"
                value={profile.nationality || ""}
                onChange={(v) => updateField("nationality", v)}
                editable={canEdit}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <SectionHeading icon={<Phone className="size-4" />} title="Contact" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InlineEditField
                icon={<Phone />}
                label="Phone"
                value={profile.phone || ""}
                onChange={(v) => updateField("phone", v)}
                editable={canEdit}
              />
              <InlineEditField
                icon={<MapPin />}
                label="Address"
                value={profile.address || ""}
                onChange={(v) => updateField("address", v)}
                editable={canEdit}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <SectionHeading icon={<User className="size-4" />} title="Emergency Contact" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InlineEditField
                icon={<User />}
                label="Contact Name"
                value={(profile.emergency_contact as { name?: string })?.name || ""}
                onChange={(v) =>
                  updateField("emergency_contact", {
                    ...(profile.emergency_contact || {}),
                    name: v,
                  })
                }
                editable={canEdit}
              />
              <InlineEditField
                icon={<Phone />}
                label="Contact Phone"
                value={(profile.emergency_contact as { phone?: string })?.phone || ""}
                onChange={(v) =>
                  updateField("emergency_contact", {
                    ...(profile.emergency_contact || {}),
                    phone: v,
                  })
                }
                editable={canEdit}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <SectionHeading icon={<CreditCard className="size-4" />} title="Financial & ID" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <InlineEditField
                icon={<CreditCard />}
                label="Bank Account No."
                value={profile.bank_account_no || ""}
                onChange={(v) => updateField("bank_account_no", v)}
                editable={canEdit}
              />
              <InlineEditField
                icon={<CreditCard />}
                label="Bank IFSC"
                value={profile.bank_ifsc || ""}
                onChange={(v) => updateField("bank_ifsc", v)}
                editable={canEdit}
              />
              <InlineEditField
                icon={<Shield />}
                label="Tax ID (PAN)"
                value={profile.tax_id || ""}
                onChange={(v) => updateField("tax_id", v)}
                editable={canEdit}
              />
              <InlineEditField
                icon={<Shield />}
                label="Government ID"
                value={profile.government_id || ""}
                onChange={(v) => updateField("government_id", v)}
                editable={canEdit}
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Tab: Security ──────────────────────────────────────── */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <SectionHeading icon={<Shield className="size-4" />} title="Account Info" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <InfoField icon={<Shield />} label="Login ID" value={profile.login_id || "—"} locked />
              <InfoField icon={<Mail />} label="Email" value={profile.email} locked />
              <InfoField icon={<Building />} label="Department" value={profile.department || "—"} locked={!isAdmin} />
              <InfoField icon={<Briefcase />} label="Job Title" value={profile.job_title || "—"} locked={!isAdmin} />
              <InfoField icon={<Calendar />} label="Date of Joining" value={profile.date_of_joining || "—"} locked />
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <SectionHeading icon={<Lock className="size-4" />} title="Change Password" />
            <ChangePasswordSection />
          </div>
        </TabsContent>

        {/* ── Tab: Compensation ──────────────────────────────────── */}
        {(isAdmin || profile.role === "admin") && (
          <TabsContent value="salary" className="mt-6">
            <div className="rounded-xl border bg-card shadow-sm p-6">
              <SalaryInfo
                profileId={profile.id}
                salaryData={salaryData}
                readOnly={!isAdmin}
                onUpdate={loadSalary}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

/* ── Section Heading ─────────────────────────────────────────────────── */

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-1">
      <span className="text-muted-foreground">{icon}</span>
      <h3 className="font-semibold text-sm tracking-tight">{title}</h3>
    </div>
  );
}

/* ── Info Field (read-only) ──────────────────────────────────────────── */

function InfoField({
  icon,
  label,
  value,
  locked,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  locked?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <span className="size-3.5 [&>svg]:size-3.5">{icon}</span>
        {label}
        {locked && <Lock className="size-3 text-muted-foreground/40" />}
      </Label>
      <p className="text-sm font-medium bg-muted/40 rounded-lg px-3.5 py-2.5 border border-border/50">{value}</p>
    </div>
  );
}

/* ── Inline Edit Field ───────────────────────────────────────────────── */

function InlineEditField({
  icon,
  label,
  value,
  onChange,
  editable,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  editable: boolean;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!editable) {
    return (
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <span className="size-3.5 [&>svg]:size-3.5">{icon}</span>
          {label}
        </Label>
        <p className="text-sm font-medium bg-muted/40 rounded-lg px-3.5 py-2.5 border border-border/50">
          {value || "—"}
        </p>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <span className="size-3.5 [&>svg]:size-3.5">{icon}</span>
          {label}
        </Label>
        <div className="flex gap-2">
          <Input
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-9 text-sm flex-1"
            autoFocus
          />
          <Button size="icon" variant="ghost" className="size-9 shrink-0 text-emerald-600" onClick={handleSave}>
            <Check className="size-4" />
          </Button>
          <Button size="icon" variant="ghost" className="size-9 shrink-0 text-muted-foreground" onClick={handleCancel}>
            <X className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 group">
      <Label className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <span className="size-3.5 [&>svg]:size-3.5">{icon}</span>
        {label}
      </Label>
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => setEditing(true)}
      >
        <p className="text-sm font-medium bg-muted/40 rounded-lg px-3.5 py-2.5 border border-border/50 flex-1">
          {value || <span className="text-muted-foreground italic">Not set</span>}
        </p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="size-3.5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

/* ── Change Password ────────────────────────────────────────────────── */

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (currentPassword === newPassword) {
      setMessage({ type: "error", text: "New password must differ from current." });
      return;
    }

    setChanging(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setChanging(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="current-password" className="text-xs font-medium">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-password" className="text-xs font-medium">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-password" className="text-xs font-medium">Confirm New Password</Label>
          <Button type="submit" disabled={changing} className="w-full h-9">
            {changing ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Lock className="mr-2 size-4" />
            )}
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
