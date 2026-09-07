import { Badge } from '@/components/ui/Badge';

export interface CompanyTagsProps {
  tags?: string[];
}

export function CompanyTags({ tags }: CompanyTagsProps) {
  if (!tags || tags.length === 0) {
    return (
      <p className="text-caption text-text-secondary/60">
        Aucun tag associé à cette entreprise.
      </p>
    );
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

