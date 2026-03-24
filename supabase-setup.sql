-- ============================================
-- Script Pengaturan Database FLOVA
-- Jalankan script ini di Supabase SQL Editor
-- ============================================

-- 1. Buat tabel service_stages (Tahap Layanan)
CREATE TABLE IF NOT EXISTS public.service_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Buat tabel service_logs (Log Layanan)
CREATE TABLE IF NOT EXISTS public.service_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  service_stage TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration REAL NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.service_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_logs ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan RLS (Policies) untuk tabel service_stages
-- Siapapun yang sudah login bisa membaca daftar tahap layanan
CREATE POLICY "Siapapun yang login bisa membaca stages" ON public.service_stages
  FOR SELECT TO authenticated USING (true);

-- Hanya Admin yang bisa menambah tahap layanan
CREATE POLICY "Admin bisa menambah stages" ON public.service_stages
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Hanya Admin yang bisa mengubah tahap layanan
CREATE POLICY "Admin bisa mengubah stages" ON public.service_stages
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Hanya Admin yang bisa menghapus tahap layanan
CREATE POLICY "Admin bisa menghapus stages" ON public.service_stages
  FOR DELETE TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 5. Kebijakan RLS (Policies) untuk tabel service_logs
-- Siapapun yang sudah login bisa membaca log layanan
CREATE POLICY "Siapapun yang login bisa membaca logs" ON public.service_logs
  FOR SELECT TO authenticated USING (true);

-- Admin dan Staff bisa menambah log layanan
CREATE POLICY "Admin dan Staff bisa menambah logs" ON public.service_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'staff')
  );

-- Admin bisa mengubah log layanan
CREATE POLICY "Admin bisa mengubah logs" ON public.service_logs
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Admin bisa menghapus log layanan
CREATE POLICY "Admin bisa menghapus logs" ON public.service_logs
  FOR DELETE TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 6. Aktifkan realtime untuk tabel service_logs agar dashboard bisa update seketika
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_logs;

-- 7. Buat index untuk mempercepat pencarian data
CREATE INDEX IF NOT EXISTS idx_service_logs_created_at ON public.service_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_logs_service_stage ON public.service_logs(service_stage);
CREATE INDEX IF NOT EXISTS idx_service_logs_customer_name ON public.service_logs(customer_name);

-- 8. Masukkan data tahap layanan default
INSERT INTO public.service_stages (name, display_order) VALUES
  ('Registrasi', 1),
  ('Pemeriksaan', 2),
  ('Pelayanan Utama', 3),
  ('Pembayaran', 4),
  ('Penyelesaian', 5)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SELESAI! Database FLOVA Anda sudah siap digunakan.
-- ============================================
