import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icons } from '@/components/ui/icons';
import { useNotifications } from '@/hooks/useNotifications';
import { getDocumentsForLead } from '@/features/leads/mocks/documents.mock';
import { formatDate } from '@/utils/formatDate';
import type { Lead } from '@/types/lead.types';

export interface LeadDocumentsProps {
  lead: Lead;
}

function formatFileSize(sizeKb: number): string {
  if (sizeKb < 1000) return `${sizeKb} Ko`;
  return `${(sizeKb / 1000).toFixed(1)} Mo`;
}

/** Onglet "Documents" : fichiers associés au lead — simulation, aucun vrai fichier. */
export function LeadDocuments({ lead }: LeadDocumentsProps) {
  const documents = getDocumentsForLead(lead);
  const { info } = useNotifications();

  if (documents.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Icons.note className="size-6" aria-hidden="true" />}
          title="Aucun document"
          description="Les documents partagés avec ce lead apparaîtront ici."
        />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>{documents.length} fichiers</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1">
          {documents.map((document, index) => (
            <motion.li
              key={document.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.15,
                delay: Math.min(index * 0.04, 0.3),
              }}
              className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-150 hover:bg-muted"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400">
                <Icons.note className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body text-text-primary">
                  {document.fileName}
                </p>
                <p className="text-caption text-text-secondary">
                  {formatFileSize(document.fileSizeKb)} · Ajouté par{' '}
                  {document.uploadedBy} le{' '}
                  {formatDate(document.uploadedAt, 'short')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Télécharger ${document.fileName}`}
                onClick={() =>
                  info('Le téléchargement de documents arrive bientôt.')
                }
              >
                <Icons.export className="size-4" aria-hidden="true" />
              </Button>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
