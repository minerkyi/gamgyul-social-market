import { useEffect, useState } from 'react';
import { useFetchApi } from '../hooks/useFetchApi';

export default function Sample() {
  const [token, setToken] = useState(null);

  const path = '/user/login';
  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email: 'test@test.com',
        password: '1234!@#$',
      },
    }),
  };

  const { result, isLoding, isError, fetchData } = useFetchApi();
  useEffect(() => {
    fetchData(path, options);
  }, []);

  const handleClick = async () => {
    const [data, isError] = await fetchData(path, options);
    if (!isError) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      console.log(data.token);
    }
  };

  return (
    <>
      <h1 style={{ fontSize: '20px' }}>토큰</h1>
      <br />
      <p>
        {isLoding
          ? '로딩 중...'
          : isError
          ? '오류 발생!!!'
          : result
          ? result.token
          : 'null'}
      </p>
      <br />
      <button onClick={handleClick}>생성</button>
    </>
  );
}
