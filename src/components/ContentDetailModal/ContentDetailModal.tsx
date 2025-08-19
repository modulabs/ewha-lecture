import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { X } from 'lucide-react';
import { CodeBlock } from '../CodeBlock/CodeBlock';

interface ContentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  content
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10); // 약간의 지연으로 애니메이션 시작
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 200); // 애니메이션 완료 후 unmount
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  // 외부 클릭 시 모달 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-200"
      style={{
        backgroundColor: isAnimating ? 'rgba(17, 24, 39, 0.3)' : 'rgba(17, 24, 39, 0)'
      }}
      onClick={handleOverlayClick}
    >
      <div className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-200 ${
        isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div 
            className="prose max-w-none focus:outline-none"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => {
              // Ctrl+A (또는 Cmd+A on Mac)가 눌렸을 때 현재 마크다운 영역만 선택
              if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                e.stopPropagation();
                
                const selection = window.getSelection();
                const range = document.createRange();
                const markdownContainer = e.currentTarget;
                
                range.selectNodeContents(markdownContainer);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code: ({className, children, ...props}: any) => {
                  const inline = !className;
                  const match = /language-(\w+)/.exec(className || '')
                  if (!inline && match) {
                    return (
                      <CodeBlock
                        language={match[1]}
                      >
                        {String(children).replace(/\n$/, '')}
                      </CodeBlock>
                    )
                  }
                  return (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                },
                a: ({ href, children, ...props }: any) => {
                  // 외부 링크는 새 탭에서 열기
                  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  }
                  // 내부 링크는 그대로
                  return <a href={href} {...props}>{children}</a>;
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};