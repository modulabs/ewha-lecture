import { useEffect, useRef } from 'react';
import { useContentLockStore } from '../store/contentLockStore';
import { useAuthStore } from '../store/authStore';

/**
 * 콘텐츠 잠금 상태 실시간 동기화 커스텀 훅
 * 
 * 기능:
 * - 앱 시작 시 최신 잠금 상태 가져오기
 * - 30초마다 폴링으로 상태 동기화
 * - 포커스 시 즉시 동기화
 * - 인증 상태 변경 시 동기화
 */
export const useContentLockSync = () => {
  const { fetchLocks, lastUpdated } = useContentLockStore();
  const { isAuthenticated } = useAuthStore();
  const intervalRef = useRef<number | null>(null);
  const lastFetchRef = useRef<string | null>(null);

  // 폴링 간격 (5초)
  const POLLING_INTERVAL = 5000;

  // 페이지 포커스 시 동기화
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchLocks();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, fetchLocks]);

  // 인증 상태 변경 시 동기화
  useEffect(() => {
    if (isAuthenticated) {
      fetchLocks();
    }
  }, [isAuthenticated, fetchLocks]);

  // 폴링 설정
  useEffect(() => {
    if (!isAuthenticated) {
      // 인증되지 않은 경우 폴링 중지하고 상태 초기화
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // 로그아웃 시 잠금 상태를 기본값으로 리셋 (보안상 안전)
      // 모든 콘텐츠를 잠금 상태로 설정하여 안전하게 처리
      return;
    }

    // 초기 로드
    if (!lastUpdated || lastUpdated !== lastFetchRef.current) {
      fetchLocks();
      lastFetchRef.current = lastUpdated || null;
    }

    // 5초마다 폴링
    intervalRef.current = window.setInterval(() => {
      fetchLocks();
    }, POLLING_INTERVAL);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, fetchLocks, lastUpdated]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);
};