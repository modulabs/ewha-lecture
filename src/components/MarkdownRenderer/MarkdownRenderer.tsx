import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Loader2, AlertCircle } from 'lucide-react';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { ContentDetailModal } from '../ContentDetailModal/ContentDetailModal';

interface MarkdownRendererProps {
  filePath: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  filePath, 
  className = '' 
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<{title: string; content: string} | null>(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fullPath = `${import.meta.env.BASE_URL}${filePath.startsWith('/') ? filePath.slice(1) : filePath}`;
        const response = await fetch(fullPath);
        if (!response.ok) {
          throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
        }
        const text = await response.text();
        let processedText = text.replace(/\*\*'([^']+)'\*\*/g, '**$1**');
        
        // details 태그를 커스텀 컴포넌트로 교체
        let detailsIndex = 0;
        processedText = processedText.replace(
          /<details>\s*<summary>(.*?)<\/summary>([\s\S]*?)<\/details>/g,
          (_, title, content) => {
            // HTML 태그를 제거하여 깨끗한 제목을 만들기
            const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
            const cleanContent = content.trim();
            const currentIndex = detailsIndex++;
            return `<div data-details-index="${currentIndex}" data-details-title="${cleanTitle.replace(/"/g, '&quot;')}" data-details-content="${encodeURIComponent(cleanContent)}"></div>`;
          }
        );
        
        setContent(processedText);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      loadMarkdown();
    }
  }, [filePath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading content...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
  };

  return (
    <>
      <div 
        className={`prose max-w-none ${className} focus:outline-none`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
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
          },
          div: ({ children, ...props }: any) => {
            // data-details-* 속성을 가진 div인지 확인
            const detailsTitle = props['data-details-title'];
            const detailsContent = props['data-details-content'];
            
            if (detailsTitle && detailsContent) {
              const decodedContent = decodeURIComponent(detailsContent);
              
              const handleClick = () => {
                setModalContent({
                  title: detailsTitle,
                  content: decodedContent
                });
              };

              return (
                <div 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={handleClick}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-blue-800 flex items-center gap-2">
                      <span className="text-blue-600">📋</span>
                      {detailsTitle}
                    </div>
                    <div className="text-blue-600">
                      <svg className="w-5 h-5 transform transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-blue-600 text-sm mt-2 opacity-80">클릭하여 자세히 보기</p>
                </div>
              );
            }
            
            // 일반 div는 그대로 처리
            return <div {...props}>{children}</div>;
          }
        }}
        >
          {content}
        </ReactMarkdown>
      </div>
      
      {modalContent && (
        <ContentDetailModal
          isOpen={!!modalContent}
          onClose={() => setModalContent(null)}
          title={modalContent.title}
          content={modalContent.content}
        />
      )}
    </>
  );
};