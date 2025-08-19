import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Download, Users } from 'lucide-react';
import { userApi } from '../../../services/userApi';
import type { BulkCreateResult } from '../../../services/userApi';

export const UserBulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<BulkCreateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('CSV 파일만 업로드 가능합니다.');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
        setError('파일 크기는 10MB를 초과할 수 없습니다.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        setError('CSV 파일만 업로드 가능합니다.');
        return;
      }
      if (droppedFile.size > 10 * 1024 * 1024) { // 10MB
        setError('파일 크기는 10MB를 초과할 수 없습니다.');
        return;
      }
      setFile(droppedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const response = await userApi.bulkCreateUsers(file);
      if (response.success) {
        setResult(response.data);
        setFile(null);
        // 파일 입력 초기화
        const fileInput = document.getElementById('csv-file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "name,email,student_id,cohort,department,phone,role,password\n박테스트,test1@ewha.ac.kr,2024001,1기,컴퓨터공학과,010-1111-1111,student,password123\n이테스트,test2@ewha.ac.kr,2024002,1기,AI학과,010-2222-2222,student,password123";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900">CSV 사용자 일괄 등록</h2>
        <p className="text-blue-700">CSV 파일을 업로드하여 여러 사용자를 한 번에 등록할 수 있습니다.</p>
      </div>

      {/* Template Download */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1. CSV 템플릿 다운로드</h3>
        <p className="text-sm text-gray-600 mb-4">
          먼저 CSV 템플릿을 다운로드하고 사용자 정보를 입력하세요.
        </p>
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <Download size={16} />
          <span>템플릿 다운로드</span>
        </button>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">CSV 파일 형식:</h4>
          <code className="text-xs text-gray-700 block">
            name,email,student_id,cohort,department,phone,role,password
          </code>
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            <p>• <strong>name</strong>: 사용자 이름 (필수)</p>
            <p>• <strong>email</strong>: 이메일 주소 (필수, 고유값)</p>
            <p>• <strong>student_id</strong>: 학번 (선택)</p>
            <p>• <strong>cohort</strong>: 기수 (예: 1기, 2기)</p>
            <p>• <strong>department</strong>: 학과</p>
            <p>• <strong>phone</strong>: 전화번호</p>
            <p>• <strong>role</strong>: 역할 (student, instructor, admin)</p>
            <p>• <strong>password</strong>: 초기 비밀번호 (필수)</p>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2. CSV 파일 업로드</h3>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          `}
        >
          <div className="flex flex-col items-center space-y-4">
            <Upload size={48} className={`${file ? 'text-blue-600' : 'text-gray-400'}`} />
            
            {file ? (
              <div className="space-y-2">
                <p className="text-sm text-blue-600 font-medium">
                  선택된 파일: {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  크기: {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  CSV 파일을 드래그 앤 드롭하거나 클릭하여 선택하세요
                </p>
                <p className="text-xs text-gray-500">
                  최대 파일 크기: 10MB
                </p>
              </div>
            )}
            
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="csv-file"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              파일 선택
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>업로드 중...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>업로드</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Result */}
      {result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">업로드 결과</h3>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">생성됨</p>
                  <p className="text-2xl font-bold text-green-900">{result.created_count}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle size={20} className="text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">건너뜀</p>
                  <p className="text-2xl font-bold text-yellow-900">{result.skipped_count}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle size={20} className="text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">오류</p>
                  <p className="text-2xl font-bold text-red-900">{result.error_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">전체</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {result.created_count + result.skipped_count + result.error_count}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          {result.created_users.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-green-800 mb-3">
                생성된 사용자 ({result.created_users.length}명)
              </h4>
              <div className="bg-green-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {result.created_users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-green-800">
                        <strong>{user.name}</strong> ({user.email})
                      </span>
                      <span className="text-green-600 bg-green-200 px-2 py-1 rounded text-xs">
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result.skipped_users.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-yellow-800 mb-3">
                건너뛴 사용자 ({result.skipped_users.length}명)
              </h4>
              <div className="bg-yellow-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {result.skipped_users.map((user, index) => (
                    <div key={index} className="text-sm text-yellow-800">
                      <strong>Row {user.row}:</strong> {user.email} - {user.reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result.errors.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-red-800 mb-3">
                오류 ({result.errors.length}건)
              </h4>
              <div className="bg-red-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {result.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-800">
                      <strong>Row {error.row}:</strong> {error.error}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};