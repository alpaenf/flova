import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import {
  BarChart3, Zap, Shield, ArrowRight,
  Clock, TrendingUp, AlertTriangle, CheckCircle,
  ChevronRight, Activity
} from 'lucide-react'
import {
  HeroBlob, GridPattern, WaveDecoration, CircleRings,
  FlowArrows, DotMatrix, BottleneckGraphic
} from '@/components/svg-decorations'
import ScrollReveal from '@/components/scroll-reveal'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* =========================================
          NAVBAR - Floating Capsule
          ========================================= */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4" style={{ animation: 'navSlideDown 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 shadow-xl shadow-black/5 rounded-full px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="FLOVA" width={100} height={32} className="h-8 w-auto object-contain" priority />
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-primary transition-colors">Cara Kerja</a>
            <a href="#manfaat" className="hover:text-primary transition-colors">Manfaat</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-primary text-white px-5 py-2 rounded-full shadow-md shadow-primary/25 hover:bg-primary-dark transition-all hover:scale-105"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section className="relative flex items-start pt-4 pb-16 overflow-hidden min-h-[90vh]">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <HeroBlob className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-60" />
          <HeroBlob className="absolute -bottom-32 -left-32 w-[500px] h-[500px] opacity-40" />
          <GridPattern className="absolute inset-0 w-full h-full text-primary opacity-[0.03]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Temukan{' '}
                <span className="gradient-text">Titik Lambat</span>{' '}
                Layanan Anda
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                FLOVA menganalisis alur layanan multi-tahap secara otomatis, mengidentifikasi bottleneck, dan memberikan rekomendasi berbasis data untuk meningkatkan efisiensi operasional Anda.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover:scale-105 group"
                >
                  Mulai Gratis Sekarang
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 bg-white text-gray-700 text-sm font-semibold px-6 py-3 rounded-xl border border-gray-200 hover:border-primary hover:text-primary transition-all"
                >
                  Masuk ke Dashboard
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {[
                  { label: 'Tahap Layanan', value: 'Multi' },
                  { label: 'Deteksi Otomatis', value: 'Real-Time' },
                  { label: 'Tersedia di', value: 'Web & Mobile' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-base font-bold text-gray-900">{value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CircleRings className="absolute -top-10 -right-10 w-40 h-40 text-primary opacity-30" />
              <DotMatrix className="absolute -bottom-6 -left-6 w-48 h-32 text-primary" />

              {/* Mock dashboard card */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 p-6 ml-4">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                     <p className="text-[10px] text-gray-400 font-medium">Dashboard Hari Ini</p>
                     <h3 className="text-sm font-bold text-gray-900">Analitik Layanan</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-danger-50 text-danger text-[10px] font-semibold px-2 py-1 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Bottleneck terdeteksi
                  </div>
                </div>

                {/* Chart illustration */}
                <BottleneckGraphic className="w-full mb-6" />

                {/* Mini KPI row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Layanan', value: '142', icon: Activity, color: 'text-primary', bg: 'bg-primary-50' },
                    { label: 'Avg Durasi', value: '18 min', icon: Clock, color: 'text-warning', bg: 'bg-warning-50' },
                    { label: 'Efisiensi', value: '73%', icon: TrendingUp, color: 'text-success', bg: 'bg-success-50' },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className={`${bg} rounded-2xl p-3`}>
                      <Icon className={`w-4 h-4 ${color} mb-2`} />
                       <p className="text-sm font-bold text-gray-900">{value}</p>
                       <p className="text-[9px] text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave transition */}
        <WaveDecoration className="absolute bottom-0 left-0 right-0 w-full h-16 text-gray-50" />
      </section>

      {/* =========================================
          FLOW VISUALIZATION SECTION
          ========================================= */}
      <section className="bg-gray-50 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <DotMatrix className="absolute right-0 top-0 w-64 h-40 text-primary opacity-30" />
          <DotMatrix className="absolute left-0 bottom-0 w-48 h-32 text-primary opacity-20" />
          <CircleRings className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-primary opacity-5" />
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Alur Kerja Sistem</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dari Data ke Keputusan</h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto text-sm">
              FLOVA memetakan perjalanan setiap pelanggan melalui setiap tahap layanan, mendeteksi perlambatan secara otomatis.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <FlowArrows className="w-full max-w-2xl mx-auto h-32 opacity-70" />
            <div className="flex justify-center gap-12 mt-4">
              {['Registrasi', 'Pemeriksaan', 'Pelayanan', 'Pembayaran', 'Selesai'].map((stage, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs font-medium text-gray-500">{stage}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          FEATURES SECTION
          ========================================= */}
      <section id="fitur" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <GridPattern className="absolute inset-0 w-full h-full text-primary opacity-[0.025]" />
          <HeroBlob className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-20" />
          <HeroBlob className="absolute -bottom-40 -right-40 w-[400px] h-[400px] opacity-15" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Fitur Unggulan</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dirancang untuk{' '}
              <span className="gradient-text">Efisiensi Nyata</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Setiap fitur FLOVA dirancang dengan satu tujuan: membantu Anda mengidentifikasi dan menghilangkan hambatan layanan lebih cepat.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Deteksi Bottleneck Otomatis',
                desc: 'Algoritma cerdas menganalisis rata-rata durasi setiap tahap secara real-time dan secara otomatis menandai tahap dengan waktu tunggu tertinggi.',
                color: 'text-yellow-500',
                bg: 'bg-yellow-50',
              },
              {
                icon: BarChart3,
                title: 'Dashboard Analitik Visual',
                desc: 'Visualisasi data yang kaya dengan grafik batang, grafik garis tren, dan diagram distribusi yang mudah dipahami sekilas.',
                color: 'text-primary',
                bg: 'bg-primary-50',
              },
              {
                icon: Clock,
                title: 'Input Waktu Real-Time',
                desc: 'Staff mencatat waktu mulai dan selesai setiap layanan. Durasi dihitung otomatis dan langsung masuk ke sistem analitik.',
                color: 'text-indigo-500',
                bg: 'bg-indigo-50',
              },
              {
                icon: TrendingUp,
                title: 'Rekomendasi Berbasis Data',
                desc: 'Engine rekomendasi menganalisis pola dan memberikan saran konkret untuk perbaikan alur layanan berdasarkan data historis.',
                color: 'text-green-500',
                bg: 'bg-green-50',
              },
              {
                icon: Shield,
                title: 'Kontrol Akses Berbasis Peran',
                desc: 'Admin, Staff, dan Viewer memiliki akses yang disesuaikan. Data aman dengan Row Level Security dari Supabase.',
                color: 'text-purple-500',
                bg: 'bg-purple-50',
              },
              {
                icon: Activity,
                title: 'Riwayat Layanan Lengkap',
                desc: 'Akses seluruh catatan layanan dengan pencarian, filter tahap, dan filter tanggal. Admin dapat menghapus data yang tidak valid.',
                color: 'text-pink-500',
                bg: 'bg-pink-50',
              },
            ].map(({ icon: Icon, title, desc, color, bg }, idx) => (
              <ScrollReveal key={title} delay={idx * 80} direction="up">
                <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS
          ========================================= */}
      <section id="cara-kerja" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <CircleRings className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 text-primary opacity-20" />
          <CircleRings className="absolute -right-20 top-0 w-64 h-64 text-primary opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Cara Kerja</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tiga Langkah Menuju{' '}
              <span className="gradient-text">Layanan Lebih Baik</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-100 to-primary-100">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40 animate-pulse-slow" />
            </div>

            {[
              {
                step: '01',
                title: 'Konfigurasi Tahap',
                desc: 'Admin mendefinisikan tahap-tahap layanan yang ada, misalnya Registrasi, Pemeriksaan, Pelayanan, hingga Pembayaran.',
                icon: CheckCircle,
              },
              {
                step: '02',
                title: 'Staff Mencatat Data',
                desc: 'Staf mengisi waktu mulai dan selesai setiap pelanggan di setiap tahap. Sistem menghitung durasi secara otomatis.',
                icon: Clock,
              },
              {
                step: '03',
                title: 'Analisis & Tindakan',
                desc: 'Dashboard menampilkan bottleneck secara visual dan engine rekomendasi memberikan saran perbaikan berdasarkan pola data.',
                icon: TrendingUp,
              },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/25 mb-5 mx-auto">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          USE CASES
          ========================================= */}
      <section id="manfaat" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Cocok Untuk</p>
            <h2 className="text-4xl font-bold text-gray-900">
              Solusi untuk Berbagai{' '}
              <span className="gradient-text">Jenis Layanan</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Puskesmas & Klinik', desc: 'Pendaftaran hingga farmasi' },
              { name: 'Kantor Pemerintah', desc: 'Loket pelayanan publik' },
              { name: 'Bengkel Otomotif', desc: 'Penerimaan hingga pickup' },
              { name: 'Bisnis Jasa', desc: 'Alur layanan multi-tahap' },
            ].map(({ name, desc }) => (
              <div
                key={name}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center hover:bg-primary-50 hover:border-primary/20 transition-all group cursor-default"
              >
                <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">{name}</h4>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          CTA SECTION
          ========================================= */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <GridPattern className="absolute inset-0 w-full h-full text-primary opacity-[0.03]" />
          <CircleRings className="absolute -bottom-20 -right-20 w-80 h-80 text-primary opacity-5" />
          <CircleRings className="absolute -top-20 -left-20 w-64 h-64 text-primary opacity-5" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-8">
            <Image src="/logo.png" alt="FLOVA" width={130} height={40} className="h-10 w-auto object-contain" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Mulai Optimalkan Layanan Anda Hari Ini
          </h2>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
            Bergabunglah dan gunakan FLOVA untuk mendeteksi bottleneck, memahami pola layanan, dan meningkatkan kepuasan pelanggan secara terukur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/30 hover:shadow-2xl transition-all hover:scale-105 group"
            >
              Buat Akun Gratis
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-2xl border border-gray-200 hover:border-primary hover:text-primary transition-all"
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          FOOTER
          ========================================= */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="FLOVA" width={80} height={24} className="h-6 w-auto object-contain" />
            </div>
            <p className="text-gray-400 text-xs text-center">
              Dirancang untuk membantu organisasi meningkatkan efisiensi layanan berbasis data.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <Link href="/login" className="hover:text-primary transition-colors">Masuk</Link>
              <Link href="/register" className="hover:text-primary transition-colors">Daftar</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


