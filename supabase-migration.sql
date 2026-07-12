-- Add new tables for notifications, activity log, and leave_types seeding

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(profile_id, read);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_company ON activity_log(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_profile ON activity_log(profile_id, created_at DESC);

-- Seed default leave types for existing companies
INSERT INTO leave_types (company_id, name, default_allocation_days)
SELECT c.id, lt.name, lt.days
FROM companies c
CROSS JOIN (
  VALUES
    ('Annual Leave', 12),
    ('Sick Leave', 10),
    ('Personal Leave', 5),
    ('Casual Leave', 6)
) AS lt(name, days)
WHERE NOT EXISTS (
  SELECT 1 FROM leave_types l WHERE l.company_id = c.id AND l.name = lt.name
);
