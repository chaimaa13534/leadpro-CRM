/* ═════════════════════════════════════════════════════════════════════
   Settings — ProfileSettingsPage
   Avatar, prénom, nom, email, téléphone, titre, bio, localisation, site.
   ═════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { Camera, Mail, Phone, ShieldAlert, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Input, Modal, Skeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { ROUTES } from '@/lib/constants/routes.constants';

/* ═══════════════════════════════════════════════════════ */
export function ProfileSettingsPage() {
  const { user, refreshProfile, updateProfile, uploadAvatar, deleteAccount } = useAuth();
  const { success, error } = useNotifications();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const profileLoadedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  }));

  useEffect(() => {
    if (profileLoadedRef.current) return;
    profileLoadedRef.current = true;
    let mounted = true;
    refreshProfile().then((profile) => {
      if (mounted) setForm({ firstName: profile.firstName, lastName: profile.lastName, email: profile.email, phone: profile.phone ?? '' });
    }).catch((cause: unknown) => error(cause instanceof Error ? cause.message : 'Impossible de charger le profil.')).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [error, refreshProfile]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault(); setSaving(true);
    try { await updateProfile({ ...form, phone: form.phone || undefined }); success('Profil mis à jour avec succès'); }
    catch (cause) { error(cause instanceof Error ? cause.message : 'Impossible de mettre à jour le profil.'); }
    finally { setSaving(false); }
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    if (!file.type.startsWith('image/')) { error('Veuillez sélectionner un fichier image.'); return; }
    if (file.size > 10 * 1024 * 1024) { error('L’image ne doit pas dépasser 10 Mo.'); return; }
    setUploading(true);
    try { await uploadAvatar(file); success('Photo de profil mise à jour.'); }
    catch (cause) { error(cause instanceof Error ? cause.message : 'Impossible de mettre à jour la photo.'); }
    finally { setUploading(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try { await deleteAccount(); success('Votre compte a été supprimé.'); navigate(ROUTES.LOGIN, { replace: true }); }
    catch (cause) { error(cause instanceof Error ? cause.message : 'Impossible de supprimer votre compte.'); setDeleting(false); }
  }

  if (loading || !user) return <div className="space-y-5"><Skeleton className="h-16 w-80" /><Skeleton className="h-[420px] w-full rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <header><p className="text-sm font-medium text-accent">Settings</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">Gestion de votre profil personnel</h1><p className="mt-2 text-sm text-text-secondary">Mettez à jour vos informations .</p></header>
      <Card className="p-5 sm:p-7"><div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center"><Avatar firstName={user.firstName} lastName={user.lastName} src={user.avatarUrl} size="xl" className="h-20 w-20 text-xl" /><div className="min-w-0 flex-1"><h2 className="font-semibold text-text-primary">Profile</h2></div><input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} /></div><form className="space-y-5" onSubmit={handleSave}><div className="grid gap-5 sm:grid-cols-2"><Input label="Prénom" required value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} /><Input label="Nom" required value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} /></div><Input label="Email" type="email" required leftIcon={<Mail className="size-4" />} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><Input label="Téléphone" type="tel" leftIcon={<Phone className="size-4" />} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /><div className="rounded-lg border border-border bg-muted/40 px-4 py-3"><p className="text-xs font-medium text-text-secondary">Rôle</p><p className="mt-1 flex items-center gap-2 text-sm font-medium text-text-primary"><UserRound className="size-4 text-text-tertiary" />{user.role === 'sales_rep' ? 'Sales' : user.role === 'viewer' ? 'Support' : user.role}</p><p className="mt-1 text-xs text-text-tertiary">Ce rôle est géré par votre administrateur.</p></div><div className="flex justify-end pt-1"><Button type="submit" loading={saving}>Enregistrer les modifications</Button></div></form></Card>
      <Card className="border-danger-500/30 p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 gap-3"><ShieldAlert className="mt-0.5 size-5 shrink-0 text-danger-500" /><div><h2 className="font-semibold text-text-primary">Danger Zone</h2><p className="mt-1 text-sm leading-6 text-text-secondary">La suppression de votre compte est une action importante et peut être irréversible.</p></div></div><Button type="button" variant="danger" onClick={() => setConfirmOpen(true)}>Supprimer mon compte</Button></div></Card>
      <Modal open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)} title="Supprimer votre compte ?" description="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne peut pas être annulée."><div className="flex justify-end gap-3 pt-2"><Button variant="secondary" onClick={() => setConfirmOpen(false)} disabled={deleting}>Annuler</Button><Button variant="danger" loading={deleting} onClick={handleDelete}>Supprimer définitivement</Button></div></Modal>
    </div>
  );
}

export default ProfileSettingsPage;
