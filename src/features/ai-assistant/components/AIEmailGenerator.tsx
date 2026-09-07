import { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { AIEmailDraft } from '../types/ai.types';

interface AIEmailGeneratorProps {
  drafts: AIEmailDraft[];
  className?: string;
}

export function AIEmailGenerator({ drafts, className }: AIEmailGeneratorProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = searchTerm
    ? drafts.filter(
        (d) =>
          d.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : drafts;

  const handleCopy = async (draft: AIEmailDraft) => {
    const content = `Subject: ${draft.subject}\n\n${draft.body}`;
    await navigator.clipboard.writeText(content);
    setCopiedId(draft.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-accent" />
          <h3 className="text-[15px] font-semibold text-text-primary">Email Drafts</h3>
        </div>
        <Input
          placeholder="Search drafts…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[200px]"
        />
      </div>

      <div className="grid gap-3">
        {filtered.map((draft) => (
          <Card key={draft.id} variant="outlined" padding="md">
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-[13px] font-semibold text-text-primary mb-1">{draft.subject}</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] text-text-tertiary">To: {draft.contactName}</span>
                    <Badge variant="primary" size="sm">{draft.purpose.replace('_', ' ')}</Badge>
                    <Badge variant="neutral" size="sm">{draft.tone}</Badge>
                    <Badge variant="info" size="sm">{draft.language}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(draft)}
                  leadingIcon={copiedId === draft.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                >
                  {copiedId === draft.id ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <pre className="whitespace-pre-wrap text-[12px] text-text-secondary leading-relaxed bg-background-tertiary rounded-lg p-3 font-sans">
                {draft.body}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
