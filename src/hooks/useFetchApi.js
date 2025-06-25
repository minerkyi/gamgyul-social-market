import { useCallback, useState } from 'react';

export const useFetchApi = (path, options) => {

  const url = 'https://dev.wenivops.co.kr/services/mandarin';
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const fetchData = async (body = null) => {
    if(!path) return;

    try {
      setIsLoading(true);
      setIsError(null);

      let newOption = {...options};
      if(body) {
        newOption = {...options, body};
      }
      const response = await fetch(url + path, newOption);
      const data = await response.json();

      if(!response.ok) {
        throw new Error(`${data.message}!!! 상태코드: ${response.status}`);
      } else {
        setResult(data);
        setIsError(false);
        return [data, false];
      }
    } catch(error) {
      setIsError(true);
      console.error(error);
      return [{message:error}, true];
    } finally {
      setIsLoading(false);
    }
  };

  return [fetchData, result, isLoading, isError];
};