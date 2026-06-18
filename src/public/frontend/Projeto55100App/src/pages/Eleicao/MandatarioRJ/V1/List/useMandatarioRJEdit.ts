import { useState, useRef } from 'react'
import type React from 'react'
import {
  getByIdTable,
  createTable,
  updateTable,
  type MandatarioRJTable,
} from '../../../../../services/modules/V1/mandatarioRJService'

export type EditMode = 'create' | 'edit'

export interface UseMandatarioRJEditReturn {
  mode: EditMode
  editId: number | null
  editData: MandatarioRJTable | null
  loadingEdit: boolean
  saving: boolean
  saveError: string | null
  saveSuccess: boolean
  modalRef: React.RefObject<HTMLDivElement>
  handleNew: () => void
  handleEdit: (id: number) => Promise<void>
  handleSave: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function useMandatarioRJEdit(onReloadList: () => void): UseMandatarioRJEditReturn {
  const [mode, setMode] = useState<EditMode>('edit')
  const [editId, setEditId] = useState<number | null>(null)
  const [editData, setEditData] = useState<MandatarioRJTable | null>(null)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

  function openModal() {
    const bootstrap = (window as unknown as Record<string, unknown>)['bootstrap'] as {
      Modal: { getOrCreateInstance: (el: Element) => { show(): void } }
    }
    if (modalRef.current && bootstrap?.Modal) {
      bootstrap.Modal.getOrCreateInstance(modalRef.current).show()
    }
  }

  function handleNew() {
    setMode('create')
    setEditId(null)
    setEditData(null)
    setSaveError(null)
    setSaveSuccess(false)
    openModal()
  }

  async function handleEdit(id: number) {
    setMode('edit')
    setEditId(id)
    setEditData(null)
    setSaveError(null)
    setSaveSuccess(false)
    setLoadingEdit(true)
    openModal()

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
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const fd = new FormData(e.currentTarget)
    const payload: Record<string, unknown> = {}
    fd.forEach((v, k) => { payload[k] = v === '' ? null : v })

    try {
      const res = mode === 'create'
        ? await createTable(payload)
        : await updateTable(editId!, payload)

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
    mode,
    editId,
    editData,
    loadingEdit,
    saving,
    saveError,
    saveSuccess,
    modalRef,
    handleNew,
    handleEdit,
    handleSave,
  }
}
