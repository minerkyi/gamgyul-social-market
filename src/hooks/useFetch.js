import { useState, useEffect, useCallback, useRef } from 'react';

// 기본 fetch 훅
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);

      // 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 새로운 AbortController 생성
      abortControllerRef.current = new AbortController();

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();

    // 컴포넌트 언마운트 시 요청 취소
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// API 요청을 위한 범용 훅
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, options = {}) => {
    return request(url, { method: 'GET', ...options });
  }, [request]);

  const post = useCallback((url, body, options = {}) => {
    return request(url, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  }, [request]);

  const put = useCallback((url, body, options = {}) => {
    return request(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    });
  }, [request]);

  const patch = useCallback((url, body, options = {}) => {
    return request(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
    });
  }, [request]);

  const del = useCallback((url, options = {}) => {
    return request(url, { method: 'DELETE', ...options });
  }, [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};

// 뮤테이션을 위한 훅 (생성, 수정, 삭제)
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (url, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return { data: result, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
};

// 페이지네이션을 위한 훅
export const usePaginatedFetch = (baseUrl, initialPage = 1, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPage = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      setError(null);

      const url = `${baseUrl}?page=${pageNum}&limit=${pageSize}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (pageNum === 1) {
        setData(result.data || []);
      } else {
        setData(prev => [...prev, ...(result.data || [])]);
      }

      setTotalCount(result.total || 0);
      setHasMore((result.data || []).length === pageSize);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, pageSize]);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage);
    }
  }, [loading, hasMore, page, fetchPage]);

  const refresh = useCallback(() => {
    setPage(1);
    setData([]);
    setHasMore(true);
    fetchPage(1);
  }, [fetchPage]);

  return {
    data,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh,
  };
};

// 인터셉터 기능이 있는 고급 fetch 훅
export const useAdvancedFetch = (baseURL = '') => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const requestInterceptors = useRef([]);
  const responseInterceptors = useRef([]);

  const addRequestInterceptor = useCallback((interceptor) => {
    requestInterceptors.current.push(interceptor);
  }, []);

  const addResponseInterceptor = useCallback((interceptor) => {
    responseInterceptors.current.push(interceptor);
  }, []);

  const request = useCallback(async (url, options = {}) => {
    try {
      setGlobalLoading(true);

      let finalUrl = baseURL + url;
      let finalOptions = { ...options };

      // 요청 인터셉터 실행
      for (const interceptor of requestInterceptors.current) {
        const result = await interceptor(finalUrl, finalOptions);
        if (result) {
          finalUrl = result.url || finalUrl;
          finalOptions = result.options || finalOptions;
        }
      }

      const response = await fetch(finalUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...finalOptions.headers,
        },
        ...finalOptions,
      });

      let data = null;
      if (response.ok) {
        data = await response.json();
      }

      // 응답 인터셉터 실행
      for (const interceptor of responseInterceptors.current) {
        const result = await interceptor(response, data);
        if (result) {
          data = result;
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    } finally {
      setGlobalLoading(false);
    }
  }, [baseURL]);

  return {
    request,
    globalLoading,
    addRequestInterceptor,
    addResponseInterceptor,
  };
};