'use client'

import Link from 'next/link'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useState } from 'react'
import { firebaseAuth, firestore } from '@/lib/firebase'

export default function ProponerComandoPage() {
  const [form, setForm] = useState({ label: '', category: 'Sistema', command: '', description: '', warning: '', email: '', password: '' })
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null)
  const [message, setMessage] = useState('')
  const [authError, setAuthError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const authReady = Boolean(firebaseAuth && firestore)
  const authenticate = async () => {
    if (!firebaseAuth) throw new Error('Firebase no está configurado en este entorno.')
    const credential = isCreating ? await createUserWithEmailAndPassword(firebaseAuth, form.email.trim(), form.password) : await signInWithEmailAndPassword(firebaseAuth, form.email.trim(), form.password)
    setUser({ uid: credential.user.uid, email: credential.user.email })
    return credential.user
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage(''); setAuthError('')
    try {
      if (!firestore) throw new Error('Firebase no está configurado en este entorno.')
      const credential = user ?? await authenticate()
      await addDoc(collection(firestore, 'commandProposals'), { label: form.label.trim(), category: form.category, command: form.command.trim(), description: form.description.trim(), warning: form.warning.trim(), authorId: credential.uid, authorEmail: credential.email, status: 'pending', createdAt: serverTimestamp() })
      setMessage('Propuesta enviada para revisión administrativa.'); setForm({ ...form, label: '', command: '', description: '', warning: '' })
    } catch (error) {
      const code = error instanceof Error ? error.message : 'Error desconocido'
      setAuthError(code.includes('auth/invalid-credential') || code.includes('auth/wrong-password') ? 'Email o contraseña incorrectos.' : code.includes('auth/email-already-in-use') ? 'La cuenta ya existe. Desactiva “Crear cuenta” e inicia sesión.' : code.includes('auth/operation-not-allowed') ? 'Firebase no tiene habilitado Email/Password Authentication.' : code.includes('permission-denied') ? 'Tu cuenta inició sesión, pero Firestore rechazó la propuesta. Revisa sus reglas.' : code)
    }
  }
  const logout = async () => { if (firebaseAuth) await signOut(firebaseAuth); setUser(null) }
  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white"><div className="mx-auto max-w-3xl"><Link href="/laboratorio" className="text-sm text-emerald-300">← Volver al laboratorio</Link><h1 className="mt-8 text-4xl font-semibold">Proponer un comando</h1><p className="mt-3 text-slate-400">Las propuestas quedan pendientes hasta que un administrador las revise y apruebe.</p><form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6"><input required placeholder="Nombre del comando" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="rounded-lg bg-slate-950 p-3" /><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-lg bg-slate-950 p-3"><option>Sistema</option><option>Procesos</option><option>Archivos</option><option>Redes</option><option>Seguridad</option><option>Auditoría</option><option>Contenedores</option></select><textarea required placeholder="Comando o plantilla" value={form.command} onChange={e => setForm({ ...form, command: e.target.value })} className="min-h-24 rounded-lg bg-slate-950 p-3 font-mono text-emerald-300" /><textarea required placeholder="Descripción y uso educativo" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="min-h-20 rounded-lg bg-slate-950 p-3" /><textarea required placeholder="Advertencias y restricciones" value={form.warning} onChange={e => setForm({ ...form, warning: e.target.value })} className="min-h-20 rounded-lg bg-slate-950 p-3" /><div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><p className="text-sm font-semibold">{user ? `Sesión iniciada: ${user.email}` : isCreating ? 'Crear cuenta de colaborador' : 'Iniciar sesión para proponer'}</p><p className="mt-1 text-xs leading-5 text-slate-400">Firebase identifica quién envía cada propuesta. Las propuestas no se publican automáticamente: requieren aprobación administrativa.</p>{!user && <div className="mt-3 grid gap-3 sm:grid-cols-2"><input required type="email" placeholder="Email de Firebase" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-lg bg-slate-900 p-3" /><input required type="password" minLength={6} placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="rounded-lg bg-slate-900 p-3" /></div>}{user && <button type="button" onClick={logout} className="mt-3 text-xs text-slate-400 underline">Cerrar sesión</button>} {!user && <button type="button" onClick={() => setIsCreating(!isCreating)} className="mt-3 text-xs text-emerald-300 underline">{isCreating ? 'Ya tengo una cuenta' : 'Crear una cuenta nueva'}</button>}</div><button disabled={!authReady} className="rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">Enviar propuesta</button>{message && <p className="text-sm text-emerald-300">{message}</p>}{authError && <p role="alert" className="text-sm text-amber-300">{authError}</p>}</form></div></main>
}
