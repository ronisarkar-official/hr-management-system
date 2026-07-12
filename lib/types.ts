// ─── Database Model Types ────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  company_code: string;
  logo_url: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  company_id: string;
  login_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: "employee" | "admin";
  department: string | null;
  job_title: string | null;
  manager_id: string | null;
  date_of_joining: string | null;
  profile_picture_url: string | null;
  address: string | null;
  nationality: string | null;
  personal_email: string | null;
  gender: string | null;
  marital_status: string | null;
  date_of_birth: string | null;
  emergency_contact: { name?: string; phone?: string } | null;
  bank_account_no: string | null;
  bank_ifsc: string | null;
  tax_id: string | null;
  government_id: string | null;
  about: string | null;
  interests: string | null;
  skills: string[];
  certifications: string[];
  created_at: string;
}

export interface SalaryStructure {
  id: string;
  profile_id: string;
  wage_type: "monthly" | "hourly";
  monthly_wage: number;
  yearly_wage: number;
  working_days_per_week: number;
  working_hours_per_week: number;
  pf_rate: number;
  professional_tax: number;
  created_at: string;
  updated_at: string;
}

export interface SalaryComponent {
  id: string;
  salary_structure_id: string;
  name: string;
  computation_type: "fixed" | "percentage_of_wage" | "percentage_of_basic";
  value: number;
  computed_amount: number;
}

export interface AttendanceRecord {
  id: string;
  profile_id: string;
  date: string;
  check_in_at: string | null;
  check_out_at: string | null;
  work_hours: number;
  extra_hours: number;
  status: "present" | "absent" | "on_leave" | "half_day";
}

export interface LeaveType {
  id: string;
  company_id: string;
  name: string;
  default_allocation_days: number;
}

export interface LeaveBalance {
  id: string;
  profile_id: string;
  leave_type_id: string;
  allocated_days: number;
  used_days: number;
  year: number;
  leave_type?: LeaveType;
}

export interface LeaveRequest {
  id: string;
  profile_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: "pending" | "approved" | "rejected";
  attachment_url: string | null;
  remarks: string | null;
  admin_remarks: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  leave_type?: LeaveType;
  profile?: Pick<Profile, "id" | "first_name" | "last_name" | "login_id" | "department">;
}

// ─── Action Result Types ─────────────────────────────────────────────────────

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateEmployeeResult {
  loginId: string;
  tempPassword: string;
  profileId: string;
  emailSent: boolean;
}
