"use client";

import React, { useState, useEffect, useRef } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle2, Calculator } from "lucide-react";
import { upsertSalaryStructure, updateSalaryComponents } from "@/lib/actions/salary";
import { formatCurrency } from "@/lib/locale";
import type { SalaryStructure, SalaryComponent } from "@/lib/types";

interface SalaryInfoProps {
  profileId: string;
  salaryData: { structure: SalaryStructure; components: SalaryComponent[] } | null;
  readOnly: boolean;
  onUpdate?: () => void;
}

interface LocalComponent {
  name: string;
  computation_type: "fixed" | "percentage_of_wage" | "percentage_of_basic";
  value: number;
  computed_amount: number;
}

const DEFAULT_COMPONENTS: LocalComponent[] = [
  { name: "Basic Salary", computation_type: "percentage_of_wage", value: 50, computed_amount: 0 },
  { name: "HRA", computation_type: "percentage_of_basic", value: 40, computed_amount: 0 },
  { name: "Conveyance Allowance", computation_type: "fixed", value: 1600, computed_amount: 1600 },
  { name: "Special Allowance", computation_type: "fixed", value: 0, computed_amount: 0 },
  { name: "Medical Allowance", computation_type: "fixed", value: 1250, computed_amount: 1250 },
];

export function SalaryInfo({ profileId, salaryData, readOnly, onUpdate }: SalaryInfoProps) {
  const [wageType, setWageType] = useState<"monthly" | "hourly">("monthly");
  const [monthlyWage, setMonthlyWage] = useState(0);
  const [workingDays, setWorkingDays] = useState(5);
  const [workingHours, setWorkingHours] = useState(40);
  const [pfRate, setPfRate] = useState(12);
  const [professionalTax, setProfessionalTax] = useState(200);
  const [components, setComponents] = useState<LocalComponent[]>(DEFAULT_COMPONENTS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (salaryData) {
      setWageType(salaryData.structure.wage_type);
      setMonthlyWage(Number(salaryData.structure.monthly_wage));
      setWorkingDays(salaryData.structure.working_days_per_week);
      setWorkingHours(salaryData.structure.working_hours_per_week);
      setPfRate(Number(salaryData.structure.pf_rate));
      setProfessionalTax(Number(salaryData.structure.professional_tax));
      if (salaryData.components.length > 0) {
        setComponents(
          salaryData.components.map((c) => ({
            name: c.name,
            computation_type: c.computation_type,
            value: Number(c.value),
            computed_amount: Number(c.computed_amount),
          }))
        );
      }
    }
  }, [salaryData]);

  const skipRecompute = useRef(false);

  useEffect(() => {
    if (monthlyWage <= 0) return;
    if (skipRecompute.current) { skipRecompute.current = false; return; }

    const basicComp = components.find((c) => c.name.toLowerCase().includes("basic"));
    let basicAmount = 0;

    if (basicComp) {
      if (basicComp.computation_type === "fixed") basicAmount = basicComp.value;
      else if (basicComp.computation_type === "percentage_of_wage")
        basicAmount = (basicComp.value / 100) * monthlyWage;
    }

    const updated = components.map((c) => {
      let computed = 0;
      switch (c.computation_type) {
        case "fixed":
          computed = c.value;
          break;
        case "percentage_of_wage":
          computed = (c.value / 100) * monthlyWage;
          break;
        case "percentage_of_basic":
          computed = (c.value / 100) * basicAmount;
          break;
      }
      return { ...c, computed_amount: Math.round(computed * 100) / 100 };
    });

    const hasChanged = updated.some(
      (u, i) => u.computed_amount !== components[i]?.computed_amount
    );
    if (hasChanged) {
      skipRecompute.current = true;
      setComponents(updated);
    }
  }, [monthlyWage]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalComponents = components.reduce((sum, c) => sum + c.computed_amount, 0);
  const exceeds = monthlyWage > 0 && totalComponents > monthlyWage;
  const yearlyWage = monthlyWage * 12;

  const updateComponent = (index: number, field: keyof LocalComponent, value: string | number) => {
    setComponents((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const addComponent = () => {
    setComponents((prev) => [
      ...prev,
      { name: "", computation_type: "fixed", value: 0, computed_amount: 0 },
    ]);
  };

  const removeComponent = (index: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");

    const structResult = await upsertSalaryStructure(profileId, {
      wage_type: wageType,
      monthly_wage: monthlyWage,
      working_days_per_week: workingDays,
      working_hours_per_week: workingHours,
      pf_rate: pfRate,
      professional_tax: professionalTax,
    });

    if (!structResult.success) {
      setError(structResult.error || "Failed to save salary structure.");
      setSaving(false);
      return;
    }

    const compResult = await updateSalaryComponents(
      structResult.data!.id,
      components.map((c) => ({
        name: c.name,
        computation_type: c.computation_type,
        value: c.value,
      }))
    );

    if (!compResult.success) {
      setError(compResult.error || "Failed to save components.");
    } else {
      setSuccessMsg("Salary structure saved successfully!");
      onUpdate?.();
    }

    setSaving(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-5 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Wage Structure */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-400/40 via-blue-300/20 to-transparent" />
        <div className="p-5 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Calculator className="size-4 text-muted-foreground" />
            Wage Structure
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Field label="Wage Type" readOnly={readOnly} value={wageType} capitalize>
              <Select value={wageType} onValueChange={(v) => setWageType(v as "monthly" | "hourly")}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Monthly Wage" readOnly={readOnly} value={formatCurrency(monthlyWage)}>
              <Input
                type="number"
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(Number(e.target.value))}
                className="h-8 text-sm"
              />
            </Field>
            <Field label="Yearly Wage" value={formatCurrency(yearlyWage)} locked />
            <Field label="Working Days / Week" readOnly={readOnly} value={String(workingDays)}>
              <Input type="number" value={workingDays} onChange={(e) => setWorkingDays(Number(e.target.value))} className="h-8 text-sm" />
            </Field>
            <Field label="Working Hours / Week" readOnly={readOnly} value={String(workingHours)}>
              <Input type="number" value={workingHours} onChange={(e) => setWorkingHours(Number(e.target.value))} className="h-8 text-sm" />
            </Field>
            <Field label="PF Rate" readOnly={readOnly} value={`${pfRate}%`}>
              <Input type="number" value={pfRate} onChange={(e) => setPfRate(Number(e.target.value))} className="h-8 text-sm" />
            </Field>
            <Field label="Professional Tax" readOnly={readOnly} value={formatCurrency(professionalTax)}>
              <Input type="number" value={professionalTax} onChange={(e) => setProfessionalTax(Number(e.target.value))} className="h-8 text-sm" />
            </Field>
          </div>
        </div>
      </div>

      {/* Salary Components */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-400/40 via-emerald-300/20 to-transparent" />
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Calculator className="size-4 text-muted-foreground" />
              Salary Components
            </h3>
            {!readOnly && (
              <Button size="sm" variant="outline" onClick={addComponent} className="h-7 text-xs">
                <Plus className="mr-1 size-3" />
                Add Component
              </Button>
            )}
          </div>

          {exceeds && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              Total ({formatCurrency(totalComponents)}) exceeds monthly wage ({formatCurrency(monthlyWage)})
            </div>
          )}

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="py-2.5">Component</TableHead>
                  <TableHead className="py-2.5">Type</TableHead>
                  <TableHead className="py-2.5 text-right">Value</TableHead>
                  <TableHead className="py-2.5 text-right">Amount</TableHead>
                  {!readOnly && <TableHead className="py-2.5 w-10" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {components.map((comp, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {readOnly ? (
                        <span className="text-sm font-medium">{comp.name}</span>
                      ) : (
                        <Input
                          value={comp.name}
                          onChange={(e) => updateComponent(i, "name", e.target.value)}
                          className="h-7 text-xs"
                          placeholder="Component name"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {readOnly ? (
                        <span className="text-xs text-muted-foreground capitalize">
                          {comp.computation_type.replace(/_/g, " ")}
                        </span>
                      ) : (
                        <Select
                          value={comp.computation_type}
                          onValueChange={(v) => updateComponent(i, "computation_type", v)}
                        >
                          <SelectTrigger className="h-7 text-xs w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed</SelectItem>
                            <SelectItem value="percentage_of_wage">% of Wage</SelectItem>
                            <SelectItem value="percentage_of_basic">% of Basic</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {readOnly ? (
                        <span className="text-sm">
                          {comp.computation_type === "fixed"
                            ? formatCurrency(comp.value)
                            : `${comp.value}%`}
                        </span>
                      ) : (
                        <Input
                          type="number"
                          value={comp.value}
                          onChange={(e) => updateComponent(i, "value", Number(e.target.value))}
                          className="h-7 text-xs text-right w-24 ml-auto"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm tabular-nums">
                      {formatCurrency(comp.computed_amount)}
                    </TableCell>
                    {!readOnly && (
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeComponent(i)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                <TableRow className="bg-muted/20 font-semibold">
                  <TableCell colSpan={3} className="text-right text-sm py-3">
                    Total
                  </TableCell>
                  <TableCell className={`text-right text-sm py-3 tabular-nums ${exceeds ? "text-destructive" : ""}`}>
                    {formatCurrency(totalComponents)}
                  </TableCell>
                  {!readOnly && <TableCell />}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {!readOnly && (
            <div className="flex justify-end pt-1">
              <Button onClick={handleSave} disabled={saving || exceeds} size="sm">
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                Save Salary Structure
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Field helper ──────────────────────────────────────────────────── */

function Field({
  label,
  readOnly,
  value,
  children,
  locked,
  capitalize,
}: {
  label: string;
  readOnly?: boolean;
  value?: string;
  children?: React.ReactNode;
  locked?: boolean;
  capitalize?: boolean;
}) {
  if (readOnly || locked) {
    return (
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground font-medium">{label}</Label>
        <p className={`text-sm font-medium bg-muted/40 rounded-lg px-3 py-2 border border-border/50 ${capitalize ? "capitalize" : ""}`}>
          {value || "—"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground font-medium">{label}</Label>
      {children}
    </div>
  );
}
