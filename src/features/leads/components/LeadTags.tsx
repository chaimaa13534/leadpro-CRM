import { Badge } from '@/components/ui/Badge';

export interface LeadTagsProps {
  tags: string[];
}

/**
 * Affiche les tags d'un lead (VIP, Hot Lead, Enterprise…) avec les
 * composants du Design System (`Badge`, sans pastille — un tag n'a pas
 * de statut coloré, juste une étiquette neutre).
 */
export function LeadTags({ tags }: LeadTagsProps) {
  if (tags.length === 0) {
    return <p className="text-caption text-text-secondary">Aucun tag.</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag} variant="neutral" dot={false}>
          {tag}
        </Badge>
      ))}
    </div>
  );
}
