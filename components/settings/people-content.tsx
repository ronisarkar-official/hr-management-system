"use client";

import * as React from "react";
import { SettingsRow, Toggle } from "@/components/settings/settings-shared";
import { Badge } from "@/components/ui/badge";

export function PeopleContent() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">People</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Manage employees and role permissions
      </p>

      <div className="mt-8">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
          Roles & Permissions
        </h3>
        <div className="border-t border-border" />
        <div className="py-4 space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">
                Full access to all modules, settings, and employee data
              </p>
            </div>
            <Badge className="text-[10px]">2 users</Badge>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Manager</p>
              <p className="text-xs text-muted-foreground">
                Access to team attendance, leave approvals, and reports
              </p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Coming soon
            </Badge>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Employee</p>
              <p className="text-xs text-muted-foreground">
                Self-service: profile, attendance, leave requests, payroll view
              </p>
            </div>
            <Badge className="text-[10px]">Active</Badge>
          </div>
        </div>
        <div className="border-t border-border" />
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
          Permissions
        </h3>
        <div className="border-t border-border" />
        <SettingsRow
          label="Employees can edit own profile"
          description="Allow employees to update personal and contact information"
          action={<Toggle checked={true} />}
        />
        <div className="border-t border-border" />
        <SettingsRow
          label="Employees can view team attendance"
          description="Show team-wide attendance in the employee dashboard"
          action={<Toggle />}
        />
        <div className="border-t border-border" />
        <SettingsRow
          label="Self check-in/out"
          description="Allow employees to mark their own attendance"
          action={<Toggle checked={true} />}
        />
        <div className="border-t border-border" />
        <SettingsRow
          label="Request leave without balance"
          description="Allow submitting leave requests even with insufficient balance"
          action={<Toggle />}
        />
      </div>
    </div>
  );
}
