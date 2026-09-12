CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,

  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',

  fulfillment_type TEXT,
  pickup BOOLEAN,
  order_date TEXT,
  customer_notes TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  item_name TEXT NOT NULL,
  category TEXT,
  size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,

  unit_price_cents INTEGER NOT NULL DEFAULT 0,
  line_total_cents INTEGER NOT NULL DEFAULT 0,

  custom_cake_options_json JSONB,

  created_at TIMESTAMP DEFAULT NOW()
);

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;


CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,

  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',

  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,

  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_schedule (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  pickup_date DATE,
  pickup_time TIME,
  requested_datetime TIMESTAMP,

  schedule_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,

  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',

  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,

  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_schedule (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  pickup_date DATE,
  pickup_time TIME,
  requested_datetime TIMESTAMP,

  schedule_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'customers',
    'orders',
    'order_items',
    'payments',
    'order_schedule',
    'sizes',
    'menu_item_sizes'
  )
ORDER BY table_name, ordinal_position;


