import { Badge } from '@/components/ui/Badge';

export interface OpportunityTagsProps {
  tags?: string[];
}

export function OpportunityTags({ tags }: OpportunityTagsProps) {
  if (!tags || tags.length === 0) {
    return <span className="text-caption text-text-secondary/60">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag} variant="neutral" size="sm">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

