'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import Image from 'next/image'
import { AuthBackground, DotMatrix, CircleRings } from '@/components/svg-decorations'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left panel - branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center gap-12 w-[45%] bg-gradient-to-br from-primary-dark via-primary to-indigo-500 p-12 relative overflow-hidden">
        <AuthBackground className="absolute inset-0 w-full h-full" />
        <CircleRings className="absolute -bottom-20 -right-20 w-96 h-96 text-white opacity-10" />
        <DotMatrix className="absolute top-10 right-10 w-40 h-28 text-white opacity-20" />

        <div className="relative z-10">
          <Image src="/logo.png" alt="FLOVA" width={120} height={38} className="h-9 w-auto object-contain brightness-0 invert" />
        </div>

        <div className="relative z-10">
          <blockquote className="text-white/90 text-2xl font-light leading-relaxed mb-6">
            "Identifikasi bottleneck, optimalkan alur, tingkatkan kepuasan pelanggan — semua dalam satu dasbor."
          </blockquote>
          <p className="text-blue-200 text-sm">Service Bottleneck Detection System</p>

          {/* Animated stat pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: 'Deteksi Real-Time', dot: true },
              { label: 'Multi-Tahap', dot: false },
              { label: 'Role-Based Access', dot: false },
            ].map(({ label, dot }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-medium"
              >
                {dot && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse-slow inline-block" />}
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white relative">
        <CircleRings className="absolute top-0 right-0 w-48 h-48 text-primary opacity-5" />
        <DotMatrix className="absolute bottom-8 left-8 w-32 h-20 text-primary opacity-10" />

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <Image src="/logo.png" alt="FLOVA" width={100} height={32} className="h-8 w-auto object-contain" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
          <p className="text-gray-500 text-sm mb-8">Masuk ke akun Anda untuk melanjutkan</p>

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Masukkan password"
                  required
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
              id="login-submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/25 cursor-pointer transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Masuk
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{' '}
              <Link href="/register" className="text-primary hover:text-primary-dark font-semibold">
                Daftar sekarang
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
