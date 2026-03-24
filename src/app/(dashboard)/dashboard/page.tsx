'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ServiceLog, StageAnalytics } from '@/lib/types'
import { StageBarChart, HourlyLineChart } from '@/components/charts'
import {
  Activity,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'

interface DashboardData {
  totalToday: number
  avgDuration: number
  bottleneck: StageAnalytics | null
  stageData: StageAnalytics[]
  hourlyData: { hour: string; count: number }[]
  recentActivities: ServiceLog[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalToday: 0,
    avgDuration: 0,
    bottleneck: null,
    stageData: [],
    hourlyData: [],
    recentActivities: [],
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const supabase = createClient()

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    // Fetch today's service logs
    const { data: logs } = await supabase
      .from('service_logs')
      .select('*')
      .gte('created_at', todayISO)
      .order('created_at', { ascending: false })

    const allLogs = logs || []

    // Calculate metrics
    const totalToday = allLogs.length
    const avgDuration =
      allLogs.length > 0
        ? allLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / allLogs.length
        : 0

    // Aggregate by stage
    const stageMap = new Map<string, { count: number; totalDuration: number }>()
    allLogs.forEach((log) => {
      const existing = stageMap.get(log.service_stage) || { count: 0, totalDuration: 0 }
      existing.count += 1
      existing.totalDuration += log.duration || 0
      stageMap.set(log.service_stage, existing)
    })

    const totalDuration = allLogs.reduce((sum, log) => sum + (log.duration || 0), 0)

    const stageData: StageAnalytics[] = Array.from(stageMap.entries()).map(
      ([stage, { count, totalDuration: td }]) => ({
        stage,
        count,
        totalDuration: td,
        avgDuration: count > 0 ? td / count : 0,
        percentage: totalDuration > 0 ? (td / totalDuration) * 100 : 0,
      })
    )

    // Bottleneck = stage with highest average duration
    const bottleneck =
      stageData.length > 0
        ? stageData.reduce((max, s) => (s.avgDuration > max.avgDuration ? s : max), stageData[0])
        : null

    // Hourly data
    const hourMap = new Map<number, number>()
    for (let i = 0; i < 24; i++) hourMap.set(i, 0)
    allLogs.forEach((log) => {
      const hour = new Date(log.created_at).getHours()
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1)
    })

    const hourlyData = Array.from(hourMap.entries())
      .map(([hour, count]) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        count,
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour))

    // Recent activities (last 10)
    const recentActivities = allLogs.slice(0, 10)

    setData({ totalToday, avgDuration, bottleneck, stageData, hourlyData, recentActivities })
    setLoading(false)
    setRefreshing(false)
  }, [supabase])

  useEffect(() => {
    fetchData()

    // Real-time subscription
    const channel = supabase
      .channel('service_logs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_logs' },
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData, supabase])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-border/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface rounded-2xl animate-pulse border border-border-light" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-surface rounded-2xl animate-pulse border border-border-light" />
          <div className="h-80 bg-surface rounded-2xl animate-pulse border border-border-light" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Overview layanan hari ini</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          className={`flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm text-text-secondary hover:border-primary hover:text-primary cursor-pointer ${
            refreshing ? 'opacity-60' : ''
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Layanan */}
        <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm card-hover animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-text-muted font-medium">Hari ini</span>
          </div>
          <p className="text-3xl font-bold text-text">{data.totalToday}</p>
          <p className="text-sm text-text-muted mt-1">Total Layanan</p>
        </div>

        {/* Rata-rata Durasi */}
        <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm card-hover animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-text-muted font-medium">Avg</span>
          </div>
          <p className="text-3xl font-bold text-text">{data.avgDuration.toFixed(1)}</p>
          <p className="text-sm text-text-muted mt-1">Rata-rata Durasi (menit)</p>
        </div>

        {/* Bottleneck */}
        <div className="bg-surface rounded-2xl p-5 border border-danger/20 shadow-sm card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-danger-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <span className="text-xs text-danger font-medium animate-pulse-slow">Bottleneck</span>
          </div>
          <p className="text-lg font-bold text-danger truncate">
            {data.bottleneck?.stage || '-'}
          </p>
          <p className="text-sm text-text-muted mt-1">
            {data.bottleneck
              ? `Avg ${data.bottleneck.avgDuration.toFixed(1)} menit (${data.bottleneck.percentage.toFixed(0)}%)`
              : 'Belum ada data'}
          </p>
        </div>

        {/* Tahap Terbanyak */}
        <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm card-hover animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs text-text-muted font-medium">Terbanyak</span>
          </div>
          <p className="text-3xl font-bold text-text">
            {data.stageData.length > 0
              ? data.stageData.reduce((max, s) => (s.count > max.count ? s : max), data.stageData[0]).count
              : 0}
          </p>
          <p className="text-sm text-text-muted mt-1">
            {data.stageData.length > 0
              ? data.stageData.reduce((max, s) => (s.count > max.count ? s : max), data.stageData[0]).stage
              : 'Tahap terbanyak'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart - Distribusi Waktu per Tahap */}
        <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-base font-semibold text-text mb-1">Distribusi Waktu per Tahap</h3>
          <p className="text-xs text-text-muted mb-4">Rata-rata durasi layanan (menit)</p>
          {data.stageData.length > 0 ? (
            <StageBarChart data={data.stageData} bottleneckStage={data.bottleneck?.stage} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-muted text-sm">
              Belum ada data hari ini
            </div>
          )}
        </div>

        {/* Line chart - Tren Layanan per Jam */}
        <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <h3 className="text-base font-semibold text-text mb-1">Tren Layanan per Jam</h3>
          <p className="text-xs text-text-muted mb-4">Jumlah layanan berdasarkan jam</p>
          {data.hourlyData.some((h) => h.count > 0) ? (
            <HourlyLineChart data={data.hourlyData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-muted text-sm">
              Belum ada data hari ini
            </div>
          )}
        </div>
      </div>

      {/* Bottleneck Insight + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insight Card */}
        {data.bottleneck && (
          <div className="bg-gradient-to-br from-danger-50 to-surface rounded-2xl p-6 border border-danger/10 shadow-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h3 className="text-base font-semibold text-text">Bottleneck Insight</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-text-secondary leading-relaxed">
                Tahap <span className="font-semibold text-danger">{data.bottleneck.stage}</span> menyumbang{' '}
                <span className="font-semibold text-danger">{data.bottleneck.percentage.toFixed(0)}%</span>{' '}
                dari total waktu layanan, dengan rata-rata durasi{' '}
                <span className="font-semibold">{data.bottleneck.avgDuration.toFixed(1)} menit</span>.
              </p>
              <div className="flex items-center gap-2 text-xs text-text-muted bg-surface/80 rounded-xl px-3 py-2">
                <Activity className="w-4 h-4" />
                <span>{data.bottleneck.count} entri tercatat pada tahap ini</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className={`bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in ${data.bottleneck ? 'lg:col-span-2' : 'lg:col-span-3'}`} style={{ animationDelay: '0.35s' }}>
          <h3 className="text-base font-semibold text-text mb-4">Aktivitas Terakhir</h3>
          {data.recentActivities.length > 0 ? (
            <div className="space-y-2">
              {data.recentActivities.map((activity, i) => (
                <div
                  key={activity.id || i}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-surface-hover"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {activity.customer_name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text truncate">{activity.customer_name}</p>
                      <p className="text-xs text-text-muted">{activity.service_stage}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-medium text-text">{activity.duration?.toFixed(1)} min</p>
                    <p className="text-xs text-text-muted">
                      {new Date(activity.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-text-muted text-sm">
              Belum ada aktivitas hari ini
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
