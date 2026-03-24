'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ServiceStage } from '@/lib/types'
import { CheckCircle, ClipboardEdit, Plus, Send } from 'lucide-react'

export default function InputPage() {
  const [stages, setStages] = useState<ServiceStage[]>([])
  const [customerName, setCustomerName] = useState('')
  const [selectedStage, setSelectedStage] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchStages = async () => {
      const { data } = await supabase
        .from('service_stages')
        .select('*')
        .order('display_order', { ascending: true })
      if (data) setStages(data)
    }
    fetchStages()
  }, [supabase])

  // Set default times to now
  useEffect(() => {
    const now = new Date()
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setStartTime(localISOTime)
    setEndTime(localISOTime)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!customerName || !selectedStage || !startTime || !endTime) {
      setError('Semua field harus diisi')
      setLoading(false)
      return
    }

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (end <= start) {
      setError('Waktu selesai harus lebih dari waktu mulai')
      setLoading(false)
      return
    }

    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)

    const { data: { user } } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('service_logs').insert({
      customer_name: customerName,
      service_stage: selectedStage,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      duration: durationMinutes,
      user_id: user?.id,
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess(true)
      setCustomerName('')
      setSelectedStage('')
      // Reset times to now
      const now = new Date()
      const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
      setStartTime(localISOTime)
      setEndTime(localISOTime)

      setTimeout(() => setSuccess(false), 3000)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <ClipboardEdit className="w-6 h-6 text-primary" />
          Input Layanan
        </h1>
        <p className="text-text-muted text-sm mt-1">Catat data layanan baru</p>
      </div>

      {/* Form Card */}
      <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border-light shadow-sm animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Name */}
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-text-secondary mb-1.5">
              Nama Pelanggan
            </label>
            <input
              id="customer_name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama pelanggan"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface-alt text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>

          {/* Service Stage */}
          <div>
            <label htmlFor="service_stage" className="block text-sm font-medium text-text-secondary mb-1.5">
              Tahap Layanan
            </label>
            <select
              id="service_stage"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface-alt text-text focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm appearance-none cursor-pointer"
            >
              <option value="">Pilih tahap layanan</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.name}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time inputs - Grid on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-text-secondary mb-1.5">
                Waktu Mulai
              </label>
              <input
                id="start_time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface-alt text-text focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-text-secondary mb-1.5">
                Waktu Selesai
              </label>
              <input
                id="end_time"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface-alt text-text focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          {/* Duration preview */}
          {startTime && endTime && new Date(endTime) > new Date(startTime) && (
            <div className="bg-primary-50 rounded-xl px-4 py-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Durasi: {((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)).toFixed(1)} menit
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-danger-50 border border-danger-light/50 text-danger rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-success-50 border border-success-light/50 text-success rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Data berhasil disimpan!
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/25 hover:shadow-primary/35 text-base cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Simpan Data
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick Add Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-text-muted flex items-center justify-center gap-1">
          <Plus className="w-3 h-3" />
          Tahap layanan dapat ditambahkan di halaman Pengaturan
        </p>
      </div>
    </div>
  )
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  )
}
