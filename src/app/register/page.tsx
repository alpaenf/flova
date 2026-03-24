'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { AuthBackground, DotMatrix, CircleRings } from '@/components/svg-decorations'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'viewer' },
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
        <CircleRings className="absolute top-0 right-0 w-80 h-80 text-primary opacity-5" />
        <div className="w-full max-w-md animate-fade-in relative z-10">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-3xl mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Pendaftaran Berhasil</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Akun Anda telah dibuat. Silakan cek email untuk mengkonfirmasi akun, lalu masuk ke aplikasi.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-primary/25 transition-all"
            >
              Masuk ke Aplikasi
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center gap-12 w-[45%] bg-gradient-to-br from-indigo-600 via-primary to-primary-dark p-12 relative overflow-hidden">
        <AuthBackground className="absolute inset-0 w-full h-full" />
        <CircleRings className="absolute -top-20 -right-20 w-96 h-96 text-white opacity-10" />
        <DotMatrix className="absolute bottom-10 right-10 w-48 h-32 text-white opacity-20" />

        <div className="relative z-10">
          <Image src="/logo.png" alt="FLOVA" width={120} height={38} className="h-9 w-auto object-contain brightness-0 invert" />
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-white text-3xl font-bold leading-tight">
            Bergabung dan mulai optimalkan layanan Anda.
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Buat akun gratis dan mulai mendeteksi bottleneck layanan Anda dalam hitungan menit.
          </p>
          {/* Benefit list */}
          <div className="space-y-3 mt-6">
            {[
              'Dashboard analitik real-time',
              'Deteksi bottleneck otomatis',
              'Akses berbasis peran (Admin, Staff, Viewer)',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-white">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <span className="text-blue-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white relative">
        <CircleRings className="absolute bottom-0 right-0 w-48 h-48 text-primary opacity-5" />
        <DotMatrix className="absolute top-8 left-8 w-32 h-20 text-primary opacity-10" />

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <Image src="/logo.png" alt="FLOVA" width={100} height={32} className="h-8 w-auto object-contain" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru</h1>
          <p className="text-gray-500 text-sm mb-8">Isi data di bawah untuk memulai</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama lengkap Anda"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 text-sm focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 text-sm pr-12 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="register-submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/25 cursor-pointer transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Buat Akun
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary hover:text-primary-dark font-semibold">
                Masuk di sini
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Kembali ke halaman utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
