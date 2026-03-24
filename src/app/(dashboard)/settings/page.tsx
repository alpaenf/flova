'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import type { ServiceStage } from '@/lib/types'
import {
  Settings as SettingsIcon,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Edit2,
  X,
  Check,
  Shield,
} from 'lucide-react'

export default function SettingsPage() {
  const { role } = useAuth()
  const [stages, setStages] = useState<ServiceStage[]>([])
  const [newStageName, setNewStageName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()

  const fetchStages = useCallback(async () => {
    const { data } = await supabase
      .from('service_stages')
      .select('*')
      .order('display_order', { ascending: true })
    if (data) setStages(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchStages()
  }, [fetchStages])

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text mb-2">Akses Terbatas</h2>
          <p className="text-text-muted text-sm">
            Hanya administrator yang dapat mengakses halaman pengaturan.
          </p>
        </div>
      </div>
    )
  }

  const addStage = async () => {
    if (!newStageName.trim()) return

    setSaving(true)
    setError('')

    const maxOrder = stages.length > 0 ? Math.max(...stages.map((s) => s.display_order)) : 0

    const { error: insertError } = await supabase.from('service_stages').insert({
      name: newStageName.trim(),
      display_order: maxOrder + 1,
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setNewStageName('')
      setSuccess('Tahap berhasil ditambahkan!')
      setTimeout(() => setSuccess(''), 3000)
      fetchStages()
    }

    setSaving(false)
  }

  const updateStage = async (id: string) => {
    if (!editingName.trim()) return

    setSaving(true)
    const { error: updateError } = await supabase
      .from('service_stages')
      .update({ name: editingName.trim() })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setEditingId(null)
      setEditingName('')
      setSuccess('Tahap berhasil diperbarui!')
      setTimeout(() => setSuccess(''), 3000)
      fetchStages()
    }

    setSaving(false)
  }

  const deleteStage = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tahap ini?')) return

    const { error: deleteError } = await supabase
      .from('service_stages')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
    } else {
      setSuccess('Tahap berhasil dihapus!')
      setTimeout(() => setSuccess(''), 3000)
      fetchStages()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary" />
          Pengaturan
        </h1>
        <p className="text-text-muted text-sm mt-1">Kelola tahap layanan dan konfigurasi sistem</p>
      </div>

      {/* Add new stage */}
      <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in">
        <h3 className="text-base font-semibold text-text mb-4">Tambah Tahap Layanan</h3>

        <div className="flex gap-3">
          <input
            type="text"
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            placeholder="Nama tahap baru (contoh: Registrasi)"
            onKeyDown={(e) => e.key === 'Enter' && addStage()}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-surface-alt text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
          />
          <button
            onClick={addStage}
            disabled={saving || !newStageName.trim()}
            className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl disabled:opacity-50 shadow-lg shadow-primary/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        {error && (
          <div className="mt-3 bg-danger-50 border border-danger-light/50 text-danger rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-3 bg-success-50 border border-success-light/50 text-success rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            {success}
          </div>
        )}
      </div>

      {/* Stage list */}
      <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm animate-fade-in">
        <h3 className="text-base font-semibold text-text mb-4">
          Daftar Tahap Layanan ({stages.length})
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-border/30 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : stages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-muted text-sm">
              Belum ada tahap layanan. Tambahkan tahap pertama di atas.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className="flex items-center gap-3 py-3 px-4 rounded-xl border border-border-light hover:border-border bg-surface-alt group"
              >
                {/* Order number */}
                <div className="flex items-center gap-2 text-text-muted">
                  <GripVertical className="w-4 h-4 opacity-40" />
                  <span className="text-xs font-medium w-5 text-center">{index + 1}</span>
                </div>

                {/* Name */}
                {editingId === stage.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateStage(stage.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    autoFocus
                    className="flex-1 px-3 py-1.5 rounded-lg border border-primary bg-white text-sm text-text focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <span className="flex-1 text-sm font-medium text-text">{stage.name}</span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {editingId === stage.id ? (
                    <>
                      <button
                        onClick={() => updateStage(stage.id)}
                        className="p-2 rounded-lg hover:bg-success-50 text-success cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-lg hover:bg-surface-hover text-text-muted cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(stage.id)
                          setEditingName(stage.name)
                        }}
                        className="p-2 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteStage(stage.id)}
                        className="p-2 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="bg-primary-50 rounded-2xl p-5 border border-primary/10">
        <h4 className="text-sm font-semibold text-primary mb-2">ℹ️ Tips Pengaturan</h4>
        <ul className="text-xs text-text-secondary space-y-1.5 leading-relaxed">
          <li>• Tahap layanan akan otomatis muncul pada form input layanan</li>
          <li>• Urutan tahap menentukan alur proses layanan (contoh: Registrasi → Pemeriksaan → Pembayaran)</li>
          <li>• Menghapus tahap tidak akan menghapus data layanan yang sudah tercatat</li>
          <li>• Hanya admin yang dapat mengelola tahap layanan</li>
        </ul>
      </div>
    </div>
  )
}
