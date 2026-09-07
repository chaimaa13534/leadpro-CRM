/* ═════════════════════════════════════════════════════════════════════
   Settings — BillingHistory
   Historique de facturation (desktop → table, mobile → cartes).
   ═════════════════════════════════════════════════════════════════════ */

import { Download, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Invoice } from '@/features/settings/types';

interface BillingHistoryProps {
  invoices: Invoice[];
  onDownload: (invoice: Invoice) => void;
}

const STATUS_VARIANTS: Record<Invoice['status'], 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
};

/* ═══════════════════════════════════════════════════════ */
export function BillingHistory({
  invoices,
  onDownload,
}: BillingHistoryProps) {
  return (
    <SettingsSection
      title="Billing history"
      description="Toutes vos factures précédentes."
    >
      <SettingsCard className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-text-tertiary" />
                    <span className="font-medium text-text-primary">
                      {invoice.number}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell className="font-medium text-text-primary">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[invoice.status]} dot>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(invoice)}
                    leadingIcon={<Download className="h-3.5 w-3.5" />}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingsCard>

      <div className="flex flex-col gap-3 md:hidden">
        {invoices.map((invoice) => (
          <SettingsCard key={invoice.id}>
            <div className="flex items-start justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-text-primary">
                    {invoice.number}
                  </p>
                  <Badge variant={STATUS_VARIANTS[invoice.status]} dot>
                    {invoice.status}
                  </Badge>
                </div>
                <p className="mt-0.5 text-[12px] text-text-tertiary">
                  {formatDate(invoice.date)}
                </p>
                <p className="mt-1 text-[13px] font-medium text-text-primary">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDownload(invoice)}
                aria-label={`Télécharger ${invoice.number}`}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </SettingsCard>
        ))}
      </div>
    </SettingsSection>
  );
}

export default BillingHistory;

