"use client";

import React from "react";
import { FileText, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/locale";
import type { SalaryStructure, SalaryComponent } from "@/lib/types";

interface PayslipViewProps {
  employeeName: string;
  employeeId: string;
  department: string;
  month: string;
  year: number;
  salaryStructure: SalaryStructure | null;
  components: SalaryComponent[];
  daysPresent: number;
  totalWorkingDays: number;
  onClose?: () => void;
}

export function PayslipView({
  employeeName,
  employeeId,
  department,
  month,
  year,
  salaryStructure,
  components,
  daysPresent,
  totalWorkingDays,
  onClose,
}: PayslipViewProps) {
  if (!salaryStructure) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <FileText className="mx-auto size-12 text-muted-foreground/30 mb-3" />
        <p className="font-medium">Salary structure not configured</p>
        <p className="text-sm mt-1">Contact your HR admin to set up your salary.</p>
      </div>
    );
  }

  const monthlyWage = Number(salaryStructure.monthly_wage);
  const totalComp = components.reduce((s, c) => s + Number(c.computed_amount), 0);
  const pfAmount = (monthlyWage * Number(salaryStructure.pf_rate)) / 100;
  const profTax = Number(salaryStructure.professional_tax);
  const grossEarnings = totalComp;
  const totalDeductions = pfAmount + profTax;
  const netPay = monthlyWage > 0 ? (monthlyWage / totalWorkingDays) * daysPresent : 0;
  const finalNetPay = netPay - (netPay > 0 ? (netPay / monthlyWage) * totalDeductions : 0);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="size-5" />
          <span className="text-sm font-medium">Payslip</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 size-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Employee Info */}
      <div className="rounded-xl border bg-card p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 print:border-gray-300">
        <InfoBlock label="Employee" value={employeeName} />
        <InfoBlock label="Login ID" value={employeeId} mono />
        <InfoBlock label="Department" value={department || "—"} />
        <InfoBlock label="Period" value={`${month} ${year}`} />
      </div>

      {/* Earnings & Deductions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Earnings */}
        <div className="rounded-xl border bg-card p-5 print:border-gray-300">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            Earnings
          </h3>
          <div className="space-y-2.5">
            {components.map((c, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{c.name}</span>
                <span className="font-medium tabular-nums">{formatCurrency(Number(c.computed_amount))}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm font-semibold">
              <span>Gross Earnings</span>
              <span className="tabular-nums">{formatCurrency(grossEarnings)}</span>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="rounded-xl border bg-card p-5 print:border-gray-300">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <span className="size-2 rounded-full bg-red-500" />
            Deductions
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Provident Fund ({salaryStructure.pf_rate}%)</span>
              <span className="font-medium tabular-nums">{formatCurrency(pfAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Professional Tax</span>
              <span className="font-medium tabular-nums">{formatCurrency(profTax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm font-semibold">
              <span>Total Deductions</span>
              <span className="tabular-nums">{formatCurrency(totalDeductions)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border-2 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-background p-6 print:border-gray-300">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <SummaryBlock label="Working Days" value={String(totalWorkingDays)} />
          <SummaryBlock label="Days Present" value={String(daysPresent)} />
          <SummaryBlock label="Payable Days" value={String(daysPresent)} />
          <SummaryBlock
            label="Net Pay"
            value={formatCurrency(Math.round(Math.max(0, finalNetPay)))}
            highlight
          />
        </div>

        {/* Pro-rata indicator */}
        {daysPresent < totalWorkingDays && (
          <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
            Net pay pro-rated based on {daysPresent} present days out of {totalWorkingDays} working days.
          </div>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function InfoBlock({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function SummaryBlock({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold mt-1 tabular-nums ${highlight ? "text-emerald-600" : ""}`}>
        {value}
      </p>
    </div>
  );
}
