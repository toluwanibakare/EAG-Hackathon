CREATE TABLE IF NOT EXISTS pools (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  balance numeric DEFAULT 0,
  allocation_percentage numeric DEFAULT 0,
  icon text,
  color text,
  restriction text,
  restriction_message text,
  goal_id uuid,
  requires_reason boolean DEFAULT false,
  requires_proof boolean DEFAULT false,
  cooldown_days integer,
  parent_id uuid REFERENCES pools(id),
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid
);

CREATE TABLE IF NOT EXISTS savings_goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  target_amount numeric NOT NULL,
  current_amount numeric DEFAULT 0,
  deadline timestamp with time zone,
  contribution_rate numeric DEFAULT 0,
  state text NOT NULL,
  pool_id uuid REFERENCES pools(id),
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  amount numeric NOT NULL,
  description text,
  category text,
  pool_id uuid REFERENCES pools(id),
  pool_name text,
  date timestamp with time zone NOT NULL,
  time text,
  status text NOT NULL,
  reference text,
  reason text,
  merchant text,
  note text,
  related_income_id uuid,
  related_allocation_id uuid,
  source text,
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid
);

CREATE TABLE IF NOT EXISTS allocations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  is_default boolean DEFAULT false,
  income_source text,
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid
);

CREATE TABLE IF NOT EXISTS policy_allocations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  allocation_id uuid REFERENCES allocations(id) ON DELETE CASCADE,
  pool_id uuid REFERENCES pools(id),
  pool_name text,
  percentage numeric NOT NULL,
  pool_type text,
  icon text,
  color text
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL,
  date timestamp with time zone NOT NULL,
  read boolean DEFAULT false,
  type text NOT NULL,
  user_id uuid
);
