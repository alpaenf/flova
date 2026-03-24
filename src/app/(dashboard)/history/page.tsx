'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import type { ServiceLog } from '@/lib/types'
import {
  History as HistoryIcon,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  X,
  Trash2,
} from 'lucide-react'

const PAGE_SIZE = 15

export default function HistoryPage() {
  const [logs, setLogs] = useState<ServiceLog[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [stages, setStages] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const supabase = createClient()
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  // Fetch unique stages
  useEffect(() => {
    const fetchStages = async () => {
      const { data } = await supabase
        .from('service_stages')
        .select('name')
        .order('display_order', { ascending: true })
      if (data) setStages(data.map((s) => s.name))
    }
    fetchStages()
  }, [supabase])

  const fetchLogs = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('service_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (search) {
      query = query.ilike('customer_name', `%${search}%`)
    }
    if (stageFilter) {
      query = query.eq('service_stage', stageFilter)
    }
    if (dateFilter) {
      const startOfDay = new Date(dateFilter)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(dateFilter)
      endOfDay.setHours(23, 59, 59, 999)
      query = query
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
    }

    const { data, count } = await query
    setLogs(data || [])
    setTotalCount(count || 0)
    setLoading(false)
  }, [page, search, stageFilter, dateFilter, supabase])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  useEffect(() => {
    setPage(0)
  }, [search, stageFilter, dateFilter])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await supabase.from('service_logs').delete().eq('id', id)
    if (!error) {
      setLogs((prev) => prev.filter((log) => log.id !== id))
      setTotalCount((prev) => prev - 1)
    }
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const clearFilters = () => {
    setSearch('')
    setStageFilter('')
    setDateFilter('')
  }

  const hasActiveFilters = search || stageFilter || dateFilter

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 shadow-xl max-w-sm w-full border border-border-light animate-fade-in">
            <div className="w-12 h-12 bg-danger-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-danger" />
            </div>
            <h3 className="text-base font-semibold text-text text-center mb-2">Hapus Data?</h3>
            <p className="text-sm text-text-muted text-center mb-6">
              Data layanan ini akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-surface-hover cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
                className="flex-1 py-2.5 rounded-xl bg-danger text-white text-sm font-medium hover:bg-red-600 cursor-pointer disabled:opacity-60"
              >
                {deletingId === confirmDeleteId ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-primary" />
          History
        </h1>
        <p className="text-text-muted text-sm mt-1">Riwayat seluruh data layanan</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pelanggan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-alt text-text placeholder:text-text-muted text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer ${
              hasActiveFilters
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-border text-text-secondary hover:border-primary'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
            {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-border-light flex flex-col sm:flex-row gap-3 animate-fade-in">
            <div className="flex-1">
              <label className="block text-xs text-text-muted mb-1">Tahap Layanan</label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-sm text-text cursor-pointer"
              >
                <option value="">Semua tahap</option>
                {stages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-text-muted mb-1">Tanggal</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-sm text-text"
              />
            </div>
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-text-muted hover:text-danger cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Hapus filter
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-border/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <HistoryIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
            <p className="text-text-muted text-sm">
              {hasActiveFilters ? 'Tidak ada data yang cocok dengan filter' : 'Belum ada data layanan'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Nama Pelanggan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Tahap</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Waktu Mulai</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Waktu Selesai</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Durasi</th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-hover group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-primary">
                              {log.customer_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-text">{log.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block text-xs font-medium bg-primary-50 text-primary px-2.5 py-1 rounded-lg">
                          {log.service_stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {new Date(log.start_time).toLocaleString('id-ID', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {new Date(log.end_time).toLocaleString('id-ID', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${(log.duration || 0) > 15 ? 'text-danger' : 'text-success'}`}>
                          {log.duration?.toFixed(1)} min
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setConfirmDeleteId(log.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-danger hover:bg-danger-50 rounded-lg cursor-pointer transition-all"
                            title="Hapus data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden divide-y divide-border-light">
              {logs.map((log) => (
                <div key={log.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {log.customer_name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-text">{log.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${(log.duration || 0) > 15 ? 'text-danger' : 'text-success'}`}>
                        {log.duration?.toFixed(1)} min
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => setConfirmDeleteId(log.id)}
                          className="p-1.5 text-text-muted hover:text-danger hover:bg-danger-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted ml-10">
                    <span className="inline-block bg-primary-50 text-primary px-2 py-0.5 rounded font-medium">
                      {log.service_stage}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleDateString('id-ID')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border-light flex items-center justify-between">
            <p className="text-xs text-text-muted">
              Menampilkan {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} dari {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-text-secondary px-2">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
