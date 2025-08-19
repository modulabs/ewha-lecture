import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  children: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  language = 'text',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const customTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: '#1e293b',
      border: 'none',
      borderRadius: '0.75rem',
      padding: '1rem',
      fontSize: '0.875rem',
      lineHeight: '1.5rem',
    },
    'code[class*="language-"]': {
        ...oneDark['code[class*="language-"]'],
        fontFamily: 'inherit'
    }
  };

  return (
    <div className="relative group mb-6 not-prose">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 rounded-md transition-all duration-200 text-sm opacity-0 group-hover:opacity-100"
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={customTheme}
        showLineNumbers={false}
        wrapLines={false}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};