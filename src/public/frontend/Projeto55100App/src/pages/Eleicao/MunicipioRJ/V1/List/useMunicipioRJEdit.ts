import { useState, useRef } from 'react'
import type React from 'react'
import {
  getByIdTable,
  updateTable,
  type MunicipioRJTable,
} from '../../../../../services/modules/V1/municipioRJService'

export interface UseMunicipioRJEditReturn {
  editId: number | null
  editData: MunicipioRJTable | null
  loadingEdit: boolean
  saving: boolean
  saveError: string | null
  saveSuccess: boolean
  modalRef: React.RefObject<HTMLDivElement>
  handleEdit: (id: number) => Promise<void>
  handleSave: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function useMunicipioRJEdit(onReloadList: () => void): UseMunicipioRJEditReturn {
  const [editId, setEditId] = useState<number | null>(null)
  const [editData, setEditData] = useState<MunicipioRJTable | null>(null)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

  async function handleEdit(id: number) {
    setEditId(id)
    setEditData(null)
    setSaveError(null)
    setSaveSuccess(false)
    setLoadingEdit(true)

    const modal = (window as unknown as Record<string, unknown>)['bootstrap'] as {
      Modal: { getOrCreateInstance: (el: Element) => { show(): void } }
    }
    if (modalRef.current && modal?.Modal) {
      modal.Modal.getOrCreateInstance(modalRef.current).show()
    }

    try {
      const res = await getByIdTable(id)
      if (res.success && res.data) {
        setEditData(res.data)
      } else {
        setSaveError(res.message ?? 'Erro ao carregar registro')
      }
    } catch {
      setSaveError('Erro de conexão ao carregar registro')
    } finally {
      setLoadingEdit(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editId) return
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const fd = new FormData(e.currentTarget)
    const payload: Record<string, unknown> = {}
    fd.forEach((v, k) => { payload[k] = v === '' ? null : v })

    try {
      const res = await updateTable(editId, payload)
      if (res.success) {
        setSaveSuccess(true)
        onReloadList()
      } else {
        setSaveError(res.message ?? 'Erro ao salvar')
      }
    } catch {
      setSaveError('Erro de conexão ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return {
    editId,
    editData,
    loadingEdit,
    saving,
    saveError,
    saveSuccess,
    modalRef,
    handleEdit,
    handleSave,
  }
}
