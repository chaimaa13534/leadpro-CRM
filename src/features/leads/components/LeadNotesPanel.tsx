import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icons } from '@/components/ui/icons';
import { getNotesForLead } from '@/features/leads/mocks/notes.mock';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/getInitials';
import { formatDate } from '@/utils/formatDate';
import { generateId } from '@/utils/generateId';
import type { Lead } from '@/types/lead.types';
import type { LeadNote } from '@/features/leads/types';

export interface LeadNotesPanelProps {
  lead: Lead;
}

/**
 * Widget Notes. "Ajouter une note" est simulé au sens du brief (aucun
 * appel réseau), mais reste pleinement interactif : la note est ajoutée
 * à l'état local du composant (pas persistée — elle disparaît au
 * rechargement), pour une expérience réaliste plutôt qu'un bouton inerte.
 */
export function LeadNotesPanel({ lead }: LeadNotesPanelProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<LeadNote[]>(() => getNotesForLead(lead));
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');

  function handleAddNote() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const newNote: LeadNote = {
      id: generateId(),
      leadId: lead.id,
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Vous',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setDraft('');
    setIsAdding(false);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Notes</CardTitle>
          <CardDescription>{notes.length} notes</CardDescription>
        </div>
        {!isAdding ? (
          <Button
            size="sm"
            variant="outline"
            leadingIcon={<Icons.add className="size-4" />}
            onClick={() => setIsAdding(true)}
          >
            Ajouter une note
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col gap-2"
          >
            <Textarea
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Écrire une note..."
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setDraft('');
                }}
              >
                Annuler
              </Button>
              <Button size="sm" onClick={handleAddNote}>
                Enregistrer
              </Button>
            </div>
          </motion.div>
        ) : null}

        {notes.length === 0 && !isAdding ? (
          <EmptyState
            icon={<Icons.note className="size-6" aria-hidden="true" />}
            title="Aucune note"
            description="Ajoutez une première note pour ce lead."
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {notes.map((note, index) => (
              <motion.li
                key={note.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.15,
                  delay: Math.min(index * 0.03, 0.3),
                }}
                className="flex gap-3"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-caption font-semibold text-text-secondary">
                  {getInitials(note.authorName)}
                </span>
                <div className="flex-1 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-body font-medium text-text-primary">
                      {note.authorName}
                    </p>
                    <p className="text-caption text-text-secondary">
                      {formatDate(note.createdAt, 'datetime')}
                    </p>
                  </div>
                  <p className="mt-1 text-body text-text-secondary">
                    {note.content}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
