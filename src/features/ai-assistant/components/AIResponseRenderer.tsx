import { cn } from '@/lib/cn';

interface AIResponseRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown-like content as formatted HTML.
 * Supports: headings, bold, italic, lists, tables, blockquotes, code, links.
 */
export function AIResponseRenderer({ content, className }: AIResponseRendererProps) {
  const html = content
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-background-tertiary rounded-lg p-4 overflow-x-auto text-[13px] font-mono my-3"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-background-tertiary px-1.5 py-0.5 rounded text-[12px] font-mono">$1</code>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Tables
    .replace(/\|(.+)\|/g, (match) => {
      if (match.includes('---')) return '<hr class="border-border my-2" />';
      const cells = match.split('|').filter(Boolean).map((c) => c.trim());
      return `<tr>${cells.map((c) => `<td class="px-3 py-1.5 text-[13px]">${c}</td>`).join('')}</tr>`;
    })
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-accent pl-4 py-1 my-2 text-[13px] text-text-secondary italic">$1</blockquote>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-[15px] font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-[17px] font-semibold mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-[20px] font-semibold mt-5 mb-3">$1</h1>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="text-[13px] ml-4 list-disc">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, '<br/>');

  return (
    <div
      className={cn('prose prose-sm max-w-none text-[13px] leading-relaxed text-text-primary', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
