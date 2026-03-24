'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { StageAnalytics, HourlyData } from '@/lib/types'
import { StageBarChart, StagePieChart, HourlyLineChart, DurationBreakdownChart } from '@/components/charts'
import {
  BarChart3,
  Lightbulb,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Calendar,
} from 'lucide-react'

interface Recommendation {
  type: 'danger' | 'warning' | 'info'
  title: string
  description: string
}

export default function AnalyticsPage() {
  const [stageData, setStageData] = useState<StageAnalytics[]>([])
  const [hourlyData, setHourlyData] = useState<{ hour: string; count: number }[]>([])
  const [peakHour, setPeakHour] = useState<string>('-')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('7days')
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)

    const now = new Date()
    let startDate: Date

    switch (dateRange) {
      case 'today':
        startDate = new Date(now)
        startDate.setHours(0, 0, 0, 0)
        break
      case '7days':
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30days':
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 30)
        break
    }

    const { data: logs } = await supabase
      .from('service_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    const allLogs = logs || []

    // Stage aggregation
    const stageMap = new Map<string, { count: number; totalDuration: number }>()
    allLogs.forEach((log) => {
      const existing = stageMap.get(log.service_stage) || { count: 0, totalDuration: 0 }
      existing.count += 1
      existing.totalDuration += log.duration || 0
      stageMap.set(log.service_stage, existing)
    })

    const totalDuration = allLogs.reduce((sum, log) => sum + (log.duration || 0), 0)

    const stages: StageAnalytics[] = Array.from(stageMap.entries())
      .map(([stage, { count, totalDuration: td }]) => ({
        stage,
        count,
        totalDuration: td,
        avgDuration: count > 0 ? td / count : 0,
        percentage: totalDuration > 0 ? (td / totalDuration) * 100 : 0,
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)

    setStageData(stages)

    // Hourly aggregation
    const hourMap = new Map<number, { count: number; totalDuration: number }>()
    for (let i = 0; i < 24; i++) hourMap.set(i, { count: 0, totalDuration: 0 })
    allLogs.forEach((log) => {
      const hour = new Date(log.created_at).getHours()
      const existing = hourMap.get(hour) || { count: 0, totalDuration: 0 }
      existing.count += 1
      existing.totalDuration += log.duration || 0
      hourMap.set(hour, existing)
    })

    const hourly = Array.from(hourMap.entries())
      .map(([hour, { count }]) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        count,
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour))

    setHourlyData(hourly)

    // Peak hour
    const peak = hourly.reduce((max, h) => (h.count > max.count ? h : max), hourly[0])
    setPeakHour(peak && peak.count > 0 ? peak.hour : '-')

    // Generate recommendations
    const recs: Recommendation[] = []
    const DURATION_THRESHOLD = 15 // minutes

    stages.forEach((stage) => {
      if (stage.avgDuration > DURATION_THRESHOLD) {
        recs.push({
          type: 'danger',
          title: `Tahap "${stage.stage}" terlalu lama`,
          description: `Rata-rata durasi ${stage.avgDuration.toFixed(1)} menit (threshold: ${DURATION_THRESHOLD} menit). Pertimbangkan untuk menambah petugas atau menyederhanakan proses pada tahap ini.`,
        })
      }

      if (stage.percentage > 40) {
        recs.push({
          type: 'warning',
          title: `"${stage.stage}" mendominasi waktu layanan`,
          description: `Tahap ini menyumbang ${stage.percentage.toFixed(0)}% dari total waktu layanan. Hal ini mengindikasikan bottleneck signifikan.`,
        })
      }
    })

    if (peak && peak.count > 0) {
      const peakHourNum = parseInt(peak.hour)
      recs.push({
        type: 'info',
        title: `Peak hour terdeteksi pada jam ${peak.hour}`,
        description: `Terdapat ${peak.count} layanan pada jam ini. Tambahkan petugas pada jam ${peakHourNum}:00 - ${(peakHourNum + 1) % 24}:00 untuk mengurangi antrian.`,
      })
    }

    if (recs.length === 0 && stages.length > 0) {
      recs.push({
        type: 'info',
        title: 'Semua tahap berjalan optimal',
        description: 'Tidak ditemukan bottleneck signifikan. Pertahankan kinerja saat ini!',
      })
    }

    setRecommendations(recs)
    setLoading(false)
  }, [dateRange, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div className="h-8 w-48 bg-border/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-surface rounded-2xl animate-pulse border border-border-light" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Analytics
          </h1>
          <p className="text-text-muted text-sm mt-1">Analisis mendalam layanan Anda</p>
        </div>

        {/* Date range selector */}
        <div className="flex items-center bg-surface rounded-xl border border-border-light p-1 shadow-sm">
          {[
            { value: 'today' as const, label: 'Hari ini' },
            { value: '7days' as const, label: '7 Hari' },
            { value: '30days' as const, label: '30 Hari' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                dateRange === option.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-text-muted">Total Tahap</span>
          </div>
          <p className="text-2xl font-bold text-text">{stageData.length}</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-text-muted">Total Entri</span>
          </div>
          <p className="text-2xl font-bold text-text">
            {stageData.reduce((sum, s) => sum + s.count, 0)}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-warning" />
            <span className="text-xs text-text-muted">Avg Global</span>
          </div>
          <p className="text-2xl font-bold text-text">
            {stageData.length > 0
              ? (stageData.reduce((sum, s) => sum + s.totalDuration, 0) / stageData.reduce((sum, s) => sum + s.count, 0)).toFixed(1)
              : '0'}{' '}
            <span className="text-sm font-normal text-text-muted">min</span>
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs text-text-muted">Peak Hour</span>
          </div>
          <p className="text-2xl font-bold text-text">{peakHour}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in">
          <h3 className="text-base font-semibold text-text mb-1">Rata-rata Durasi per Tahap</h3>
          <p className="text-xs text-text-muted mb-4">Perbandingan waktu rata-rata setiap tahap</p>
          {stageData.length > 0 ? (
            <StageBarChart
              data={stageData}
              bottleneckStage={stageData.length > 0 ? stageData[0].stage : undefined}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-muted text-sm">
              Tidak ada data pada periode ini
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in">
          <h3 className="text-base font-semibold text-text mb-1">Distribusi Persentase</h3>
          <p className="text-xs text-text-muted mb-4">Kontribusi waktu per tahap</p>
          {stageData.length > 0 ? (
            <StagePieChart data={stageData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-muted text-sm">
              Tidak ada data pada periode ini
            </div>
          )}
        </div>

        {/* Duration breakdown */}
        <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in">
          <h3 className="text-base font-semibold text-text mb-1">Breakdown Total Durasi</h3>
          <p className="text-xs text-text-muted mb-4">Total waktu yang dihabiskan per tahap</p>
          {stageData.length > 0 ? (
            <DurationBreakdownChart data={stageData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-muted text-sm">
              Tidak ada data pada periode ini
            </div>
          )}
        </div>

        {/* Peak hours */}
        <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in">
          <h3 className="text-base font-semibold text-text mb-1">Analisis Peak Hour</h3>
          <p className="text-xs text-text-muted mb-4">Jumlah layanan per jam</p>
          {hourlyData.some((h) => h.count > 0) ? (
            <HourlyLineChart data={hourlyData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-muted text-sm">
              Tidak ada data pada periode ini
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-warning" />
          <h3 className="text-base font-semibold text-text">Rekomendasi</h3>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, i) => {
              const styles = {
                danger: {
                  bg: 'bg-danger-50',
                  border: 'border-danger/10',
                  icon: <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0" />,
                  title: 'text-danger',
                },
                warning: {
                  bg: 'bg-warning-50',
                  border: 'border-warning/10',
                  icon: <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />,
                  title: 'text-warning',
                },
                info: {
                  bg: 'bg-primary-50',
                  border: 'border-primary/10',
                  icon: <Lightbulb className="w-5 h-5 text-primary flex-shrink-0" />,
                  title: 'text-primary',
                },
              }

              const style = styles[rec.type]

              return (
                <div
                  key={i}
                  className={`${style.bg} rounded-xl p-4 border ${style.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{style.icon}</div>
                    <div>
                      <p className={`text-sm font-semibold ${style.title} mb-1`}>{rec.title}</p>
                      <p className="text-xs text-text-secondary leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-text-muted text-sm">
            Tidak ada rekomendasi saat ini
          </div>
        )}
      </div>
    </div>
  )
}
