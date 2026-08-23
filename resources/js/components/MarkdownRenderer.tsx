import { marked } from 'marked';
import { useMemo } from 'react';

interface Props {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: Props) {
    const html = useMemo(() => {
        if (!content) {
return '';
}

        try {
            return marked.parse(content, {
                breaks: true,
                gfm: true,
            }) as string;
        } catch {
            return content;
        }
    }, [content]);

    return (
        <div
            className={`markdown-content prose prose-slate max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
