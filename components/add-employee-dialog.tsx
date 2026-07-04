"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { createEmployee } from "@/lib/actions/auth";

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Sales & Marketing",
  "Human Resources",
  "Finance",
  "Operations",
  "Legal",
  "Customer Support",
  "Other",
];

interface AddEmployeeDialogProps {
  adminUserId: string;
  onSuccess?: () => void;
}

export function AddEmployeeDialog({ adminUserId, onSuccess }: AddEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Success state
  const [createdLoginId, setCreatedLoginId] = useState("");
  const [createdTempPassword, setCreatedTempPassword] = useState("");

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setJobTitle("");
    setDateOfJoining(new Date().toISOString().split("T")[0]);
    setError("");
    setStep("form");
    setCopiedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await createEmployee({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      department: department || undefined,
      jobTitle: jobTitle || undefined,
      dateOfJoining,
      adminUserId,
    });

    if (!result.success) {
      setError(result.error || "Failed to create employee.");
      setLoading(false);
      return;
    }

    setCreatedLoginId(result.data!.loginId);
    setCreatedTempPassword(result.data!.tempPassword);
    setStep("success");
    setLoading(false);
    onSuccess?.();
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetForm, 200);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(resetForm, 200); }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create a new employee account. They&apos;ll receive a Login ID and
                temporary password to sign in.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="emp-firstName" className="text-xs">First Name</Label>
                  <Input
                    id="emp-firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="h-8"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emp-lastName" className="text-xs">Last Name</Label>
                  <Input
                    id="emp-lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="h-8"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-email" className="text-xs">Email</Label>
                <Input
                  id="emp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-8"
                  placeholder="employee@company.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-phone" className="text-xs">Phone (optional)</Label>
                <Input
                  id="emp-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-8"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emp-jobTitle" className="text-xs">Job Title</Label>
                  <Input
                    id="emp-jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="h-8"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emp-doj" className="text-xs">Date of Joining</Label>
                <Input
                  id="emp-doj"
                  type="date"
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  className="h-8"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} size="sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} size="sm">
                  {loading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 size-4" />
                  )}
                  Create Employee
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="size-5" />
                Employee Created
              </DialogTitle>
              <DialogDescription>
                Share these credentials with the employee securely. They can use
                either the Login ID or email to sign in.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Login ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-bold flex-1 bg-background rounded px-2 py-1 border">
                      {createdLoginId}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() => copyToClipboard(createdLoginId, "loginId")}
                    >
                      {copiedField === "loginId" ? (
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    Temporary Password
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-bold flex-1 bg-background rounded px-2 py-1 border">
                      {createdTempPassword}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() => copyToClipboard(createdTempPassword, "password")}
                    >
                      {copiedField === "password" ? (
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                The employee should change their password after first login.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} size="sm">
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
