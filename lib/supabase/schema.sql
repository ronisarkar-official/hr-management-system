-- =============================================================================
-- HRMS — Full Supabase Schema Migration
-- Run this in your Supabase Dashboard → SQL Editor
-- =============================================================================

-- ─── ENUMS ───────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('employee', 'admin');
CREATE TYPE wage_type AS ENUM ('monthly', 'hourly');
CREATE TYPE computation_type AS ENUM ('fixed', 'percentage_of_wage', 'percentage_of_basic');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'on_leave', 'half_day');
CREATE TYPE leave_request_status AS ENUM ('pending', 'approved', 'rejected');

-- ─── COMPANIES ───────────────────────────────────────────────────────────────

CREATE TABLE companies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  company_code text NOT NULL UNIQUE CHECK (char_length(company_code) BETWEEN 2 AND 6),
  logo_url    text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── PROFILES ────────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id          uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  login_id            text UNIQUE,
  first_name          text NOT NULL,
  last_name           text NOT NULL,
  email               text NOT NULL,
  phone               text,
  role                user_role NOT NULL DEFAULT 'employee',
  department          text,
  job_title           text,
  manager_id          uuid REFERENCES profiles(id) ON DELETE SET NULL,
  date_of_joining     date,
  profile_picture_url text,
  address             text,
  nationality         text,
  personal_email      text,
  gender              text,
  marital_status      text,
  date_of_birth       date,
  emergency_contact   jsonb DEFAULT '{}',
  bank_account_no     text,
  bank_ifsc           text,
  tax_id              text,
  government_id       text,
  about               text,
  interests           text,
  skills              jsonb DEFAULT '[]',
  certifications      jsonb DEFAULT '[]',
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_profiles_login_id ON profiles(login_id);

-- ─── SALARY STRUCTURES ──────────────────────────────────────────────────────

CREATE TABLE salary_structures (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  wage_type             wage_type NOT NULL DEFAULT 'monthly',
  monthly_wage          numeric(12,2) NOT NULL DEFAULT 0,
  yearly_wage           numeric(14,2) NOT NULL DEFAULT 0,
  working_days_per_week integer NOT NULL DEFAULT 5,
  working_hours_per_week integer NOT NULL DEFAULT 40,
  pf_rate               numeric(5,2) NOT NULL DEFAULT 12.00,
  professional_tax      numeric(10,2) NOT NULL DEFAULT 200.00,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ─── SALARY COMPONENTS ──────────────────────────────────────────────────────

CREATE TABLE salary_components (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salary_structure_id  uuid NOT NULL REFERENCES salary_structures(id) ON DELETE CASCADE,
  name                 text NOT NULL,
  computation_type     computation_type NOT NULL DEFAULT 'fixed',
  value                numeric(12,2) NOT NULL DEFAULT 0,
  computed_amount      numeric(12,2) NOT NULL DEFAULT 0
);

CREATE INDEX idx_salary_components_structure ON salary_components(salary_structure_id);

-- ─── ATTENDANCE ──────────────────────────────────────────────────────────────

CREATE TABLE attendance (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date         date NOT NULL DEFAULT CURRENT_DATE,
  check_in_at  timestamptz,
  check_out_at timestamptz,
  work_hours   numeric(5,2) DEFAULT 0,
  extra_hours  numeric(5,2) DEFAULT 0,
  status       attendance_status NOT NULL DEFAULT 'present',
  UNIQUE(profile_id, date)
);

CREATE INDEX idx_attendance_profile_date ON attendance(profile_id, date);

-- ─── LEAVE TYPES ─────────────────────────────────────────────────────────────

CREATE TABLE leave_types (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name                    text NOT NULL,
  default_allocation_days integer NOT NULL DEFAULT 0
);

CREATE INDEX idx_leave_types_company ON leave_types(company_id);

-- ─── LEAVE BALANCES ──────────────────────────────────────────────────────────

CREATE TABLE leave_balances (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  leave_type_id  uuid NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  allocated_days integer NOT NULL DEFAULT 0,
  used_days      integer NOT NULL DEFAULT 0,
  year           integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  UNIQUE(profile_id, leave_type_id, year)
);

CREATE INDEX idx_leave_balances_profile ON leave_balances(profile_id);

-- ─── LEAVE REQUESTS ─────────────────────────────────────────────────────────

CREATE TABLE leave_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  leave_type_id   uuid NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  start_date      date NOT NULL,
  end_date        date NOT NULL,
  days_requested  integer NOT NULL CHECK (days_requested > 0),
  status          leave_request_status NOT NULL DEFAULT 'pending',
  attachment_url  text,
  remarks         text,
  admin_remarks   text,
  reviewed_by     uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_leave_requests_profile ON leave_requests(profile_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Companies: users can read their own company
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  USING (
    id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  );

-- Profiles: employees see own, admins see company-scoped
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can view company profiles"
  ON profiles FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can update company profiles"
  ON profiles FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Salary Structures: employees see own, admins see company-scoped
CREATE POLICY "Users can view own salary"
  ON salary_structures FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Admins can view company salaries"
  ON salary_structures FOR SELECT
  USING (
    profile_id IN (
      SELECT p.id FROM profiles p
      WHERE p.company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "Admins can manage salaries"
  ON salary_structures FOR ALL
  USING (
    profile_id IN (
      SELECT p.id FROM profiles p
      WHERE p.company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Salary Components: inherit from salary_structures access
CREATE POLICY "Users can view own salary components"
  ON salary_components FOR SELECT
  USING (
    salary_structure_id IN (
      SELECT id FROM salary_structures WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage salary components"
  ON salary_components FOR ALL
  USING (
    salary_structure_id IN (
      SELECT ss.id FROM salary_structures ss
      JOIN profiles p ON p.id = ss.profile_id
      WHERE p.company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Attendance: employees see own, admins see company-scoped
CREATE POLICY "Users can view own attendance"
  ON attendance FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own attendance"
  ON attendance FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own attendance"
  ON attendance FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Admins can view company attendance"
  ON attendance FOR SELECT
  USING (
    profile_id IN (
      SELECT p.id FROM profiles p
      WHERE p.company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Leave Types: visible to all in same company
CREATE POLICY "Users can view company leave types"
  ON leave_types FOR SELECT
  USING (
    company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage leave types"
  ON leave_types FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Leave Balances: employees see own, admins see company-scoped
CREATE POLICY "Users can view own leave balances"
  ON leave_balances FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Admins can manage leave balances"
  ON leave_balances FOR ALL
  USING (
    profile_id IN (
      SELECT p.id FROM profiles p
      WHERE p.company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Leave Requests: employees see own, admins see company-scoped
CREATE POLICY "Users can view own leave requests"
  ON leave_requests FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own leave requests"
  ON leave_requests FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Admins can manage leave requests"
  ON leave_requests FOR ALL
  USING (
    profile_id IN (
      SELECT p.id FROM profiles p
      WHERE p.company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- ─── STORAGE BUCKET ──────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Authenticated users can view attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'attachments');

-- ─── SEED: DEFAULT LEAVE TYPES TRIGGER ───────────────────────────────────────

CREATE OR REPLACE FUNCTION create_default_leave_types()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO leave_types (company_id, name, default_allocation_days) VALUES
    (NEW.id, 'Paid Time Off', 24),
    (NEW.id, 'Sick Leave', 12),
    (NEW.id, 'Unpaid Leave', 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_company_created
  AFTER INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION create_default_leave_types();
