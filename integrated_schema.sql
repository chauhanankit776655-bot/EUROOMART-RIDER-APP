CREATE TABLE IF NOT EXISTS public.riders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    vehicle_type TEXT NOT NULL,
    vehicle_model TEXT,
    vehicle_number TEXT,
    status TEXT NOT NULL DEFAULT 'Offline',
    cod_wallet NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    today_deliveries INTEGER NOT NULL DEFAULT 0,
    today_earnings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    acceptance_rate NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    weekly_online_hours TEXT NOT NULL DEFAULT '0h 0m',
    driving_license_verified BOOLEAN NOT NULL DEFAULT FALSE,
    aadhaar_verified BOOLEAN NOT NULL DEFAULT FALSE,
    insurance_active BOOLEAN NOT NULL DEFAULT FALSE,
    issue TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read/write access for all users" ON public.riders;
CREATE POLICY "Allow read/write access for all users" ON public.riders FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.applicants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending Review',
    submit_date TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read/write access for all users" ON public.applicants;
CREATE POLICY "Allow read/write access for all users" ON public.applicants FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_initials TEXT NOT NULL,
    service_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    time_elapsed TEXT NOT NULL DEFAULT '00:00',
    sla_info TEXT,
    rider_id TEXT REFERENCES public.riders(id) ON DELETE SET NULL,
    rider_name TEXT,
    rider_avatar TEXT,
    weight TEXT,
    cod_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    category TEXT,
    pickup_address TEXT,
    drop_address TEXT,
    distance NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    est_payout NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    items_count INTEGER NOT NULL DEFAULT 1,
    est_time INTEGER NOT NULL DEFAULT 10,
    note TEXT,
    package_photo TEXT,
    pickup_photo TEXT,
    delivery_photo TEXT,
    created_by TEXT DEFAULT 'customer',
    vendor_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read/write access for all users" ON public.orders;
CREATE POLICY "Allow read/write access for all users" ON public.orders FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.alerts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    time_label TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read/write access for all users" ON public.alerts;
CREATE POLICY "Allow read/write access for all users" ON public.alerts FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.active_deals (
    id TEXT PRIMARY KEY,
    vendor_name TEXT NOT NULL,
    logo_url TEXT,
    promotion_type TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    claims INTEGER NOT NULL DEFAULT 0,
    redemptions INTEGER NOT NULL DEFAULT 0,
    revenue NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.active_deals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read/write access for all users" ON public.active_deals;
CREATE POLICY "Allow read/write access for all users" ON public.active_deals FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.vendor_settlements (
    vendor_name TEXT PRIMARY KEY,
    gross_cod NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    fees NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    subs NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    net_payout NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.vendor_settlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read/write access for all users" ON public.vendor_settlements;
CREATE POLICY "Allow read/write access for all users" ON public.vendor_settlements FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.rider_payouts (
    id TEXT PRIMARY KEY,
    rider_name TEXT NOT NULL,
    initials TEXT NOT NULL,
    deliveries INTEGER NOT NULL DEFAULT 0,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'Processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.rider_payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read/write access for all users" ON public.rider_payouts;
CREATE POLICY "Allow read/write access for all users" ON public.rider_payouts FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.rider_transactions (
    id TEXT PRIMARY KEY,
    rider_id TEXT NOT NULL REFERENCES public.riders(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
    details TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.rider_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read/write access for all users" ON public.rider_transactions;
CREATE POLICY "Allow read/write access for all users" ON public.rider_transactions FOR ALL USING (true);

INSERT INTO public.riders (id, name, email, avatar_url, vehicle_type, vehicle_model, vehicle_number, status, cod_wallet, today_deliveries, today_earnings, rating, acceptance_rate, weekly_online_hours, driving_license_verified, aadhaar_verified, insurance_active, issue) VALUES ('R-8492', 'Alex Mercer', 'alex.mercer@euromart.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv-GrOwfSzkGv9c4n7v45-EQI6gXC_BhEdlwF-GhUiOtwUedT1k0ZWs6MKIjXG9pE7wf2tA-Mr1zSvt8dERVj2WWwwPAaA3aWM_dWXkwtu-2xhskQZKVLuXLDb5LldbHmMtErm3BggoebKrBqLKb1I6Il29Vv50prcHaprrofDMe7K35bDeiVpDrrS3mEJD1DdBrkXBvD5HHzB5IjbPghLCAtoELjBXpY1FYBoyWJPOmoTLDqse2B9', 'Motorcycle', 'Hero Splendor', 'KA-05-JK-5678', 'Active', 245.50, 14, 980.00, 4.80, 95.00, '42h 10m', TRUE, TRUE, TRUE, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.riders (id, name, email, avatar_url, vehicle_type, vehicle_model, vehicle_number, status, cod_wallet, today_deliveries, today_earnings, rating, acceptance_rate, weekly_online_hours, driving_license_verified, aadhaar_verified, insurance_active, issue) VALUES ('R-7731', 'Sarah Jenkins', 'sarah.j@euromart.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK_WhXGw8u3_0362NzXRggG-37K4538ge4ObUbWU4jSlgi62bSjLyt50777e27y6tfwAgWO-zgXuaPuUZwH-uRY3I_PAO12BdZ7FdH_CJzVNnqocqJiihR8jUcrpMHdKTyCwYokzct3PkRZYYYbh1pSPpdJDvJQwWUwU7w2XSvAsW_3dnWzxWW_wmDwQDDEE1kVRRMmxEortLnSWS5rhJXhimbLQr8d0IONTqSDvWgRkxT9kfWM8_v', 'Bicycle', 'Hero Cycle', 'N/A', 'Offline', 12.00, 0, 0.00, 4.70, 92.00, '12h 30m', FALSE, TRUE, FALSE, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.riders (id, name, email, avatar_url, vehicle_type, vehicle_model, vehicle_number, status, cod_wallet, today_deliveries, today_earnings, rating, acceptance_rate, weekly_online_hours, driving_license_verified, aadhaar_verified, insurance_active, issue) VALUES ('R-9022', 'Marcus Johnson', 'marcus.j@euromart.com', NULL, 'Van', 'Maruti Eeco', 'KA-04-LM-9012', 'Suspended', -54.20, 0, 0.00, 4.10, 80.00, '0h 0m', TRUE, TRUE, TRUE, 'Pending Settlement') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.riders (id, name, email, avatar_url, vehicle_type, vehicle_model, vehicle_number, status, cod_wallet, today_deliveries, today_earnings, rating, acceptance_rate, weekly_online_hours, driving_license_verified, aadhaar_verified, insurance_active, issue) VALUES ('R-8088', 'Vikram Singh', 'rider@euromart.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY0P7NKiglTLw4dzxBgDcIosrtxAcAXC7IpwKyPDEN5XT9F_wQ5c0PzgT7fv7G_RoxXs7_UB37PCR_LBfqye8cBObUVm8mGhYcI9-KiS7pO3gDlcHkr9jh1NL4jH5jgNSgLtifSaYzITNGWHgFqv5SMeh_rMLts_64FBlCCf4jIGg6j71jx6JeqWKqI24N0D0o-zXYKqjYBLl1R66wvASqclsIrnxyUUC2cixTxpAMI9xEXIP06KBt', 'Motorcycle', 'Honda Activa 6G', 'KA-03-HA-1234', 'Active', 3240.00, 12, 845.00, 4.95, 98.50, '34h 15m', TRUE, TRUE, TRUE, NULL) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applicants (id, name, vehicle_type, status, submit_date, details) VALUES ('APP-1', 'David Chen', 'Bicycle', 'Pending Review', 'Oct 24, 2023', 'Documents submitted on Oct 24. Awaiting background check verification.') ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, customer_name, customer_initials, service_type, status, time_elapsed, sla_info, rider_id, rider_name, rider_avatar, weight, cod_amount, category, pickup_address, drop_address, distance, est_payout, items_count, est_time, note, package_photo, pickup_photo, delivery_photo, created_by, vendor_name) VALUES ('#ORD-9921', 'Alice Smith', 'AS', 'Bike Taxi', 'Assigning', '04:12', 'SLA 5m', NULL, NULL, NULL, '0.8', 350.00, 'Documents', 'Sector 62, Noida, UP', 'Indiranagar Main Rd, Bengaluru', 12.5, 140.00, 1, 35, 'Deliver carefully.', NULL, NULL, NULL, 'customer', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_name, customer_initials, service_type, status, time_elapsed, sla_info, rider_id, rider_name, rider_avatar, weight, cod_amount, category, pickup_address, drop_address, distance, est_payout, items_count, est_time, note, package_photo, pickup_photo, delivery_photo, created_by, vendor_name) VALUES ('#ORD-9920', 'Alice Smith', 'AS', 'Courier', 'Picked Up', '12:45', NULL, 'R-8492', 'Alex Mercer', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv-GrOwfSzkGv9c4n7v45-EQI6gXC_BhEdlwF-GhUiOtwUedT1k0ZWs6MKIjXG9pE7wf2tA-Mr1zSvt8dERVj2WWwwPAaA3aWM_dWXkwtu-2xhskQZKVLuXLDb5LldbHmMtErm3BggoebKrBqLKb1I6Il29Vv50prcHaprrofDMe7K35bDeiVpDrrS3mEJD1DdBrkXBvD5HHzB5IjbPghLCAtoELjBXpY1FYBoyWJPOmoTLDqse2B9', '5.2', 1250.00, 'Groceries', 'Fresh Farms Warehouse', 'Rajajinagar, Block 3, Bengaluru', 6.4, 90.00, 5, 22, 'Keep bags upright.', NULL, NULL, NULL, 'vendor', 'Fresh Farm Organics') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_name, customer_initials, service_type, status, time_elapsed, sla_info, rider_id, rider_name, rider_avatar, weight, cod_amount, category, pickup_address, drop_address, distance, est_payout, items_count, est_time, note, package_photo, pickup_photo, delivery_photo, created_by, vendor_name) VALUES ('#ORD-9918', 'Sarah J.', 'SJ', 'Courier', 'On the Way', '18:20', NULL, 'R-7731', 'Sarah Jenkins', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK_WhXGw8u3_0362NzXRggG-37K4538ge4ObUbWU4jSlgi62bSjLyt50777e27y6tfwAgWO-zgXuaPuUZwH-uRY3I_PAO12BdZ7FdH_CJzVNnqocqJiihR8jUcrpMHdKTyCwYokzct3PkRZYYYbh1pSPpdJDvJQwWUwU7w2XSvAsW_3dnWzxWW_wmDwQDDEE1kVRRMmxEortLnSWS5rhJXhimbLQr8d0IONTqSDvWgRkxT9kfWM8_v', '1.5', 0.00, 'Electronics', 'Tech Haven store', 'Electronic City, Bengaluru', 15.2, 180.00, 2, 45, 'Awaiting contact signature.', NULL, NULL, NULL, 'customer', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_name, customer_initials, service_type, status, time_elapsed, sla_info, rider_id, rider_name, rider_avatar, weight, cod_amount, category, pickup_address, drop_address, distance, est_payout, items_count, est_time, note, package_photo, pickup_photo, delivery_photo, created_by, vendor_name) VALUES ('#ORD-9821', 'Alice Smith', 'AS', 'Local Courier', 'Delivered', 'Completed', NULL, 'R-8088', 'Vikram Singh', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY0P7NKiglTLw4dzxBgDcIosrtxAcAXC7IpwKyPDEN5XT9F_wQ5c0PzgT7fv7G_RoxXs7_UB37PCR_LBfqye8cBObUVm8mGhYcI9-KiS7pO3gDlcHkr9jh1NL4jH5jgNSgLtifSaYzITNGWHgFqv5SMeh_rMLts_64FBlCCf4jIGg6j71jx6JeqWKqI24N0D0o-zXYKqjYBLl1R66wvASqclsIrnxyUUC2cixTxpAMI9xEXIP06KBt', '2.3', 450.00, 'Groceries', 'Koramangala 4th Block, Bengaluru', 'HSR Layout Sector 2, Bengaluru', 4.2, 75.00, 4, 15, 'Delivered at 01:15 PM', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQHDY6WE_vnWZPmpfvGd3v7oR9zO5wbxHqfwXCinMtQSg2m9pROJDjfeJFnX-owXdWCoJ0n69HGxcDGYkKGUVG--B-Mrxx_QigzIj_I-t7AkhkZ3otSTq_Msveb4mHR3K3p6yaBy7LlN2Q5s-cG-XWtBqr-AYxYbXEnMbfg8NPLF3etRxy7Qm4a2xKukz0eKBeXi7bo0_GcOG_mmoL9H-lP-hl2jnYNGkD8HB_MN6HdL6mCQakHvp_', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLD5bI47qGyHz82OyqfPvCnsC5nVBENJiGKBjotDHZeQCGBVPSogXFsmJbn3HAL3I_j9jWY_U-XQYf8IuxWNgbo1tgrE1Nd6I_4FiXNDqxkT1_Tvo5uf1SC62KXqXB_sFW4a875-I0O8KCn7AaAeDGXvLXbaIz7dGF_Bd5iNhpMtGUiUtY94DorRYJ5JG2pmYD0tGn1nUM7MpCfM8Vr96RfjF_cl5DBAuyn7drtrwWuBlOWHotJy6n', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4bHmWjXeX-oeKdQz6TaJ3ySlUZTrAFOlimJkh_WCovt2HpZ6TzJcAqb_tUUoSDuACjKovq45LCTDPEexPzLmef61rW6UUS2IlCH1SSIwov8aUuUWFeaafljoRg_Z617tX0QITX0G8AnK5ydkpaIHwF_VQBqslAwQdrxR_AZi0wYrzyBCxjWbAjwr4-YiUQVKGJ1xni_HsUzKwzxephbpxkQ19p4WDHxqx0DPNVoz7JwT4xirOIO9B', 'customer', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_name, customer_initials, service_type, status, time_elapsed, sla_info, rider_id, rider_name, rider_avatar, weight, cod_amount, category, pickup_address, drop_address, distance, est_payout, items_count, est_time, note, package_photo, pickup_photo, delivery_photo, created_by, vendor_name) VALUES ('#ORD-9822', 'Bob Jones', 'BJ', 'Bike Taxi', 'In Transit', '24:15', NULL, NULL, NULL, NULL, '75', 150.00, 'Ride Sharing', 'JP Nagar 2nd Phase, Bengaluru', 'Malleshwaram 15th Cross, Bengaluru', 8.5, 95.00, 1, 28, 'Wear helmet.', NULL, NULL, NULL, 'customer', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_name, customer_initials, service_type, status, time_elapsed, sla_info, rider_id, rider_name, rider_avatar, weight, cod_amount, category, pickup_address, drop_address, distance, est_payout, items_count, est_time, note, package_photo, pickup_photo, delivery_photo, created_by, vendor_name) VALUES ('ORD-892', 'Karan Johar', 'KJ', 'Courier', 'Delivered', 'Completed', NULL, 'R-8088', 'Vikram Singh', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY0P7NKiglTLw4dzxBgDcIosrtxAcAXC7IpwKyPDEN5XT9F_wQ5c0PzgT7fv7G_RoxXs7_UB37PCR_LBfqye8cBObUVm8mGhYcI9-KiS7pO3gDlcHkr9jh1NL4jH5jgNSgLtifSaYzITNGWHgFqv5SMeh_rMLts_64FBlCCf4jIGg6j71jx6JeqWKqI24N0D0o-zXYKqjYBLl1R66wvASqclsIrnxyUUC2cixTxpAMI9xEXIP06KBt', '1.2', 450.00, 'Groceries', 'EurooMart Central Hub', '124 Logistics Way, Sector 7', 2.4, 65.00, 3, 12, 'Delivered at 02:45 PM', NULL, NULL, NULL, 'customer', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.orders (id, customer_name, customer_initials, service_type, status, time_elapsed, sla_info, rider_id, rider_name, rider_avatar, weight, cod_amount, category, pickup_address, drop_address, distance, est_payout, items_count, est_time, note, package_photo, pickup_photo, delivery_photo, created_by, vendor_name) VALUES ('ORD-810', 'Rahul Sharma', 'RS', 'Courier', 'Delivered', 'Completed', NULL, 'R-8088', 'Vikram Singh', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY0P7NKiglTLw4dzxBgDcIosrtxAcAXC7IpwKyPDEN5XT9F_wQ5c0PzgT7fv7G_RoxXs7_UB37PCR_LBfqye8cBObUVm8mGhYcI9-KiS7pO3gDlcHkr9jh1NL4jH5jgNSgLtifSaYzITNGWHgFqv5SMeh_rMLts_64FBlCCf4jIGg6j71jx6JeqWKqI24N0D0o-zXYKqjYBLl1R66wvASqclsIrnxyUUC2cixTxpAMI9xEXIP06KBt', '0.9', 0.00, 'Electronics', 'HSR Layout Sector 1', 'Bellandur Gate Hub', 3.8, 75.00, 2, 10, 'Delivered at 12:30 PM', NULL, NULL, NULL, 'customer', NULL) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, type, title, description, time_label) VALUES ('alert-1', 'rider_support', 'Rider Support Requested', 'Accident reported by Rider #4492. Immediate assistance required.', '2m ago') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.alerts (id, type, title, description, time_label) VALUES ('alert-2', 'high_cod', 'High COD Pending', 'Vendor ''FreshMart'' has exceeded ₹5,00,000 COD limit.', '15m ago') ON CONFLICT (id) DO NOTHING;

INSERT INTO public.active_deals (id, vendor_name, logo_url, promotion_type, title, category, status, claims, redemptions, revenue) VALUES ('deal-1', 'Fresh Farm Organics', 'https://lh3.googleusercontent.com/aida-public/AB6AXuClVc3PVhMCKsRiT_r-lKiyMpcWOco4Vf_BtYKi-yDWfAIgP4K02RAyrFTqnj-ET2Qjv-FjXACustnH8jP35u0RUCAk7arQGsFhq4O9-qrnHXASVofvvylHIQ7kqAzyfxGZtiFCO1bzSFO2ggz0NggXzGpMQyTcrM5UbAq87GbXFaDEaPZavC4a2PjGAbopBfghgG2jBv_0nRdZknxKNjSl6F3WTWixFMpL0q5ic2JKHmFwYLRZgS5D', 'Sponsored Promotion', '₹500 Off ₹3000+ Orders', 'Fresh Produce', 'Active', 1240, 892, 28500.00) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.active_deals (id, vendor_name, logo_url, promotion_type, title, category, status, claims, redemptions, revenue) VALUES ('deal-2', 'ElectroTech Hub', 'https://lh3.googleusercontent.com/aida-design/AB6AXuAqiOdiPY0im8PJo3chMAxUYxceZwYzxFTdfeFEH0ZxCQxkRJR88BW5VZEh-0r2RNMxDtFn04rFORUgeL8uwK1rhMK1sY6TyHn0Lfwh8L4-VJQD-MWF-XQUKZRnBgZIDSgn4oSu1QlJUTGrciT51-555V8vag9IH5BleX7ClI6pWuwKF0tbPG7s8Kp5xrUAP3rB6AreGWDASB-6aXPYO6KBue1ASil152L0CRZsSVj9yRW7LIOFm1Zj', 'Sponsored Promotion', '15% Off Smart Home', 'Electronics', 'Ending Soon', 3500, 2104, 145000.00) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.vendor_settlements (vendor_name, gross_cod, fees, subs, net_payout, status) VALUES ('Fresh Mart', 120000.00, 12000.00, 5000.00, 103000.00, 'Approved') ON CONFLICT (vendor_name) DO NOTHING;
INSERT INTO public.vendor_settlements (vendor_name, gross_cod, fees, subs, net_payout, status) VALUES ('City Pharmacy', 85000.00, 8500.00, 5000.00, 71500.00, 'Pending') ON CONFLICT (vendor_name) DO NOTHING;
INSERT INTO public.vendor_settlements (vendor_name, gross_cod, fees, subs, net_payout, status) VALUES ('Bake House', 42000.00, 4200.00, 5000.00, 32800.00, 'Pending') ON CONFLICT (vendor_name) DO NOTHING;
INSERT INTO public.vendor_settlements (vendor_name, gross_cod, fees, subs, net_payout, status) VALUES ('Tech Haven', 210000.00, 21000.00, 5000.00, 184000.00, 'Approved') ON CONFLICT (vendor_name) DO NOTHING;

INSERT INTO public.rider_payouts (id, rider_name, initials, deliveries, amount, status) VALUES ('payout-1', 'John Doe', 'JD', 42, 21000.00, 'Processing') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rider_payouts (id, rider_name, initials, deliveries, amount, status) VALUES ('payout-2', 'Anna Smith', 'AS', 38, 19000.00, 'Paid') ON CONFLICT (id) DO NOTHING;

INSERT INTO public.rider_transactions (id, rider_id, type, order_id, details, amount, created_at) VALUES ('tx-1', 'R-8088', 'cod_collected', 'ORD-892', 'COD Collected - #ORD-892', 450.00, NOW() - INTERVAL '15 minutes') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rider_transactions (id, rider_id, type, order_id, details, amount, created_at) VALUES ('tx-2', 'R-8088', 'cod_collected', '#ORD-9821', 'COD Collected - #ORD-9821', 1200.00, NOW() - INTERVAL '1 hour 15 minutes') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rider_transactions (id, rider_id, type, order_id, details, amount, created_at) VALUES ('tx-3', 'R-8088', 'hub_submission', NULL, 'Hub Submission - North Zone', -4500.00, NOW() - INTERVAL '1 day') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.rider_transactions (id, rider_id, type, order_id, details, amount, created_at) VALUES ('tx-4', 'R-8088', 'cod_collected', NULL, 'COD Collected - #ORD-850', 890.00, NOW() - INTERVAL '1 day 2 hours') ON CONFLICT (id) DO NOTHING;
