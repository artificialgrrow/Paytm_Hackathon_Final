import React from 'react';

/**
 * FormattedMessage Component
 * Parses markdown-like text (bold **text**, bullets, paragraphs) into clean, elegant HTML
 * Ensures no raw asterisks (*) or unformatted tags are ever displayed.
 */
export const FormattedMessage = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by newlines
  const lines = text.split('\n');

  // Helper to parse bold **text** within a line
  const parseInlineFormatting = (str) => {
    // Regex matches **bold text**
    const parts = str.split(/(\*\*[^*]+?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        const content = part.slice(2, -2);
        const isAction = content.toLowerCase().includes('action');
        const isResolve = content.toLowerCase().includes('resolve');

        return (
          <strong 
            key={index} 
            className={`font-black ${
              isAction ? 'text-[#0052ff]' : isResolve ? 'text-emerald-700' : 'text-slate-900'
            }`}
          >
            {content}
          </strong>
        );
      }
      // Also clean up any accidental single stray asterisks
      return part.replace(/\*/g, '');
    });
  };

  return (
    <div className={`space-y-2 text-sm sm:text-base text-slate-800 leading-relaxed font-normal ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Check if line is a bullet or mode highlight
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : trimmed;

        if (isBullet) {
          const isAction = cleanLine.toLowerCase().includes('action');
          const isResolve = cleanLine.toLowerCase().includes('resolve');

          return (
            <div key={idx} className="flex items-start gap-2.5 my-1 pl-1">
              <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                isAction ? 'bg-[#0052ff]' : isResolve ? 'bg-emerald-600' : 'bg-slate-400'
              }`} />
              <div className="flex-1">
                {parseInlineFormatting(cleanLine)}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export default FormattedMessage;
