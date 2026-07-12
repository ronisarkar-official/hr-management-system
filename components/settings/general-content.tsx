"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SettingsRow, Toggle } from "@/components/settings/settings-shared";

export function GeneralContent() {
  const [orgName, setOrgName] = React.useState("");
  const [orgCode, setOrgCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      const { supabase } = await import("@/lib/supabase/client");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { getMyProfile, getCompany } = await import("@/lib/actions/profile");
      const result = await getMyProfile(user.id);
      if (result.success && result.data) {
        const company = await getCompany(result.data.company_id);
        if (company.success && company.data) {
          setOrgName(company.data.name);
          setOrgCode(company.data.company_code);
        }
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">General</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Manage organization and workspace settings
      </p>

      <div className="mt-8">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
          Organization
        </h3>
        <div className="border-t border-border" />
        <div className="py-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Organization Name</Label>
            <Input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="h-8 max-w-sm"
              readOnly
            />
            <p className="text-[10px] text-muted-foreground">
              Contact support to change your organization name.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Company Code</Label>
            <Input
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value)}
              className="h-8 max-w-sm font-mono"
              readOnly
            />
            <p className="text-[10px] text-muted-foreground">
              Used for employee Login ID generation.
            </p>
          </div>
        </div>
        <div className="border-t border-border" />
        <SettingsRow
          label="Allow employee self-registration"
          description="Let employees create their own accounts using the company code"
          action={<Toggle />}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
          Regional Settings
        </h3>
        <div className="border-t border-border" />
        <SettingsRow
          label="Currency"
          description="Indian Rupee (₹)"
          action={
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
              INR
            </span>
          }
        />
        <div className="border-t border-border" />
        <SettingsRow
          label="Timezone"
          description="Asia/Kolkata (IST)"
          action={
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
              IST
            </span>
          }
        />
        <div className="border-t border-border" />
        <SettingsRow
          label="Date format"
          description="DD/MM/YYYY"
          action={
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
              en-IN
            </span>
          }
        />
      </div>

      {saved && (
        <p className="text-sm text-emerald-600 mt-4">Settings saved successfully.</p>
      )}
    </div>
  );
}
