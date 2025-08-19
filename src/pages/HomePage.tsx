import React from 'react';
import { MarkdownRenderer } from '../components/MarkdownRenderer/MarkdownRenderer';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          💻이화 스타트업 ABC Frontier Class
        </h1>
        <p className="text-gray-600 mb-6">
          최신 AI 기술을 활용하여 직접 아이디어를 현실화하고, 자동화된 워크플로우를 구축하는 3일간의 집중 과정입니다.
        </p>
      </div>

      {/* 시간표 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">강의 시간표</h2>
        <div className="w-full">
          <iframe 
            src="https://modulabs.github.io/lecture-timetable/ewha"
            className="w-full h-[600px] md:h-[700px] lg:h-[800px] border-0 rounded-lg"
            title="이화여대 AI 과정 시간표"
            loading="lazy"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <MarkdownRenderer filePath="/lecture_plan.md" />
      </div>
    </div>
  );
};