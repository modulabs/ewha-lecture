import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminTableColumn, AdminTableAction, PaginationData } from '../../../types/admin';

interface AdminTableProps<T> {
  data: T[];
  columns: AdminTableColumn<T>[];
  actions?: AdminTableAction<T>[];
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function AdminTable<T extends { id: string }>({
  data,
  columns,
  actions,
  pagination,
  onPageChange,
  loading = false,
  emptyMessage = '데이터가 없습니다.'
}: AdminTableProps<T>) {
  const renderCell = (column: AdminTableColumn<T>, record: T) => {
    if (column.render) {
      return column.render(record[column.key as keyof T], record);
    }
    return String(record[column.key as keyof T] || '');
  };

  const renderActions = (record: T) => {
    if (!actions || actions.length === 0) return null;

    return (
      <div className="flex items-center space-x-2">
        {actions.map((action) => {
          const isDisabled = action.disabled?.(record) || false;
          const Icon = action.icon;
          
          return (
            <button
              key={action.key}
              onClick={() => !isDisabled && action.onClick(record)}
              disabled={isDisabled}
              className={`
                px-3 py-1 text-sm font-medium rounded border transition-colors
                ${action.variant === 'danger' 
                  ? 'border-red-300 text-red-700 hover:bg-red-50 disabled:text-red-300'
                  : action.variant === 'primary'
                  ? 'border-blue-300 text-blue-700 hover:bg-blue-50 disabled:text-blue-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-300'
                }
                disabled:cursor-not-allowed disabled:hover:bg-transparent
              `}
            >
              <div className="flex items-center space-x-1">
                {Icon && <Icon size={14} />}
                <span>{action.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderPagination = () => {
    if (!pagination || !onPageChange) return null;

    const { currentPage, totalPages, totalCount, limit } = pagination;
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalCount);

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            {totalCount > 0 ? `${start}-${end}` : '0'} / {totalCount}개 항목
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="px-3 py-1 text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {renderCell(column, record)}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {renderActions(record)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
}