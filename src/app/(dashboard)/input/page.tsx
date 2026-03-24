'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ServiceStage } from '@/lib/types'
import { CheckCircle, ClipboardEdit, Plus, Send, Layers, Type } from 'lucide-react'

export default function InputPage() {
  const [stages, setStages] = useState<ServiceStage[]>([])
  const [inputMode, setInputMode] = useState<'single' | 'multiple'>('single')
  const [customerName, setCustomerName] = useState('')
  
  // Single mode state
  const [selectedStage, setSelectedStage] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  
  // Multiple mode state
  const [multipleData, setMultipleData] = useState<Record<string, { start: string; end: string }>>({})

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
      if (data) {
        setStages(data)
        const initialMultiple: Record<string, { start: string; end: string }> = {}
        data.forEach(stage => {
          initialMultiple[stage.name] = { start: '', end: '' }
        })
        setMultipleData(initialMultiple)
      }
    }
    fetchStages()
  }, [supabase])

  // Set default times to now for single mode initially
  useEffect(() => {
    const now = new Date()
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartTime(localISOTime)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEndTime(localISOTime)
  }, [])

  const handleMultipleChange = (stageName: string, field: 'start' | 'end', value: string) => {
    setMultipleData(prev => {
      const newData = {
        ...prev,
        [stageName]: {
          ...prev[stageName],
          [field]: value
        }
      }

      // Autofill logic: if end time is filled, auto-fill the start time of the next stage
      if (field === 'end' && value) {
        const stageIndex = stages.findIndex(s => s.name === stageName)
        if (stageIndex >= 0 && stageIndex < stages.length - 1) {
          const nextStage = stages[stageIndex + 1]
          // Only auto-fill if the next stage's start time is currently empty
          if (!newData[nextStage.name]?.start) {
            newData[nextStage.name] = {
              ...newData[nextStage.name],
              start: value
            }
          }
        }
      }

      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!customerName) {
      setError('Nama pelanggan harus diisi')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    const logsToInsert: Array<{ customer_name: string; service_stage: string; start_time: string; end_time: string; duration: number; user_id?: string }> = []

    if (inputMode === 'single') {
      if (!selectedStage || !startTime || !endTime) {
        setError('Semua field harus diisi untuk satu tahap')
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
      logsToInsert.push({
        customer_name: customerName,
        service_stage: selectedStage,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        duration: durationMinutes,
        user_id: user?.id,
      })
    } else {
      let hasValidStage = false
      let validationError = ''

      for (const stage of stages) {
        const data = multipleData[stage.name]
        if (data && data.start && data.end) {
          const start = new Date(data.start)
          const end = new Date(data.end)

          if (end <= start) {
            validationError = `Waktu selesai harus lebih dari waktu mulai pada tahap ${stage.name}`
            break
          }

          hasValidStage = true
          const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
          logsToInsert.push({
            customer_name: customerName,
            service_stage: stage.name,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            duration: durationMinutes,
            user_id: user?.id,
          })
        } else if ((data?.start && !data?.end) || (!data?.start && data?.end)) {
          validationError = `Tahap ${stage.name} harus diisi lengkap (mulai & selesai) atau dikosongkan`
          break
        }
      }

      if (validationError) {
        setError(validationError)
        setLoading(false)
        return
      }

      if (!hasValidStage) {
        setError('Pilih dan isi setidaknya satu tahap layanan')
        setLoading(false)
        return
      }
    }

    if (logsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('service_logs').insert(logsToInsert)

      if (insertError) {
        setError(insertError.message)
      } else {
        setSuccess(true)
        setCustomerName('')
        if (inputMode === 'single') {
          setSelectedStage('')
          const now = new Date()
          const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
          setStartTime(localISOTime)
          setEndTime(localISOTime)
        } else {
          const resetData: Record<string, { start: string; end: string }> = {}
          stages.forEach(stage => {
            resetData[stage.name] = { start: '', end: '' }
          })
          setMultipleData(resetData)
        }

        setTimeout(() => setSuccess(false), 3000)
      }
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <ClipboardEdit className="w-6 h-6 text-primary" />
          Input Layanan
        </h1>
        <p className="text-text-muted text-sm mt-1">Catat data layanan pelanggan</p>
      </div>

      <div className="flex bg-surface-alt p-1 rounded-xl mb-6 border border-border">
        <button
          type="button"
          onClick={() => setInputMode('single')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
            inputMode === 'single'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-text hover:bg-surface'
          }`}
        >
          <Type className="w-4 h-4" />
          Satu Tahap
        </button>
        <button
          type="button"
          onClick={() => setInputMode('multiple')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
            inputMode === 'multiple'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-text hover:bg-surface'
          }`}
        >
          <Layers className="w-4 h-4" />
          Semua Tahap
        </button>
      </div>

      <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border-light shadow-sm animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {inputMode === 'single' ? (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label htmlFor="service_stage" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Tahap Layanan
                </label>
                <select
                  id="service_stage"
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
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
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface-alt text-text focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              </div>
              
              {startTime && endTime && new Date(endTime) > new Date(startTime) && (
                <div className="bg-primary-50 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">
                    Durasi: {((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)).toFixed(1)} menit
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-primary-50 px-4 py-3 rounded-xl border border-primary-light/50 text-sm text-primary-dark mb-4 flex items-center gap-2">
                <Layers className="min-w-5 h-5" />
                <p>Isi tahap layanan yang dikerjakan. Tahap yang dibiarkan kosong akan diabaikan.</p>
              </div>

              <div className="space-y-4">
                {stages.map((stage, idx) => {
                  const data = multipleData[stage.name] || { start: '', end: '' };
                  return (
                    <div key={stage.id} className="p-4 rounded-xl border border-border bg-surface-alt space-y-3">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <h3 className="font-semibold text-text">{stage.name}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1">
                            Mulai
                          </label>
                          <input
                            type="datetime-local"
                            value={data.start}
                            onChange={(e) => handleMultipleChange(stage.name, 'start', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-text focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1">
                            Selesai
                          </label>
                          <input
                            type="datetime-local"
                            value={data.end}
                            onChange={(e) => handleMultipleChange(stage.name, 'end', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-text focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                          />
                        </div>
                      </div>
                      {data.start && data.end && new Date(data.end) > new Date(data.start) && (
                        <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Makan waktu {((new Date(data.end).getTime() - new Date(data.start).getTime()) / (1000 * 60)).toFixed(1)} menit</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-danger-50 border border-danger-light/50 text-danger rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success-50 border border-success-light/50 text-success rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Berhasil menyimpan layanan!
            </div>
          )}

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
                Simpan Data Layanan
              </>
            )}
          </button>
        </form>
      </div>

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
