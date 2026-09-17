'use client'

import Link from 'next/link'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useState } from 'react'
import { firebaseAuth, firestore } from '@/lib/firebase'

export default function ProponerComandoPage() {
  const [form, setForm] = useState({ label: '', category: 'Sistema', command: '', description: '', warning: '', email: '' })
  const [message, setMessage] = useState('')
  const [authError, setAuthError] = useState('')
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage(''); setAuthError('')
    try {
      if (!firestore) throw new Error('Firebase no está configurado en este entorno.')
      await addDoc(collection(firestore, 'commandProposals'), { label: form.label.trim(), category: form.category, command: form.command.trim(), description: form.description.trim(), warning: form.warning.trim(), authorEmail: form.email.trim() || null, status: 'pending', createdAt: serverTimestamp() })
      setMessage('Propuesta enviada. Un administrador la revisará antes de publicarla.'); setForm({ ...form, label: '', command: '', description: '', warning: '' })
    } catch (error) {
      const code = error instanceof Error ? error.message : 'Error desconocido'
      setAuthError(code.includes('permission-denied') ? 'Firebase rechazó la propuesta. Verifica que las reglas permitan propuestas pendientes.' : code)
    }
  }
  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-3xl"><Link href="/laboratorio" className="text-sm text-emerald-300">← Volver al laboratorio</Link><h1 className="mt-8 text-4xl font-semibold">Proponer un comando</h1><p className="mt-3 text-slate-400">Las propuestas quedan pendientes hasta que un administrador las revise y apruebe.</p><form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6"><input required placeholder="Nombre del comando" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="rounded-lg bg-slate-950 p-3" /><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-lg bg-slate-950 p-3"><option>Sistema</option><option>Procesos</option><option>Archivos</option><option>Redes</option><option>Seguridad</option><option>Auditoría</option><option>Contenedores</option></select><textarea required placeholder="Comando o plantilla" value={form.command} onChange={e => setForm({ ...form, command: e.target.value })} className="min-h-24 rounded-lg bg-slate-950 p-3 font-mono text-emerald-300" /><textarea required placeholder="Descripción y uso educativo" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="min-h-20 rounded-lg bg-slate-950 p-3" /><textarea required placeholder="Advertencias y restricciones" value={form.warning} onChange={e => setForm({ ...form, warning: e.target.value })} className="min-h-20 rounded-lg bg-slate-950 p-3" /><div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><p className="text-sm font-semibold">Contacto opcional</p><p className="mt-1 text-xs leading-5 text-slate-400">No necesitas crear una cuenta. El administrador revisará cada propuesta antes de publicarla.</p><input type="email" placeholder="Tu email (opcional)" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-3 w-full rounded-lg bg-slate-900 p-3" /></div><button className="rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950">Enviar propuesta</button>{message && <p className="text-sm text-emerald-300">{message}</p>}{authError && <p role="alert" className="text-sm text-amber-300">{authError}</p>}</form></div></main>
}
