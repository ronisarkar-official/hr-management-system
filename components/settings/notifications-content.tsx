"use client";

import * as React from "react";
import { SettingsRow, Toggle } from "@/components/settings/settings-shared";

export function NotificationsContent() {
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [leaveNotifs, setLeaveNotifs] = React.useState(true);
  const [attendanceNotifs, setAttendanceNotifs] = React.useState(true);
  const [payrollNotifs, setPayrollNotifs] = React.useState(true);
  const [profileNotifs, setProfileNotifs] = React.useState(false);

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Manage how you receive HR and attendance notifications
      </p>

      <div className="mt-8">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
          Channels
        </h3>
        <div className="border-t border-border" />
        <SettingsRow
          label="Email notifications"
          description="Receive notifications via email"
          action={<Toggle checked={emailNotifs} onChange={setEmailNotifs} />}
        />
        <div className="border-t border-border" />
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
          Events
        </h3>
        <div className="border-t border-border" />
        <SettingsRow
          label="Leave requests"
          description="When a leave request is submitted, approved, or rejected"
          action={<Toggle checked={leaveNotifs} onChange={setLeaveNotifs} />}
        />
        <div className="border-t border-border" />
        <SettingsRow
          label="Attendance reminders"
          description="Daily check-in reminders and missing attendance alerts"
          action={<Toggle checked={attendanceNotifs} onChange={setAttendanceNotifs} />}
        />
        <div className="border-t border-border" />
        <SettingsRow
          label="Payroll updates"
          description="Payslip generation and salary changes"
          action={<Toggle checked={payrollNotifs} onChange={setPayrollNotifs} />}
        />
        <div className="border-t border-border" />
        <SettingsRow
          label="Profile changes"
          description="When your profile or role is updated by an admin"
          action={<Toggle checked={profileNotifs} onChange={setProfileNotifs} />}
        />
      </div>
    </div>
  );
}
