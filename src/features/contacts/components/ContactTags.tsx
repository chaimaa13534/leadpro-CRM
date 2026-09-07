import { Badge } from '@/components/ui/Badge';

export interface ContactTagsProps {
  tags?: string[];
}

export function ContactTags({ tags }: ContactTagsProps) {
  if (!tags || tags.length === 0) {
    return (
      <p className="text-caption text-text-secondary/60">
        Aucun tag associé à ce contact.
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

