"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";
import { updateProfile } from "@/lib/actions/profile";
import { getSalaryStructure } from "@/lib/actions/salary";
import { SalaryInfo } from "@/components/salary-info";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-xl font-bold">
            {profile.first_name} {profile.last_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {profile.job_title || "—"} • {profile.department || "—"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {profile.login_id || "—"}
            </Badge>
            <Badge variant={profile.role === "admin" ? "default" : "outline"} className="text-xs">
              {profile.role === "admin" ? "Admin" : "Employee"}
            </Badge>
          </div>
        </div>
        {canEdit && (
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Save Changes
          </Button>
        )}
      </div>

      {saveMsg && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            saveMsg.includes("success")
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          {saveMsg}
        </div>
      )}

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="about">Resume / About</TabsTrigger>
          <TabsTrigger value="private">Private Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {(isAdmin || profile.role === "admin") && (
            <TabsTrigger value="salary">Salary Info</TabsTrigger>
          )}
        </TabsList>

        {/* ── Tab: Resume / About ───────────────────────────────── */}
        <TabsContent value="about" className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>About</Label>
            {canEdit ? (
              <Textarea
                placeholder="Tell us about yourself..."
                value={profile.about || ""}
                onChange={(e) => updateField("about", e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                {profile.about || "No bio added yet."}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
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

          <Separator />

          {/* Skills */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Award className="size-4" />
              Skills
            </Label>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {skill}
                  {canEdit && (
                    <button onClick={() => removeSkill(i)} className="ml-1.5">
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
                  className="h-8 max-w-xs"
                />
                <Button size="sm" variant="outline" onClick={addSkill} className="h-8">
                  <Plus className="size-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Award className="size-4" />
              Certifications
            </Label>
            <div className="space-y-1.5">
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
                  className="h-8 max-w-xs"
                />
                <Button size="sm" variant="outline" onClick={addCert} className="h-8">
                  <Plus className="size-3" />
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Tab: Private Info ──────────────────────────────────── */}
        <TabsContent value="private" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow icon={<User />} label="First Name" value={profile.first_name} locked={!isAdmin} />
            <FieldRow icon={<User />} label="Last Name" value={profile.last_name} locked={!isAdmin} />
            <FieldRow icon={<Mail />} label="Work Email" value={profile.email} locked />
            <EditableField
              icon={<Mail />}
              label="Personal Email"
              value={profile.personal_email || ""}
              onChange={(v) => updateField("personal_email", v)}
              editable={canEdit}
            />
            <EditableField
              icon={<Phone />}
              label="Phone"
              value={profile.phone || ""}
              onChange={(v) => updateField("phone", v)}
              editable={canEdit}
            />
            <EditableField
              icon={<MapPin />}
              label="Address"
              value={profile.address || ""}
              onChange={(v) => updateField("address", v)}
              editable={canEdit}
            />
            <EditableField
              icon={<Heart />}
              label="Gender"
              value={profile.gender || ""}
              onChange={(v) => updateField("gender", v)}
              editable={canEdit}
            />
            <EditableField
              icon={<Heart />}
              label="Marital Status"
              value={profile.marital_status || ""}
              onChange={(v) => updateField("marital_status", v)}
              editable={canEdit}
            />
            <EditableField
              icon={<Calendar />}
              label="Date of Birth"
              value={profile.date_of_birth || ""}
              onChange={(v) => updateField("date_of_birth", v)}
              editable={canEdit}
              type="date"
            />
            <EditableField
              icon={<MapPin />}
              label="Nationality"
              value={profile.nationality || ""}
              onChange={(v) => updateField("nationality", v)}
              editable={canEdit}
            />
          </div>

          <Separator />
          <h4 className="font-semibold text-sm">Emergency Contact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditableField
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
            <EditableField
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

          <Separator />
          <h4 className="font-semibold text-sm">Financial & ID Info</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditableField
              icon={<CreditCard />}
              label="Bank Account No."
              value={profile.bank_account_no || ""}
              onChange={(v) => updateField("bank_account_no", v)}
              editable={canEdit}
            />
            <EditableField
              icon={<CreditCard />}
              label="Bank IFSC"
              value={profile.bank_ifsc || ""}
              onChange={(v) => updateField("bank_ifsc", v)}
              editable={canEdit}
            />
            <EditableField
              icon={<Shield />}
              label="Tax ID (PAN)"
              value={profile.tax_id || ""}
              onChange={(v) => updateField("tax_id", v)}
              editable={canEdit}
            />
            <EditableField
              icon={<Shield />}
              label="Government ID (Aadhaar)"
              value={profile.government_id || ""}
              onChange={(v) => updateField("government_id", v)}
              editable={canEdit}
            />
          </div>
        </TabsContent>

        {/* ── Tab: Security ──────────────────────────────────────── */}
        <TabsContent value="security" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow icon={<Shield />} label="Login ID" value={profile.login_id || "—"} locked />
            <FieldRow icon={<Mail />} label="Email" value={profile.email} locked />
            <FieldRow icon={<Building />} label="Department" value={profile.department || "—"} locked={!isAdmin} />
            <FieldRow icon={<Briefcase />} label="Job Title" value={profile.job_title || "—"} locked={!isAdmin} />
            <FieldRow icon={<Calendar />} label="Date of Joining" value={profile.date_of_joining || "—"} locked />
          </div>
        </TabsContent>

        {/* ── Tab: Salary Info ───────────────────────────────────── */}
        {(isAdmin || profile.role === "admin") && (
          <TabsContent value="salary" className="mt-4">
            <SalaryInfo
              profileId={profile.id}
              salaryData={salaryData}
              readOnly={!isAdmin}
              onUpdate={loadSalary}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

/* ── Field helper components ─────────────────────────────────────────── */

function FieldRow({
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
      <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="size-3.5 [&>svg]:size-3.5">{icon}</span>
        {label}
        {locked && <Lock className="size-3 text-muted-foreground/50" />}
      </Label>
      <p className="text-sm font-medium bg-muted/50 rounded-md px-3 py-2">{value}</p>
    </div>
  );
}

function EditableField({
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
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="size-3.5 [&>svg]:size-3.5">{icon}</span>
        {label}
      </Label>
      {editable ? (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-sm"
        />
      ) : (
        <p className="text-sm font-medium bg-muted/50 rounded-md px-3 py-2">
          {value || "—"}
        </p>
      )}
    </div>
  );
}
