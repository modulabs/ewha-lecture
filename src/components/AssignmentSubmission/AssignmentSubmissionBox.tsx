import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import type { AssignmentTemplate, AssignmentSubmission } from '../../services/assignmentApi';
import { assignmentApi } from '../../services/assignmentApi';

interface AssignmentSubmissionBoxProps {
  dayId: string;
  dayTitle: string;
  assignmentDate?: string;
}

export const AssignmentSubmissionBox: React.FC<AssignmentSubmissionBoxProps> = ({
  assignmentDate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState<AssignmentTemplate | null>(null);
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // 과제 템플릿과 제출 현황 로드
  useEffect(() => {
    const loadData = async () => {
      if (!assignmentDate) return;
      
      try {
        setLoadingData(true);
        setError(null);

        // 해당 날짜의 과제 템플릿 조회
        const templatesResponse = await assignmentApi.getTemplates(assignmentDate);
        if (templatesResponse.success && templatesResponse.data.length > 0) {
          setTemplate(templatesResponse.data[0]); // 첫 번째 템플릿 사용
          
          // 내 제출 현황 조회
          const submissionsResponse = await assignmentApi.getMySubmissions(assignmentDate);
          if (submissionsResponse.success && submissionsResponse.data.length > 0) {
            const mySubmission = submissionsResponse.data[0];
            setSubmission(mySubmission);
            setSubmissionText(mySubmission.submission_text);
          }
        }
      } catch (err) {
        console.error('Failed to load assignment data:', err);
        setError(err instanceof Error ? err.message : '데이터 로드에 실패했습니다.');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [assignmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() || !template) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await assignmentApi.submit(template.id, submissionText.trim());
      if (result.success) {
        setSubmission(result.data);
        setIsExpanded(false);
      }
    } catch (err) {
      console.error('Assignment submission failed:', err);
      setError(err instanceof Error ? err.message : '과제 제출에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSubmissionText(submission?.submission_text || '');
    setIsExpanded(false);
    setError(null);
  };

  // 로딩 중이거나 템플릿이 없으면 표시하지 않음
  if (loadingData) {
    return (
      <div className="border border-gray-200 rounded-lg bg-gray-50 p-3">
        <div className="flex items-center space-x-2">
          <Loader2 size={16} className="text-blue-600 animate-spin" />
          <span className="text-sm text-gray-600">과제 정보 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!template) {
    return null; // 과제가 없으면 렌더링하지 않음
  }

  const isSubmitted = !!submission;
  const isReviewed = submission?.status === 'reviewed';

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Upload size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {template.title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {isSubmitted && (
            <div className={`flex items-center space-x-1 ${isReviewed ? 'text-green-600' : 'text-blue-600'}`}>
              <Check size={14} />
              <span className="text-xs">
                {isReviewed ? '검토완료' : '제출완료'}
              </span>
            </div>
          )}
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-3 space-y-3">
          {/* Assignment Description */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-1">과제 설명</h4>
            <p className="text-sm text-blue-800">{template.description}</p>
          </div>

          {/* Current Submission */}
          {isSubmitted && submission && (
            <div className={`border rounded p-3 ${
              isReviewed ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileText size={14} className={isReviewed ? "text-green-600" : "text-blue-600"} />
                  <span className="text-sm font-medium">
                    {isReviewed ? "검토 완료된 과제" : "제출된 과제"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(submission.submitted_at).toLocaleString()}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 bg-white rounded p-2 mb-2">
                {submission.submission_text}
              </div>

              {isReviewed && submission.feedback && (
                <div className="bg-green-100 rounded p-2">
                  <div className="text-sm font-medium text-green-800 mb-1">강사 피드백</div>
                  <div className="text-sm text-green-700">{submission.feedback}</div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <div className="flex items-center space-x-2">
                <AlertCircle size={14} className="text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                과제 내용
              </label>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Google Drive에 업로드하여 hc.cho@modulabs.co.kr 에 권한을 공유한 후 제출해주세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!submissionText.trim() || isLoading}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>제출중...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>{isSubmitted ? '수정' : '제출'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Instructions */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• 과제 파일을 Google Drive에 업로드하고 <strong>hc.cho@modulabs.co.kr</strong>에 권한을 공유해주세요.</p>
            <p>• 공유된 Google Drive 링크를 위 텍스트 박스에 입력하여 제출하세요.</p>
            <p>• 과제 내용과 실행 방법을 README 파일에 명확히 작성해주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
};