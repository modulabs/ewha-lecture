import React, { useState } from 'react';
import { Upload, Search, UserPlus } from 'lucide-react';
import { AdminTable } from '../shared/AdminTable';
import { StatusBadge } from '../shared/StatusBadge';
import { AdminStatsCard } from '../shared/AdminStatsCard';
import type { Student, AdminTableColumn, PaginationData, UploadResult } from '../../../types/admin';

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    name: '김이화',
    email: 'student1@ewha.ac.kr',
    studentId: '2024123456',
    department: '컴퓨터공학과',
    cohort: '2024-08',
    status: 'registered',
    uploadedAt: '2025-01-01T00:00:00Z',
    registeredAt: '2025-01-02T10:30:00Z',
    uploadedByName: '관리자',
    totalLearningTime: 480,
    completedItems: 8
  },
  {
    id: '2',
    name: '박학생',
    email: 'student2@ewha.ac.kr',
    studentId: '2024123457',
    department: 'AI학과',
    cohort: '2024-08',
    status: 'pending',
    uploadedAt: '2025-01-15T00:00:00Z',
    uploadedByName: '관리자',
    totalLearningTime: 0,
    completedItems: 0
  },
  {
    id: '3',
    name: '이수연',
    email: 'student3@ewha.ac.kr',
    studentId: '2024123458',
    department: '데이터사이언스과',
    cohort: '2024-08',
    status: 'blocked',
    uploadedAt: '2025-01-01T00:00:00Z',
    registeredAt: '2025-01-03T14:20:00Z',
    uploadedByName: '관리자',
    notes: '부적절한 행동으로 인한 차단',
    totalLearningTime: 120,
    completedItems: 2
  }
];

const mockPagination: PaginationData = {
  currentPage: 1,
  totalPages: 3,
  totalCount: 120,
  limit: 50
};

export const StudentManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const studentColumns: AdminTableColumn<Student>[] = [
    {
      key: 'name',
      title: '이름',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      )
    },
    {
      key: 'studentId',
      title: '학번',
      width: '120px'
    },
    {
      key: 'department',
      title: '학과',
      width: '150px'
    },
    {
      key: 'cohort',
      title: '기수',
      width: '100px'
    },
    {
      key: 'status',
      title: '상태',
      render: (status) => <StatusBadge status={status} size="sm" />,
      width: '100px'
    },
    {
      key: 'registeredAt',
      title: '가입일',
      render: (registeredAt) => 
        registeredAt ? new Date(registeredAt).toLocaleDateString() : '-',
      width: '120px'
    },
    {
      key: 'completedItems',
      title: '진행도',
      render: (completedItems, _record) => (
        <div>
          <div className="text-sm font-medium">{completedItems}/15</div>
          <div className="text-xs text-gray-500">
            {Math.round((completedItems / 15) * 100)}%
          </div>
        </div>
      ),
      width: '100px'
    }
  ];

  const handleStatusChange = (student: Student, newStatus: Student['status']) => {
    console.log(`Changing status of ${student.name} to ${newStatus}`);
    // 실제로는 API 호출
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 실제로는 FormData로 API에 업로드
    console.log('Uploading file:', file.name);
    
    // Mock upload result
    const mockResult: UploadResult = {
      totalRows: 30,
      successfulImports: 28,
      skippedDuplicates: 2,
      errors: 0,
      cohort: '2024-08'
    };
    
    alert(`업로드 완료!\n성공: ${mockResult.successfulImports}건\n중복: ${mockResult.skippedDuplicates}건`);
    setShowUploadModal(false);
  };

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.includes(searchQuery) || 
                         student.email.includes(searchQuery) ||
                         student.studentId.includes(searchQuery);
    const matchesCohort = selectedCohort === 'all' || student.cohort === selectedCohort;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesCohort && matchesStatus;
  });

  const summary = {
    total: 120,
    registered: 85,
    pending: 30,
    blocked: 5
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900">학생 관리</h1>
        <p className="text-amber-700">허용된 학생 명단 및 상태 관리</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard
          title="총 학생 수"
          value={summary.total}
          icon={UserPlus}
          color="blue"
        />
        <AdminStatsCard
          title="가입 완료"
          value={summary.registered}
          icon={UserPlus}
          color="green"
        />
        <AdminStatsCard
          title="가입 대기"
          value={summary.pending}
          icon={UserPlus}
          color="amber"
        />
        <AdminStatsCard
          title="차단됨"
          value={summary.blocked}
          icon={UserPlus}
          color="red"
        />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="이름, 이메일, 학번 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체 기수</option>
              <option value="2024-08">2024-08</option>
              <option value="2024-09">2024-09</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체 상태</option>
              <option value="pending">가입 대기</option>
              <option value="registered">가입 완료</option>
              <option value="blocked">차단됨</option>
            </select>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Upload size={20} />
            <span>CSV 업로드</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <AdminTable
        data={filteredStudents}
        columns={studentColumns}
        actions={[
          {
            key: 'approve',
            label: '승인',
            variant: 'primary',
            onClick: (record) => handleStatusChange(record, 'registered'),
            disabled: (record) => record.status === 'registered'
          },
          {
            key: 'block',
            label: '차단',
            variant: 'danger',
            onClick: (record) => handleStatusChange(record, 'blocked'),
            disabled: (record) => record.status === 'blocked'
          },
          {
            key: 'edit',
            label: '편집',
            onClick: (record) => console.log('Edit student:', record.id)
          }
        ]}
        pagination={mockPagination}
        onPageChange={(page) => console.log('Page changed:', page)}
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">학생 명단 CSV 업로드</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기수 선택
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="2024-08">2024-08</option>
                <option value="2024-09">2024-09</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSV 파일
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  CSV 파일을 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  형식: name, email, student_id, department
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                >
                  파일 선택
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};