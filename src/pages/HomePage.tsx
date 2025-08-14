import React from 'react';
import { MarkdownRenderer } from '../components/MarkdownRenderer/MarkdownRenderer';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          이화여자대학교 AI 에이전트 개발 과정
        </h1>
        <p className="text-gray-600 mb-6">
          최신 AI 기술을 활용하여 직접 아이디어를 현실화하고, 자동화된 워크플로우를 구축하는 3일간의 집중 과정입니다.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <MarkdownRenderer filePath="/lecture_plan.md" />
      </div>
    </div>
  );
};