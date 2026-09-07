/**
 * Groupe d'avatars empilés pour le Pipeline Kanban.
 * Affiche l'avatar du commercial ou d'un contact.
 */
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/cn';

interface PipelineAvatarGroupProps {
  /** Nom de la personne (peut être "Prénom Nom" ou juste le nom). */
  name: string;
  /** URL de l'avatar optionnelle. */
  src?: string;
  size?: 'xs' | 'sm';
  className?: string;
}

export function PipelineAvatarGroup({ name, src, size = 'sm', className }: PipelineAvatarGroupProps) {
  const parts = name.split(' ');
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Avatar
        firstName={parts[0]}
        lastName={parts.slice(1).join(' ')}
        src={src}
        size={size}
      />
      <span className="text-[12px] font-medium text-text-secondary truncate max-w-[100px]">
        {name}
      </span>
    </div>
  );
}

