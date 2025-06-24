import { useEffect, useState } from 'react';

export const useFetchApi = (path, method, headers, body) => {

  console.log(1);
  
  const url = 'https://dev.wenivops.co.kr/services/mandarin';
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [url]);

  return {data};
};