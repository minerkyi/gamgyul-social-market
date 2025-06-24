import React, { useEffect, useState } from 'react';

export default function Sample() {

  const [token, setToken] = useState(null);
  const [count, setCount] = useState(0);

    const url = "https://dev.wenivops.co.kr/services/mandarin";
    const fetchData = async () => {
      try {
        const response = await fetch(url+"/user/login", {
            method: "POST",
            headers: {
              "Content-type" : "application/json"
            },
            body: JSON.stringify({
              "user": {
                "email": "test@test.com",
                "password": "1234!@#$"
              }
            })
        });
  
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('token', data.token);
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <>
      <h1 style={{fontSize: "20px"}}>토큰</h1>
      <br />
      <p>{token}</p>
      <br />
      <button onClick={fetchData}>생성</button>
    </>
  )
}