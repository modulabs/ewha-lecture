import React from 'react';
import { Users, FileText, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { AdminStatsCard } from '../shared/AdminStatsCard';
import { AdminTable } from '../shared/AdminTable';
import { StatusBadge } from '../shared/StatusBadge';
import { ContentLockControl } from '../ContentLock/ContentLockControl';
import type { AdminStats, RecentActivity, Submission, AdminTableColumn } from '../../../types/admin';

// Mock data - 실제로는 API에서 가져올 데이터
const mockStats: AdminStats = {
  studentsTotal: 120,
  studentsRegistered: 85,
  studentsActiveToday: 42,
  assignmentsPending: 25,
  assignmentsTotal: 15,
  avgScore: 82.5,
  completionRate: 67.5
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'assignment_submitted',
    title: 'Day 1 최종 과제 제출',
    studentName: '김이화',
    assignmentTitle: 'AI 에이전트 개념 정리',
    timestamp: '2025-01-17T10:30:00Z'
  },
  {
    id: '2',
    type: 'student_registered',
    title: '신규 학생 가입',
    studentName: '박학생',
    timestamp: '2025-01-17T09:15:00Z'
  },
  {
    id: '3',
    type: 'assignment_reviewed',
    title: '과제 검토 완료',
    studentName: '이수연',
    assignmentTitle: 'Streamlit 배포 실습',
    timestamp: '2025-01-17T08:45:00Z'
  }
];

const mockRecentSubmissions: Submission[] = [
  {
    id: '1',
    assignmentId: 'assignment-1',
    assignment: {
      id: 'assignment-1',
      title: 'Day 1 최종 과제: AI 에이전트 개념 정리',
      dueDate: '2025-01-20T23:59:59Z'
    },
    student: {
      id: 'student-1',
      name: '김이화',
      email: 'student1@ewha.ac.kr',
      studentId: '2024123456',
      cohort: '2024-08'
    },
    fileName: 'day1_assignment.pdf',
    fileUrl: '/uploads/assignments/day1_assignment.pdf',
    fileSizeBytes: 1024000,
    comments: '과제 제출합니다. 피드백 부탁드립니다.',
    submittedAt: '2025-01-17T10:30:00Z',
    reviewStatus: 'pending'
  },
  {
    id: '2',
    assignmentId: 'assignment-2',
    assignment: {
      id: 'assignment-2',
      title: 'Day 2 중간 과제: RAG 시스템 구현',
      dueDate: '2025-01-21T23:59:59Z'
    },
    student: {
      id: 'student-2',
      name: '박학생',
      email: 'student2@ewha.ac.kr',
      studentId: '2024123457',
      cohort: '2024-08'
    },
    fileName: 'rag_implementation.zip',
    fileUrl: '/uploads/assignments/rag_implementation.zip',
    fileSizeBytes: 5120000,
    submittedAt: '2025-01-17T09:15:00Z',
    reviewStatus: 'approved',
    score: 95,
    feedback: '훌륭한 구현입니다!'
  }
];

export const AdminDashboard: React.FC = () => {
  const submissionColumns: AdminTableColumn<Submission>[] = [
    {
      key: 'student',
      title: '학생',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.student.name}</div>
          <div className="text-sm text-gray-500">{record.student.studentId}</div>
        </div>
      )
    },
    {
      key: 'assignment',
      title: '과제',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.assignment.title}</div>
          <div className="text-sm text-gray-500">
            마감: {new Date(record.assignment.dueDate).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      key: 'fileName',
      title: '파일',
      render: (fileName) => (
        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {fileName}
        </span>
      )
    },
    {
      key: 'submittedAt',
      title: '제출시간',
      render: (submittedAt) => (
        <span className="text-sm">
          {new Date(submittedAt).toLocaleString()}
        </span>
      )
    },
    {
      key: 'reviewStatus',
      title: '상태',
      render: (status) => <StatusBadge status={status} size="sm" />
    },
    {
      key: 'score',
      title: '점수',
      render: (score) => score ? `${score}점` : '-'
    }
  ];

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}시간 전`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="ml-3">
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-amber-700">
              이화여자대학교 AI 에이전트 개발 과정 관리 시스템
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="총 학생 수"
          value={mockStats.studentsTotal}
          subtitle={`가입 완료: ${mockStats.studentsRegistered}명`}
          icon={Users}
          color="blue"
        />
        <AdminStatsCard
          title="오늘 활동"
          value={mockStats.studentsActiveToday}
          subtitle="명이 학습 중"
          icon={TrendingUp}
          color="green"
        />
        <AdminStatsCard
          title="검토 대기"
          value={mockStats.assignmentsPending}
          subtitle="건의 과제"
          icon={Clock}
          color="amber"
        />
        <AdminStatsCard
          title="평균 점수"
          value={`${mockStats.avgScore}점`}
          subtitle={`완료율: ${mockStats.completionRate}%`}
          icon={CheckCircle}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">실시간 활동</h3>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'assignment_submitted' && (
                      <FileText size={16} className="text-blue-600 mt-1" />
                    )}
                    {activity.type === 'student_registered' && (
                      <Users size={16} className="text-green-600 mt-1" />
                    )}
                    {activity.type === 'assignment_reviewed' && (
                      <CheckCircle size={16} className="text-amber-600 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.studentName}
                    </p>
                    <p className="text-sm text-gray-600">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatActivityTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Tasks */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">급한 작업</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle size={16} className="text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">검토 대기 {mockStats.assignmentsPending}건</p>
                  <p className="text-xs text-red-700">빠른 검토가 필요합니다</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                <Clock size={16} className="text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-900">마감 임박 과제</p>
                  <p className="text-xs text-amber-700">3건의 과제가 내일 마감</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">최근 제출 과제</h3>
            </div>
            <AdminTable
              data={mockRecentSubmissions}
              columns={submissionColumns}
              actions={[
                {
                  key: 'review',
                  label: '검토',
                  variant: 'primary',
                  onClick: (record) => console.log('Review:', record.id)
                },
                {
                  key: 'download',
                  label: '다운로드',
                  onClick: (record) => console.log('Download:', record.fileUrl)
                }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Content Lock Control */}
      <ContentLockControl />
    </div>
  );
};